import express from "express";
import crypto from "crypto";
import { Order } from "../models/order-model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const router = express.Router();

router.post("/verify-payment", async (req, res, next) => {
  try {
    if (!req.body) {
      throw new apiError(400, "Request body is empty");
    }

    const {
      orderId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    // Log for debugging
    console.log("Verify payment request:", {
      orderId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    if (!orderId) {
      throw new apiError(400, "Order ID is required");
    }

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      throw new apiError(400, "All payment fields are required");
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      throw new apiError(400, "Invalid payment signature");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      throw new apiError(404, "Order not found");
    }

    return res.status(200).json(
      new apiResponse(
        200,
        {
          orderId: order._id,
          paymentId: razorpay_payment_id,
        },
        "Payment verified successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
});

export default router;