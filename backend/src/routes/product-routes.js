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
import upload from "../middlewares/multer-middleware.js";

const router = express.Router();

router.route("/create").post(
  authMiddleware,
  authorizeRoles("admin"),
  upload.array("images", 5),
  createProduct
);
router.route("/delete/:id").delete(
    authMiddleware, 
    authorizeRoles("admin"), 
    deleteProduct
);
router.route("/update/:id").patch(
    authMiddleware, 
    authorizeRoles("admin"), 
    updateProduct
);
export default router;