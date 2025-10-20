import express from "express";
import { 
    authMiddleware,
    authorizeRoles
 } from "../middlewares/auth-middleware.js";
 import{
    getAllUsers,
    banUser,
    unbanUser
 } from "../controllers/admin-controller.js";
 import {
    getAllOrders,
    updateOrderStatus
 } from "../controllers/order-controller.js";
import { restrictToIPs } from "../middlewares/ipWhitelist-middleware.js";

const router = express.Router();

router.route("/user").get(
    authMiddleware,
    authorizeRoles("admin"),
    restrictToIPs,
    getAllUsers
)

router.route("/ban/:uid").post(
    authMiddleware,
    authorizeRoles("admin"),
    restrictToIPs,
    banUser
)
router.route("/unban/:uid").post(
    authMiddleware,
    authorizeRoles("admin"),
    restrictToIPs,
    unbanUser
)
router.route("/orders").get(
    authMiddleware,
    authorizeRoles("admin"),
    restrictToIPs,
    getAllOrders
)
router.route("/order/:orderId").patch(
    authMiddleware,
    authorizeRoles("admin"),
    restrictToIPs,
    updateOrderStatus
)
export default router;