import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name:{
                type: String,
                required: true,
                trim: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            }
        }
    ],
    productPrice:{
        type: Number,
        required: true
    },
    shippingPrice:{
        type: Number
    },  
    discount:{
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
    },
    shippingAddress: {
        type: String,
        required: true,
        trim: true,
    },
    orderStatus: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"],
        default: "pending"
    },
    payment: {
        method: { 
            type: String, 
            enum: ["COD", "Razorpay", "Stripe"], 
            required: true 
        },
        transactionId: { type: String },
        status: { 
            type: String, 
            enum: ["pending", "paid", "failed", "refunded","COD"], 
            default: "pending" 
        },
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String }
    },
    placedAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true});   

export const Order = mongoose.model("Order", orderItemSchema);