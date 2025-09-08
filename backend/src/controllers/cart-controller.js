import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Cart } from "../models/cart-model.js";
import mongoose, { mongo, Schema } from "mongoose";

const addToCart = asyncHandler(async (req, res) => {
    const { item } = req.body;
    const userId = req.user._id;

    if([item].some((field) => field?.trim === "")){
        throw new apiError(400, "All fields are required");
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
        const newCart = new Cart({
            user: userId,
            items: item,
            totalItems: item.length,
            totalPrice: item.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
        });
        await newCart.save();

        return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    newCart,
                    "Cart created successfully!!!"
                )
            )
    } else {
        item.forEach((newItem) => {
            const existingItemIndex = cart.items.findIndex(
                (cartItem) => cartItem.product.toString() === newItem.product
            );
            if (existingItemIndex > -1) {
                cart.items[existingItemIndex].quantity += newItem.quantity;
                cart.items[existingItemIndex].price = newItem.price;
            } else {
                cart.items.push(newItem);
            }
        });
        cart.totalItems = cart.items.length;
        cart.totalPrice = cart.items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
        await cart.save();      
        return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    cart,
                    "Cart updated successfully!!!"
                )
            )
    }
});

const getCart = asyncHandler(async (req, res) => {  
    const userId =  req.user._id;

    console.log(userId);
    
    const cart = await Cart.aggregate([
        {
            $match: { userId }
        },  
        {
            $unwind: "$items"
        },
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $unwind: "$productDetails"
        },
        {
            $project: {
                _id: 0,
                productId: "$productDetails._id",
                name: "$productDetails.name",
                quantity: "$items.quantity",
                price: "$items.price",
                totalPrice: 1,
                totalItems: 1
            }
        }       
    ]);
    if (!cart) {
        throw new apiError(404, "Cart not found for this user");
    }
    console.log(cart);
});

export {
    addToCart,
    getCart
}