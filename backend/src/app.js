import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import razorpayWebhookRoutes from "./services/razorpay-webhook.js";
import razorpayVerifyPayment from "./services/razorpay-verifyPayment.js";
import helmet from "helmet";

const app = express();

const OPTIONS = {
  origin: [
    "http://localhost:5173",
    "https://mayurhamsa.com",
  ],
  credentials: true,
};

app.use(cors(OPTIONS));
app.use(cookieParser());

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginEmbedderPolicy: false,
  }),
);

app.set("trust proxy", true);


app.use(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhookRoutes,
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Razorpay verify-payment
app.use("/api/v1/payment", razorpayVerifyPayment);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "Mayur Hamsa! Health check successful...",
  });
});

// Routes
import userRoutes from "./routes/user-route.js";
import cartRoutes from "./routes/cart-route.js";
import productRoutes from "./routes/product-routes.js";
import adminRoutes from "./routes/admin-route.js";
import orderRoutes from "./routes/order-route.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/users/cart", cartRoutes);
app.use("/api/v1/users/orders", orderRoutes);

app.use("/api/v1/admin/products", productRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorMiddleware);

export default app;