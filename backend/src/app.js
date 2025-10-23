import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

const OPTIONS = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}

app.use(cors(
    OPTIONS
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.set('trust proxy', true);

//Routes
import userRoutes from "./routes/user-route.js";
import cartRoutes from "./routes/cart-route.js";
import productRoutes from "./routes/product-routes.js";
import adminRoutes from "./routes/admin-route.js";
import orderRoutes from "./routes/order-route.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/users/cart", cartRoutes);
app.use("/api/v1/users/orders", orderRoutes);

app.use("/api/v1/admin/products", productRoutes);
app.use("/api/v1/admin/users", adminRoutes);

export default app;