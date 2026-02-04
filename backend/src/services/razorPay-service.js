import express from "express";
import crypto from "crypto";
import { Product } from "../models/product-model.js";
import { Order } from "../models/order-model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const router = express.Router();

const validateRazorpaySignature = () => {
    try {
        router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
            const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

            const singnature = req.headers["x-razorpay-signature"];
            if (!singnature) {
                throw new apiError(400, "Signature missing");
            }

            const shasum = crypto.createHmac("sha256", secret);
            shasum.update(req.body.toString("utf-8"));
            const generatedSignature = shasum.digest("hex");

            if (generatedSignature !== singnature) {
                throw new apiError(400, "Invalid signature");
            }
            const event = JSON.parse(req.body);

            if (event.event === "payment.captured") {
                const payment = event.payload.payment.entity;
                const orderId = payment.order_id;

                const order = await Order.findOne({ "payment.razorpayOrderId": orderId });
                if (!order) {
                    throw new apiError(404, "Order not found");
                }
                order.payment.status = "paid";
                order.payment.razorpayPaymentId = payment.id;
                order.payment.transactionId = payment.id;
                order.orderStatus = "confirmed";

                for (const item of order.items) {
                    const product = await Product.findById(item.product);
                    if(!product){
                        throw new apiError(404, `Product with ID ${item.product} not found`);
                    }
                    if (product.stock > item.quantity) {
                        product.stock -= item.quantity;
                        await product.save();
                        item.price = product.price;
                        item.name = product.name; 
                    }else{
                        throw new apiError(400, `Only ${product.stock} items left in stock for product ${product.name}`);
                    }
                }
                await order.save();
            }

            if (event.event === "payment.failed") {
                const payment = event.payload.payment.entity;
                const orderId = payment.order_id;
                const order = await Order.findOne({ "payment.razorpayOrderId": orderId });
                if (!order) {
                    throw new apiError(404, "Order not found");
                }
                order.payment.status = "failed";
                order.orderStatus = "pending";
                await order.save();
            }
            return res
                .status(200)
                .json(
                    new apiResponse(200, [], "Webhook handled successfully")
                )
        })
    } catch (error) {
        throw new apiError(500, error.message || "Internal server error");
    }
}

export{
    validateRazorpaySignature
}