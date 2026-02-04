import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Product } from "../models/product-model.js";
import { Category } from "../models/category-model.js";

const createCategory = asyncHandler(async (req, res) => {
  const { category } = req.body;
  const image = req.file.path;

  if (!category) {
    throw new apiError(400, "Category name is required");
  }
  if (!image) {
    throw new apiError(400, "Image is required!");
  }

  let categoryDoc = await Category.findOne({ category });
  if (!categoryDoc) {
    categoryDoc = await Category.create({
      category,
      image,
    });
  }

  return res
    .status(201)
    .json(
      new apiResponse(201, categoryDoc, "Category created successfully!!!"),
    );
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const categoryDoc = await Category.findById(id);
  if (!categoryDoc) {
    throw new apiError(400, "No such category found");
  }

  await Category.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new apiResponse(200, [], "Category deleted successfully!!!"));
});

const getCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  if (!categories) {
    throw new apiError(400, "No category found!");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, categories, "Categories fetched successfully!!!"),
    );
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  const image = req.file?.path;

  if (!id) {
    throw new apiError(400, "Id required!");
  }

  const categoryDoc = await Category.findById(id);
  if (!categoryDoc) {
    throw new apiError(400, "No category found!");
  }

  await Category.findByIdAndUpdate(
    id,
    {
      $set: {
        category,
        image,
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
        [],
        "Category updated successfully!!!"
    )
  )
});

export { createCategory, deleteCategory, getCategory, updateCategory };
