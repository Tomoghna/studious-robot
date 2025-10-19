import axios from "axios";
import { DeliveryPartner } from "../models/deliveryPartner-model.js";
import { Shipment } from "../models/shipment-model.js";
import { ShippingRule } from "../models/shippingRule-model.js";
import { asyncHandler } from "../utils/async-handler.js";
import apiError from "../utils/api-error.js";
import apiResponse from "../utils/api-response.js";

const shippingRate = asyncHandler( async (req, res)=>{
    const { toAddress, fromAddress, parcels, subtotal } = req.body;
    if([toAddress,fromAddress,parcels,subtotal].some((field)=> field?.trim() === "")){
        throw new apiError(400, "All fields are required");
    } 
    
})