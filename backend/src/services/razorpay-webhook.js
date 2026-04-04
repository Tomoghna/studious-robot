import express from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import { Product } from "../models/product-model.js";
import { Order } from "../models/order-model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const router = express.Router();

router.post("/",
  express.raw({ type: "application/json" }),
  async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
      console.log("Webhook hit");

      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

      if (!secret) {
        throw new apiError(500, "Webhook secret is missing");
      }

      const signature = req.headers["x-razorpay-signature"];

      if (!signature) {
        throw new apiError(400, "Signature missing");
      }

      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(req.body)
        .digest("hex");

      const isValidSignature = crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(signature),
      );

      if (!isValidSignature) {
        throw new apiError(400, "Invalid signature");
      }

      const event = JSON.parse(req.body.toString("utf8"));

      console.log("Webhook event:", event.event);

      // Handle successful payment
      if (event.event === "payment.captured") {
        const payment = event.payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        const order = await Order.findOne({
          "payment.razorpayOrderId": razorpayOrderId,
        }).session(session);

        if (!order) {
          throw new apiError(404, "Order not found");
        }

        // Prevent duplicate webhook processing
        if (order.stockReduced) {
          return res.status(200).json(
            new apiResponse(200, [], "Order already processed"),
          );
        }

        await session.startTransaction();

        order.payment.status = "paid";
        order.payment.razorpayPaymentId = payment.id;
        order.payment.transactionId = payment.id;
        order.orderStatus = "confirmed";

        for (const item of order.items) {
          const product = await Product.findById(item.product).session(session);

          if (!product) {
            throw new apiError(
              404,
              `Product with ID ${item.product} not found`,
            );
          }

          // If payment succeeded but stock is not enough
          if (product.stock < item.quantity) {
            order.orderStatus = "stock_issue";

            await order.save({ session });
            await session.commitTransaction();
            session.endSession();

            return res.status(200).json(
              new apiResponse(
                200,
                [],
                `Payment received but stock issue occurred for product ${product.name}`,
              ),
            );
          }

          product.stock -= item.quantity;
          await product.save({ session });

          item.price = product.price;
          item.name = product.name;
        }

        order.stockReduced = true;

        await order.save({ session });

        await session.commitTransaction();
      }

      // Handle failed payment
      if (event.event === "payment.failed") {
        const payment = event.payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        const order = await Order.findOne({
          "payment.razorpayOrderId": razorpayOrderId,
        }).session(session);

        if (!order) {
          throw new apiError(404, "Order not found");
        }

        order.payment.status = "failed";
        order.orderStatus = "pending";

        await order.save({ session });
      }

      session.endSession();

      return res
        .status(200)
        .json(new apiResponse(200, [], "Webhook handled successfully"));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  },
);

export default router;