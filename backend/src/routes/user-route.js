import express from 'express';
import {
    signupUser,
    loginUser,
    logoutUser,
    loggedInUser,
    updateProfile,
    updateAddess,
    deleteAddress,
    addToWhislist,
    removeFromWhislist,
    getWhislist,
    giveReviewsToProduct,
    updateReviewsOfUser
} from '../controllers/user-controller.js';
import { 
    getProducts,
    getProductById
} from '../controllers/product-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = express.Router();   

router.route('/register').post(signupUser);
router.route('/login').post(loginUser);
router.route('/logout').post(authMiddleware, logoutUser);
router.route('/loggedinuser').get(authMiddleware, loggedInUser);
router.route('/updateprofile').patch(authMiddleware, updateProfile);
router.route('/updateaddress/:id').patch(authMiddleware, updateAddess);
router.route('/deleteaddress/:id').delete(authMiddleware, deleteAddress);
router.route('/addtowhislist/:productId').post(authMiddleware, addToWhislist);
router.route('/removefromwhislist/:productId').delete(authMiddleware, removeFromWhislist);
router.route('/getwhislist').get(authMiddleware, getWhislist);
router.route('/givereview/:productId').post(authMiddleware, giveReviewsToProduct);
router.route('/updatereview/:productId').patch(authMiddleware, updateReviewsOfUser);
router.route('/products').get(authMiddleware, getProducts);
router.route('/product/:productId').get(authMiddleware, getProductById);

export default router;