import { admin } from "../configs/firebase.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user-model.js";


export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization").replace("Bearer ", "");
        if(!token){
            throw new apiError(401, "Unauthorized request!!");
        }
        const decodedToken = await admin.auth().verifyIdToken(token);
        if(!decodedToken){
            throw new apiError(401, "Unauthorized, token failed");
        }
        
        const user = await User.findOne({ _uid: decodedToken.uid }).select("-refreshToken");
        if(!user || user.isBanned){  
            throw new apiError(401, "No User found or User has been banned!!");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401, "Not authorized, token failed");
    }
}

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden: Insufficient rights" });
    }
    next();
  };
};