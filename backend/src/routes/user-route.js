import express from 'express';
import {
    signupUser,
    loginUser,
    logoutUser,
    loggedInUser,
    updateProfile,
    updateAddess,
    deleteAddress
} from '../controllers/user-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = express.Router();   

router.route('/register').post(signupUser);
router.route('/login').post(loginUser);
router.route('/logout').post(authMiddleware, logoutUser);
router.route('/loggedinuser').get(authMiddleware, loggedInUser);
router.route('/updateprofile').patch(authMiddleware, updateProfile);
router.route('/updateaddress/:id').patch(authMiddleware, updateAddess);
router.route('/deleteaddress/:id').delete(authMiddleware, deleteAddress);

export default router;