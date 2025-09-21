import express from "express";
import { 
    authMiddleware,
    authorizeRoles
 } from "../middlewares/auth-middleware.js";
 import{
    banUser,
    unbanUser
 } from "../controllers/admin-controller.js";
import { restrictToIPs } from "../middlewares/ipWhitelist-middleware.js";

const router = express.Router();

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
export default router;