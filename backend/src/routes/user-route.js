import express from 'express';
import {
    signupUser,
    loginUser
} from '../controllers/user-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = express.Router();   

router.route('/register').post(signupUser);
router.route('/login').post(loginUser);

export default router;