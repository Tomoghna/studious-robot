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

app.use("/api/v1/users", userRoutes);

export default app;