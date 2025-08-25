import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user-model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import axios from "axios";


const signupUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => field?.trim === "")) {
        throw new apiError(400, "All fields are required");
    }
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new apiError(400, "User with this name or email already exists");
        }

        const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

        const firebaseRes = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true
            }
        );

        const { localId, refreshToken, idToken } = firebaseRes.data;

        const mongoUser = new User({
            _id: localId,
            name,
            email,
            refreshToken,
        });

        await mongoUser.save();

        return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    {
                        user: mongoUser,
                        idToken,
                        refreshToken
                    },
                    "User registered successfully!!!"
                )
            )
    } catch (error) {
        throw new apiError(500, error.message || "Something went wrong");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if ([email, password].some((field) => field?.trim === "")) {
        throw new apiError(400, "All fields are required");
    }
    try {
        const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
        const firebaseRes = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true
            }
        );

        const { localId, refreshToken, idToken } = firebaseRes.data;
        
        const user = await User.findById(localId).select("-refreshToken");
        if (!user) {
            throw new apiError(400, "User with this email does not exist");
        }

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("token", idToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new apiResponse(
                    200,
                    {
                        user,
                        idToken,
                        refreshToken
                    },
                    "User logged in successfully!!!"
                )
            )
    } catch (error) {
        throw new apiError(500, error.message || "Something went wrong");
    }
})

export {
    signupUser,
    loginUser
}