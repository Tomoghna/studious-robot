import { admin } from "../configs/firebase.js";
import { User } from "../models/user-model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUsers = asyncHandler(async(req, res)=>{
    const users = await User.find({role:"user"});  
    return res
        .status(200)
        .json(  
            new apiResponse(
                200,
                users,
                "All users fetched successfully!!!"
            )
        )
})

const banUser = asyncHandler(async(req, res)=>{
    const { uid } = req.params;

    if(!uid){
        throw new apiError(400, "uid is required to ban!!!")
    }

    const user = await User.findOne({ _uid: uid });
    if(user.isBanned){
        throw new apiError(404, "User already banned!")
    }

    await admin.auth().updateUser(uid, { disabled : true});

    await admin.auth().revokeRefreshTokens(uid);

    await User.findOneAndUpdate({ _uid: uid }, { isBanned: true });

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                [],
                "User banned successfully!!!"
            )
        )
})

const unbanUser = asyncHandler(async(req, res)=>{
    const { uid } = req.params;
    if(!uid){
        throw new apiError(400, "uid is requied!")
    }

    const user = await User.findOne({ _uid: uid });
    if(!user.isBanned){
        throw new apiError(404, "User not banned!")
    }

    await admin.auth().updateUser(uid, { disabled: false });

    await User.findOneAndUpdate({ _uid: uid}, { isBanned: false });

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                [],
                "User unbanned successfully!!!"
            )
        )
})

export{
    getAllUsers,
    banUser,
    unbanUser
}