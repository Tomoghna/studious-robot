import Razorpay from "razorpay";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order-model.js";
import { Product } from "../models/product-model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const createOrder = asyncHandler(async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const { items, shippingAddress, payment } = req.body;
  console.log("order", items, shippingAddress, payment);

  if (!items?.length || !shippingAddress || !payment) {
    throw new apiError(400, "All fields are required!");
  }

  let productPrice = 0;
  let razorpayOrder = null;

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new apiError(404, `Product with ID ${item.product} not found`);
    }

    if (product.stock < item.quantity) {
      throw new apiError(
        400,
        `Only ${product.stock} items left in stock for ${product.name}`,
      );
    }

    item.price = product.price;
    item.name = product.name;

    productPrice += product.price * item.quantity;

    if (payment === "COD") {
      product.stock -= item.quantity;
      await product.save();
    }
  }

  if (payment === "Razorpay") {
    if (productPrice < 100) {
      throw new apiError(400, "Minimum order amount is ₹100 for online payment");
    }
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: Math.round(productPrice * 100),
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      });
    } catch (razorpayError) {
      console.error("Razorpay order creation failed:", razorpayError);
      throw new apiError(500, `Razorpay error: ${razorpayError.message}`);
    }
  }

  let order;
  try {
    order = await Order.create({
      user: req.user._id,
      items,
      productPrice,
      shippingAddress,
      payment: {
        method: payment,
        status: payment === "COD" ? "COD" : "pending",
        razorpayOrderId: razorpayOrder ? razorpayOrder.id : null,
      },
    });
    console.log("created", order);
  } catch (orderError) {
    console.error("Order creation failed:", orderError);
    throw new apiError(500, `Order creation error: ${orderError.message}`);
  }

  return res.status(201).json(
    new apiResponse(
      201,
      {
        order,
        razorpayOrder,
      },
      "Order created successfully!!!",
    ),
  );
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "items.product",
  );
  return res
    .status(200)
    .json(new apiResponse(200, orders, "Orders fetched successfully!!!"));
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("items.product")
    .populate("user", "name email address phone");
  return res
    .status(200)
    .json(new apiResponse(200, orders, "All Orders fetched successfully!!!"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;
  if (
    ![
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ].includes(orderStatus)
  ) {
    throw new apiError(400, "Invalid status value!");
  }
  const order = await Order.findById(orderId);
  if (!order) {
    throw new apiError(404, "Order not found!");
  }
  order.orderStatus = orderStatus;
  order.updatedAt = Date.now();
  await order.save();
  return res
    .status(200)
    .json(new apiResponse(200, order, "Order status updated successfully!!!"));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new apiError(404, "Order not found!");
  }
  if (order.orderStatus === "cancelled") {
    throw new apiError(400, "Order is already cancelled!");
  }
  if (order.orderStatus === "pending" || order.orderStatus === "confirmed") {
    order.orderStatus = "cancelled";
    order.updatedAt = Date.now();
    await order.save();

    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    return res
      .status(200)
      .json(new apiResponse(200, order, "Order cancelled successfully!!!"));
  } else {
    throw new apiError(
      400,
      `Order cannot be cancelled as it is already ${order.orderStatus}`,
    );
  }
});

export { createOrder, getOrders, getAllOrders, updateOrderStatus, cancelOrder };
