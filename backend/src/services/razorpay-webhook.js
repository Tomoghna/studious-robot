import express from "express";
import crypto from "crypto";
import { Product } from "../models/product-model.js";
import { Order } from "../models/order-model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res, next) => {
    try {
      console.log("webhook hit")
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
      console.log("sec", secret)
      if (!secret) {
        throw new apiError(500, "Webhook secret is missing");
      }
      console.log("sig", signature)
      const signature = req.headers["x-razorpay-signature"];
      if (!signature) {
        throw new apiError(400, "Signature missing");
      }

      const shasum = crypto.createHmac("sha256", secret);
      shasum.update(req.body);

      const generatedSignature = shasum.digest("hex");

      console.log("gene", generatedSignature)

      if (generatedSignature !== signature) {
        throw new apiError(400, "Invalid signature");
      }

      const event = JSON.parse(req.body.toString("utf-8"));
      console.log("event", event)

      if (event.event === "payment.captured" || event.event === "order.paid" ) {
        const payment = event.payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        const order = await Order.findOne({
          "payment.razorpayOrderId": razorpayOrderId,
        });

        console.log("order", order);

        if (!order) {
          throw new apiError(404, "Order not found");
        }

        // Prevent duplicate stock reduction if webhook is triggered again
        if (order.payment.status === "paid") {
          return res
            .status(200)
            .json(new apiResponse(200, [], "Order already processed"));
        }

        order.payment.status = "paid";
        order.payment.razorpayPaymentId = payment.id;
        order.payment.razorpayOrderId = razorpayOrderId;
        order.payment.transactionId = payment.id;
        order.orderStatus = "confirmed";

        for (const item of order.items) {
          const product = await Product.findById(item.product);
          if (!product) {
            throw new apiError(
              404,
              `Product with ID ${item.product} not found`,
            );
          }

          if (product.stock < item.quantity) {
            throw new apiError(
              400,
              `Only ${product.stock} items left in stock for product ${product.name}`,
            );
          }

          product.stock -= item.quantity;
          await product.save();

          item.price = product.price;
          item.name = product.name;
        }

        await order.save();
      }

      if (event.event === "payment.failed") {
        const payment = event.payload.payment.entity;

        const razorpayOrderId = payment.order_id;

        const order = await Order.findOne({
          "payment.razorpayOrderId": razorpayOrderId,
        });

        if (!order) {
          throw new apiError(404, "Order not found");
        }

        order.payment.status = "failed";
        order.orderStatus = "pending";

        await order.save();
      }

      return res
        .status(200)
        .json(new apiResponse(200, [], "Webhook handled successfully"));
    } catch (error) {
      next(error);
    }
  },
);

export default router;
