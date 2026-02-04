import express from 'express';
import{
    createOrder,
    getOrders,
    cancelOrder
} from "../controllers/order-controller.js";
import { authMiddleware } from '../middlewares/auth-middleware.js';
const router = express.Router();

router.route("/create").post(authMiddleware, createOrder);
router.route("/").get(authMiddleware, getOrders);
router.route("/cancel/:orderId").patch(authMiddleware, cancelOrder);

export default router;