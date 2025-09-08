import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Cart } from "../models/cart-model.js";
import { Product } from "../models/product-model.js";

const addToCart = asyncHandler(async (req, res) => {
    const { item } = req.body;
    const userId = req.user._id;

    if([item].some((field) => field?.trim === "")){
        throw new apiError(400, "All fields are required");
    }

    const cart = await Cart.findOne({ user: userId });

    if(cart === null){
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
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
        throw new apiError(404, "Cart not found");
    }       
    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                cart,
                "Cart fetched successfully!!!"
            )
        )
});

const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new apiError(404, "Cart not found");
    }
    const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
    );  
    if (itemIndex > -1) {
        cart.totalPrice -= cart.items[itemIndex].price * cart.items[itemIndex].quantity;
        cart.items.splice(itemIndex, 1);
        cart.totalItems = cart.items.length;
        await cart.save();
        return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    cart,
                    "Item removed from cart successfully!!!"
                )
            )
    } else {
        throw new apiError(404, "Item not found in cart");
    }   
});

export {
    addToCart,
    getCart,
    removeFromCart
}