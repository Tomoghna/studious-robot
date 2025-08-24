import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user-model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { admin } from "../../configs/firebase.js";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => field?.trim === "")) {
        throw new apiError(400, "All fields are required");
    }
    try {
        const existingUser = await User.findOne({email});

        if (existingUser) {
            throw new apiError(400, "User with this name or email already exists");
        }

        const registerUser = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        const mongoUser = new User({
            _id: registerUser.uid,
            name: name,
            email: email,
        })

        await mongoUser.save();

        return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    {
                        user: mongoUser,
                        firebaseUser: registerUser,
                    },
                    "User registered successfully!!!"
                )
            )
    } catch (error) {
        throw new apiError(500, error.message || "Something went wrong");
    }
});


export {
    registerUser
}