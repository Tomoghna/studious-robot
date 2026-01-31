import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Product } from "../models/product-model.js";
import { Category } from "../models/category-model.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, brand, stock } = req.body;
  if (
    [name, description, category, brand].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }
  if (price === undefined || stock === undefined) {
    throw new apiError(400, "Price and stock are required");
  }

  if (price <= 0 || stock < 0) {
    throw new apiError(400, "Invalid price or stock value");
  }
  if (!req.files || req.files.length === 0) {
    throw new apiError(400, "Product images are required");
  }

  const imageUrl = req.files?.map((file) => file.path);
  if (!imageUrl) {
    throw new apiError(400, "Product image is required");
  }
  let categoryDoc = await Category.findById(category);

  if (!categoryDoc) {
    throw new apiError(400, "Invalid category");
  }

  const product = new Product({
    name,
    description,
    price,
    category: categoryDoc._id,
    brand,
    stock,
    images: imageUrl,
  });

  await Category.findByIdAndUpdate(categoryDoc._id, {
    $inc: {
      totalCount: 1,
    },
  });

  await product.save();
  return res
    .status(201)
    .json(new apiResponse(201, product, "Product created successfully!!!"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  const category = await Category.findById(product.category);
  if (!category) {
    throw new apiError(404, "Category not found");
  }

  await Category.findByIdAndUpdate(category._id, {
    $inc: {
      totalCount: -1,
    },
  });

  await Product.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new apiResponse(200, [], "Product deleted successfully!!!"));
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
        stock,
      },
    },
    {
      new: true,
    },
  );

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        updatedProduct,
        "Product details updated successfully!!",
      ),
    );
});

const getProducts = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();

  const products = await Product.find()
    .populate("category")
    .sort({ createdAt: -1 });

  if (products.length === 0) {
    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          { totalProducts: 0, products: [] },
          "No products found",
        ),
      );
  }

  return res.status(200).json(
    new apiResponse(
      200,
      {
        totalProducts,
        products,
      },
      "All products fetched successfully",
    ),
  );
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new apiError(400, "Product ID is required");
  }

  const product = await Product.findById(productId);

  return res
    .status(200)
    .json(new apiResponse(200, product, "Product fetched sucessfully by ID"));
});

const getproductByName = asyncHandler(async (req, res) => {
  const { name } = req.params;
  if (!name) {
    throw new apiError(400, "Product name is required!");
  }

  const product = await Product.findOne({ name });

  return res
    .status(200)
    .json(
      new apiResponse(200, product, "Product fetched successfully by name!"),
    );
});

const getCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  if (!categories) {
    throw new apiError(400, "No category of products available");
  }

  return res
    .status(200)
    .json(new apiResponse(200, categories, "Category fetched successfully!!"));
});

export {
  createProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  getProductById,
  getproductByName,
  getCategory,
};
