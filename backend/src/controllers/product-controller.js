import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Product } from "../models/product-model.js";

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, brand, stock } = req.body;  
    if([name, description, price, stock].some((field) => field?.trim === "")){
        throw new apiError(400, "All fields are required");
    }
    const product = new Product({ 
        name, 
        description, 
        price, 
        category,
        brand,
        stock
    });
    await product.save();
    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                product,
                "Product created successfully!!!"
            )
        )
});

export{
    createProduct
}