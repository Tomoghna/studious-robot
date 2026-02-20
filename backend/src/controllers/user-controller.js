import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user-model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import axios from "axios";
import { Product } from "../models/product-model.js";
import { admin } from "../configs/firebase.js";

const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if ([name, email, password].some((field) => field?.trim() === "")) {
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
        returnSecureToken: true,
      },
    );
    const { localId, refreshToken, idToken } = firebaseRes.data;
    const mongoUser = new User({
      _uid: localId,
      name,
      email,
      refreshToken,
    });

    await mongoUser.save();

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    return res
      .status(200)
      .json(
        new apiResponse(
          201,
          {
            user: mongoUser,
            idToken,
            refreshToken,
          },
          "User registered successfully!!!",
        ),
      );
  } catch (error) {
    const message =
      error.response?.data?.error?.message || error.message || "Signup failed";
    throw new apiError(400, message);
  }
});

const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new apiError(400, "ID Token required");
  }

  // Verify Firebase Token
  const decodedToken = await admin.auth().verifyIdToken(idToken);

  const { uid, email, name, picture } = decodedToken;

  let user = await User.findOne({ _uid: uid });

  if (!user) {
    user = await User.create({
      _uid: uid,
      name,
      email,
      avatar: picture,
    });
  }
   return res.status(200).json(
    new apiResponse(200, user, "Google login successful")
  );
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }
  const userExists = await User.findOne({ email });
  if (userExists.isBanned === true) {
    throw new apiError(400, "User is banned, please contact support");
  }
  const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
  try {
    const firebaseRes = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      },
    );
    const { localId, refreshToken, idToken } = firebaseRes.data;

    const user = await User.findOne({ _uid: localId }).select("-refreshToken");
    if (!user) {
      throw new apiError(400, "User with this email does not exist");
    }

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          {
            user,
            idToken,
            refreshToken,
          },
          "User logged in successfully!!!",
        ),
      );
  } catch (error) {
    const message =
      error.response?.data?.error?.message || error.message || "Login failed";
    throw new apiError(400, message);
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  await admin.auth().revokeRefreshTokens(req.user._uid);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };

  return res
    .status(200)
    .json(new apiResponse(200, [], "User logged out successfully!!!"));
});

const loggedInUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-refreshToken");
  return res
    .status(200)
    .json(new apiResponse(200, user, "User fetched successfully!!!"));
});

const saveProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  if ([name, phone].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        name,
        phone,
      },
    },
    {
      new: true,
    },
  ).select("-refreshToken");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Profile saved successfully!!!"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { AddLine1, pinCode, city, state } = req.body;
  if ([AddLine1, pinCode, city, state].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        address: [...req.user.address, { AddLine1, pinCode, city, state }],
      },
    },
    {
      new: true,
    },
  ).select("-refreshToken");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Profile updated successfully!!!"));
});

const updateAddess = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { AddLine1, pinCode, state, city } = req.body;
  if (!id) {
    throw new apiError(400, "Address id is required");
  }
  if ([AddLine1, pinCode, city, state].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }
  const user = await User.findById(req.user._id).select("-refreshToken");
  const addressIndex = user.address.findIndex(
    (addr) => addr._id.toString() === id,
  );

  if (addressIndex === -1) {
    throw new apiError(404, "Address not found");
  }

  const updatedUser = await User.findOneAndUpdate(
    {
      _id: req.user._id,
      "address._id": id,
    },
    {
      $set: {
        "address.$.AddLine1": AddLine1,
        "address.$.city": city,
        "address.$.state": state,
        "address.$.pinCode": pinCode,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return res
    .status(200)
    .json(new apiResponse(200, updatedUser, "Address updated successfully!!!"));
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new apiError(400, "Address id is required");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        address: { _id: id },
      },
    },
    {
      new: true,
    },
  ).select("-refreshToken");

  if (!user) {
    throw new apiError(404, "Address not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, user, "Address deleted successfully!!!"));
});

const addToWhislist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new apiError(400, "Product id is required");
  }
  const user = await User.findById(req.user._id).select("-refreshToken");
  if(!user){
    throw new apiError(404, "User not found");
  }
  if (user.whislist.includes(productId)) {
    throw new apiError(400, "Product already in wishlist");
  }
  user.whislist.push(productId);
  await user.save();
  return res
    .status(200)
    .json(
      new apiResponse(200, user, "Product added to wishlist successfully!!!"),
    );
});

const removeFromWhislist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new apiError(400, "Product id is required");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        whislist: productId,
      },
    },
    {
      new: true,
    },
  ).select("-refreshToken");

  if (!user) {
    throw new apiError(404, "Product not found in wishlist");
  }
  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        user,
        "Product removed from wishlist successfully!!!",
      ),
    );
});

const getWhislist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("whislist -_id")
    .populate("whislist");
  return res
    .status(200)
    .json(
      new apiResponse(200, user.whislist, "Wishlist fetched successfully!!!"),
    );
});

const giveReviewsToProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, rating, comment } = req.body;
  if (!productId) {
    throw new apiError(400, "Product id is required");
  }
  if (!rating || rating < 1 || rating > 5) {
    throw new apiError(400, "Star rating must be between 1 and 5");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  const user = await User.findById(req.user._id).select("-refreshToken");
  if (!user) {
    throw new apiError(404, "User not found");
  }

  const alreadyReviewed = product.reviews.find(
    (review) => review.userId.toString() === user._id.toString(),
  );
  if (alreadyReviewed) {
    throw new apiError(400,"You have already reviewed this product, please update review if needed!");
  } else {
    const review = {
      userId: user._id,
      name: name || user.name,
      rating: Number(rating),
      comment,
    };
    product.reviews.push(review);
    product.reviews.sort(
      (a, b) => new Date(b.ratedAt) - new Date(a.ratedAt),
    );
    product.numOfReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();
  }
  return res
    .status(200)
    .json(new apiResponse(200, product, "Review added successfully!!!"));
});

const updateReviewsOfUser = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  if (!productId) {
    throw new apiError(400, "Product id is required");
  }
  if (!rating || rating < 1 || rating > 5) {
    throw new apiError(400, "Star rating must be between 1 and 5");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  const user = await User.findById(req.user._id).select("-refreshToken");
  if (!user) {
    throw new apiError(404, "User not found");
  }

  const alreadyReviewed = product.reviews.find(
    (review) => review.userId.toString() === user._id.toString(),
  );

  if (!alreadyReviewed) {
    throw new apiError(400, "No review present to update!!");
  } else {
    alreadyReviewed.rating = rating;
    alreadyReviewed.comment = comment;
    await product.save();
  }

  return res
    .status(200)
    .json(new apiResponse(200, product, "Review updated successfully!!"));
});

export {
  signupUser,
  googleLogin,
  loginUser,
  logoutUser,
  loggedInUser,
  saveProfile,
  updateProfile,
  updateAddess,
  deleteAddress,
  addToWhislist,
  removeFromWhislist,
  getWhislist,
  giveReviewsToProduct,
  updateReviewsOfUser,
};
