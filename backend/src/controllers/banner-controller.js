import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Banner } from "../models/banner-model.js";

const createBanner = asyncHandler(async(req, res)=>{
    if(!req.files || req.files?.length === 0){
        throw new apiError(400, "Image is required")
    }

    const imageUrl = req.files?.map((file) => file.path);
    if (!imageUrl){
        throw new apiError(400, "Image is required!")
    }

    const banner = await Banner.create({
        image: imageUrl
    })

    return res  
        .status(201)
        .json(new apiResponse(201, banner, "Banner created successfully!"))
})

const deleteBanner = asyncHandler(async(req, res)=>{
    const { id }= req.params;
    if(!id){
        throw new apiError(400, "Banner id required")
    }

    const banner = await Banner.findById(id);
    if(!banner){
        throw new apiError(400, "Banner not found")
    }

    await Banner.findByIdAndDelete(id);

    return res
        .status(200)
        .json(new apiResponse(200, [], "Banner deleted!"))
})

const getBanners = asyncHandler(async(req, res)=>{
    const banner = await Banner.find({});

    return res
        .status(200)
        .json(new apiResponse(200, banner, "Banner fetched successfully!"))
})

export { createBanner, deleteBanner, getBanners }