import express from 'express';
import {
    addToCart,
    getCart,
    removeFromCart,
    removeItemCart
} from '../controllers/cart-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';
const router = express.Router();

router.route('/').get(authMiddleware, getCart);
router.route('/add/:productId').post(authMiddleware, addToCart);
router.route('/remove/:productId').post(authMiddleware, removeFromCart);
router.route('/remove-item/:productId').delete(authMiddleware, removeItemCart);

export default router;