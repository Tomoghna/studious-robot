import express from "express";
import {
    createProduct,
    deleteProduct,
    updateProduct
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
router.route("/delete/:id").delete(
    authMiddleware, 
    authorizeRoles("admin"), 
    restrictToIPs,
    deleteProduct
);
export default router;