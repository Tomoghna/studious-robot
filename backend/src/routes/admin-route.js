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
import { restrictToIPs } from "../middlewares/ipWhitelist-middleware.js";

const router = express.Router();

router
  .route("/user")
  .get(authMiddleware, authorizeRoles("admin"), restrictToIPs, getAllUsers);

router
  .route("/ban/:uid")
  .post(authMiddleware, authorizeRoles("admin"), restrictToIPs, banUser);
router
  .route("/unban/:uid")
  .post(authMiddleware, authorizeRoles("admin"), restrictToIPs, unbanUser);
router
  .route("/orders")
  .get(authMiddleware, authorizeRoles("admin"), restrictToIPs, getAllOrders);
router
  .route("/order/:orderId")
  .patch(
    authMiddleware,
    authorizeRoles("admin"),
    restrictToIPs,
    updateOrderStatus,
  );

router
  .route("/category/create")
  .post(
    authMiddleware,
    authorizeRoles("admin"),
    restrictToIPs,
    upload.single("image"),
    createCategory,
  );
router
  .route("/category/:id")
  .delete(
    authMiddleware,
    authorizeRoles("admin"),
    restrictToIPs,
    deleteCategory,
  );
router
  .route("/category/edit/:id")
  .patch(
    authMiddleware,
    authorizeRoles("admin"),
    restrictToIPs,
    upload.single("image"),
    updateCategory
  );
router
  .route("/category")
  .get(getCategory);

export default router;
