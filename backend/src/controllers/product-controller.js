import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Product } from "../models/product-model.js";

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, brand, stock } = req.body;
    if ([name, description, price, stock].some((field) => field?.trim === "")) {
        throw new apiError(400, "All fields are required");
    }
    const imageUrl = req.file?.path;
    if (!imageUrl) {
        throw new apiError(400, "Product image is required");
    }
    const product = new Product({
        name,
        description,
        price,
        category,
        brand,
        stock,
        images: [imageUrl],
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
    if (!product) {
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

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { price, stock } = req.body;

    const product = await Product.findById(id);
    if (!product) {
        new apiError(404, "Product not found");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
            $set: {
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

const getProducts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const keyword = req.query.keyword
        ? { name: { $regex: req.query.keyword, $options: 'i' } }
        : {};
    const category = req.query.category ? { category: req.query.category } : {};
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : Infinity;
    const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

    const query = { ...keyword, ...category, ...priceFilter };

    let sortBy = {};
    switch (req.query.sort) {
        case 'priceAsc':
            sortBy = { price: 1 };
            break;
        case 'priceDesc':
            sortBy = { price: -1 };
            break;
        case 'ratingDesc':
            sortBy = { ratings: -1 };
            break;
        case 'newest':
            sortBy = { createdAt: -1 };
            break;
        default:
            sortBy = { createdAt: -1 };
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
        .skip(skip)
        .limit(limit)
        .sort(sortBy);

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {
                    totalProducts,
                    currentPage: page,
                    totalPages: Math.ceil(totalProducts / limit),
                    products,
                },
                "Products  fetched successfully!!!"
            )
        );
});

const getProductById = asyncHandler(async (req, res)=>{
    const { productId } = req.params;
    if(!productId){
        throw new apiError(400, "Product ID is required")
    }

    const product = await Product.findById(productId);

    return res  
        .status(200)
            .json(
                new apiResponse(
                    200,
                    product,
                    "Product fetched sucessfully by ID"
                )
            )
});

export {
    createProduct,
    deleteProduct,
    updateProduct,
    getProducts,
    getProductById
}