import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Cart } from "../models/cart-model.js";
import { Product } from "../models/product-model.js";

const addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
        throw new apiError(404, "Product not found");
    }

    const cart = await Cart.findOne({ user: userId });
    if (cart === "undefined" || cart === null) {
        const newCart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity: 1, price: product.price }], 
            totalPrice: product.price,
            totalItems: 1
        });
        return res
            .status(201)
            .json(
                new apiResponse(
                    201,
                    newCart,
                    "Cart created and item added successfully!!!"
                )
            )
    } else {
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );  
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += 1;
            cart.totalPrice += product.price;
        } else {
            cart.items.push({ product: productId, quantity: 1, price: product.price });
            cart.totalPrice += product.price;
            cart.totalItems = cart.items.length;
        }   
        await cart.save();
        return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    cart,
                    "Item added to cart successfully!!!"
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
        const item = cart.items[itemIndex];
        item.quantity -= 1;
        cart.totalPrice -= item.price;  
        if (item.quantity <= 0){
            cart.items.splice(itemIndex, 1);
        }
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
        throw new apiError(404, "Product not found in cart");
    }
});

export {
    addToCart,
    getCart,
    removeFromCart
}