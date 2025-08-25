import express from 'express';
import {
    signupUser,
    loginUser,
    logoutUser
} from '../controllers/user-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = express.Router();   

router.route('/register').post(signupUser);
router.route('/login').post(loginUser);
router.route('/logout').post(authMiddleware, logoutUser);

export default router;