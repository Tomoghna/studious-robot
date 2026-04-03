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
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

      const signature = req.headers["x-razorpay-signature"];

      if (!signature) {
        throw new apiError(400, "Signature missing");
      }

      const shasum = crypto.createHmac("sha256", secret);
      shasum.update(req.body);

      const generatedSignature = shasum.digest("hex");

      if (generatedSignature !== signature) {
        throw new apiError(400, "Invalid signature");
      }

      const event = JSON.parse(req.body.toString("utf-8"));

      if (event.event === "payment.captured") {
        const payment = event.payload.payment.entity;
        console.log("payment",payment);
        const orderId = payment.order._id;

        const order = await Order.findOne({
          "payment.razorpayOrderId": orderId,
        });

        if (!order) {
          throw new apiError(404, "Order not found");
        }

        order.payment.status = "paid";
        order.payment.razorpayPaymentId = payment.id;
        order.payment.transactionId = payment.id;
        order.orderStatus = "confirmed";

        for (const item of order.items) {
          const product = await Product.findById(item.product);

          if (!product) {
            throw new apiError(
              404,
              `Product with ID ${item.product} not found`
            );
          }

          if (product.stock >= item.quantity) {
            product.stock -= item.quantity;

            await product.save();

            item.price = product.price;
            item.name = product.name;
          } else {
            throw new apiError(
              400,
              `Only ${product.stock} items left in stock for product ${product.name}`
            );
          }
        }
        console.log("razorpay",order)

        await order.save();
      }

      if (event.event === "payment.failed") {
        const payment = event.payload.payment.entity;
        const orderId = payment.order._id;

        const order = await Order.findOne({
          "payment.razorpayOrderId": orderId,
        });

        if (!order) {
          throw new apiError(404, "Order not found");
        }

        order.payment.status = "failed";
        order.orderStatus = "pending";

        await order.save();
      }

      return res.status(200).json(
        new apiResponse(200, [], "Webhook handled successfully")
      );
    } catch (error) {
      next(error);
    }
  }
);

router.post("/verify-payment", async (req, res, next) => {
  try {
    const {
      orderId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    if (
      !orderId ||
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      throw new apiError(400, "All payment fields are required");
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      throw new apiError(400, "Invalid payment signature");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      throw new apiError(404, "Order not found");
    }

    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.razorpayOrderId = razorpay_order_id;
    order.payment.transactionId = razorpay_payment_id;
    order.payment.status = "paid";
    order.orderStatus = "confirmed";

    await order.save();

    return res.status(200).json(
      new apiResponse(
        200,
        {
          orderId: order._id,
          paymentId: razorpay_payment_id,
        },
        "Payment verified successfully"
      )
    );
  } catch (error) {
    next(error);
  }
});


export default router;