import mongoose, { Schema } from "mongoose";

const shipmentSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
    },
    carrier: {
        type: String,
    },
    serviceCode: {
        type: String
    },
    trackingNumber: {
        type: String
    },
    labelUrl: {
        type: String
    },
    rate: {
        type: Number
    },
    shippingStatus: {
        type: String,
        enum: ["pending", "shipped", "in-transit", "delivered", "returned"],
        default: "pending"
    },
    events: [
        {
            status: String,
            timestamp: Date,
            location: Object,
            raw: Object
        }
    ]
}, { timestamps: true });

export const Shipment = mongoose.model("Shipment", shipmentSchema);