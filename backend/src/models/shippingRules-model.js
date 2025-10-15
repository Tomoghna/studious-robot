import mongoose, { Schema } from "mongoose";

const shippingRuleSchema = new Schema({
    condition:{
        type: String,
        enum: ["subtotal","weight","region"],
        required: true
    },
    action:{
        type: String,
        enum:["flat","free","discount"],
        required: true
    },
    value:{
        type: Number,
        required: true
    },
    amount:{
        type: Number,
    },
},{ timestamps: true });

export const ShippingRule = mongoose.model("ShippingRule", shippingRuleSchema);