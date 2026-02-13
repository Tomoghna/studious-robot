import express from "express";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/auth-middleware.js";
import {
  getAllUsers,
  banUser,
  unbanUser,
} from "../controllers/admin-controller.js";
import {
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order-controller.js";
import {
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory
} from "../controllers/category-controller.js";
import upload from "../middlewares/multer-middleware.js";

const router = express.Router();

router
  .route("/user")
  .get(authMiddleware, authorizeRoles("admin"), getAllUsers);

router
  .route("/ban/:uid")
  .post(authMiddleware, authorizeRoles("admin"), banUser);
router
  .route("/unban/:uid")
  .post(authMiddleware, authorizeRoles("admin"), unbanUser);
router
  .route("/orders")
  .get(authMiddleware, authorizeRoles("admin"), getAllOrders);
router
  .route("/order/:orderId")
  .patch(
    authMiddleware,
    authorizeRoles("admin"),
    updateOrderStatus,
  );

router
  .route("/category/create")
  .post(
    authMiddleware,
    authorizeRoles("admin"),
    upload.single("image"),
    createCategory,
  );
router
  .route("/category/:id")
  .delete(
    authMiddleware,
    authorizeRoles("admin"),
    deleteCategory,
  );
router
  .route("/category/edit/:id")
  .patch(
    authMiddleware,
    authorizeRoles("admin"),
    upload.single("image"),
    updateCategory
  );
router
  .route("/category")
  .get(getCategory);

export default router;
