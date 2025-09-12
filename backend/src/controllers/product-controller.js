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

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if(!product){
        throw new apiError(404, "Product not found");
    }

    await Product.findByIdAndDelete(id);

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                [],
                "Product deleted successfully!!!"
            )
        )   
});

const updateProduct = asyncHandler( async(req, res)=>{
    const { id } = req.params;
    const { price, stock }= req.body;

    const product = await Product.findById(id);
    if(!product){
        new apiError(404, "Product not found");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
            $set:{
                price,
                stock
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                updatedProduct,
                "Product details updated successfully!!"
            )
        )
});

export{
    createProduct,
    deleteProduct,
    updateProduct
}