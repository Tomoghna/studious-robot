import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

const OPTIONS = {
  origin: "*",
  Credentials: true,
}

app.use(cors({
    OPTIONS
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

//Routes
import userRoutes from "./routes/user-route.js";
import cartRoutes from "./routes/cart-route.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/cart", cartRoutes);

export default app;