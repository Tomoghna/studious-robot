import { admin } from "../../configs/firebase.js";
import apiError from "../utils/apiError.js";


export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            throw new apiError(401, "Unauthorized request!!");
        }
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log(decodedToken);

        if(!decodedToken){
            throw new apiError(401, "Unauthorized, token failed");
        }
        req.user = decodedToken;
        next();
    } catch (error) {
        throw new apiError(401, "Not authorized, token failed");
    }
}