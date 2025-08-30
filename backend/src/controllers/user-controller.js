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
        throw new apiError(400, "Invalid credentials, please try again");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if ([email, password].some((field) => field?.trim === "")) {
        throw new apiError(400, "All fields are required");
    }
    const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
    try {
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
        throw new apiError(400, "Invalid credentials");
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }, {
        new: true
    }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("token", "", options)
        .cookie("refreshToken", "", options)
        .json(
            new apiResponse(
                200,
                [],
                "User logged out successfully!!!"
            )
        );
});

const loggedInUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-refreshToken");
    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                user,
                "User fetched successfully!!!"
            )
        );
});

const updateProfile = asyncHandler(async (req, res) => {
    const { name, newAddress, phone } = req.body;
    if ([newAddress, phone].some((field) => field?.trim === "")) {
        throw new apiError(400, "All fields are required");
    }
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                name,
                phone,
                address: [...req.user.address, newAddress]
            }
        }, {
        new: true
    }
    ).select("-refreshToken");

    console.log(user);

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                user,
                "Profile updated successfully!!!"
            )
        );
});

const updateAddess = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { address } = req.body;
    if (!id) {
        throw new apiError(400, "Address id is required");
    }
    if (!address || Object.keys(address).length === 0) {
        throw new apiError(400, "Address data is required");
    }
    const user = await User.findById(req.user._id).select("-refreshToken");
    const addressIndex = user.address.findIndex((addr) => addr._id.toString() === id);

    if (addressIndex === -1) {
        throw new apiError(404, "Address not found");
    }

    const updatedUser = await User.findOneAndUpdate(
        {
            _id: req.user._id,
            "address._id": id
        },
        {
            $set:
            {
                "address.$.street": address.street,
                "address.$.city": address.city,
                "address.$.state": address.state,
                "address.$.zip": address.zip
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedUser,
                "Address updated successfully!!!"
            )
        );
});

const deleteAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new apiError(400, "Address id is required");
    }
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $pull: {
                address: { _id: id }
            }
        },
        {
            new: true
        }
    ).select("-refreshToken");

    if (!user) {
        throw new apiError(404, "Address not found");
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                user,
                "Address deleted successfully!!!"
            )
        );
});

export {
    signupUser,
    loginUser,
    logoutUser,
    loggedInUser,
    updateProfile,
    updateAddess,
    deleteAddress
}