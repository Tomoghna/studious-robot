import express from 'express';
import {
    addToCart,
    getCart,
} from '../controllers/cart-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';
const router = express.Router();

router.route('/').get(authMiddleware, getCart);
router.route('/add').post(authMiddleware, addToCart);

export default router;