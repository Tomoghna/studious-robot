import express from "express";
import {
    createProduct,
} from "../controllers/product-controller.js";
import { 
    authMiddleware,
    authorizeRoles
 } from "../middlewares/auth-middleware.js";
import { restrictToIPs } from "../middlewares/ipWhitelist-middleware.js";
const router = express.Router();

router.route("/create").post(
    authMiddleware, 
    authorizeRoles("admin"), 
    restrictToIPs,
    createProduct
);

export default router;