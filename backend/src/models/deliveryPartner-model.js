import mongoose, { Schema} from "mongoose";

const deliveryPartnerSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    displayName:{
        type: String,
    },
    credentials:{
        apikey:{
            type: String,
            required: true
        }
    },
    enabled:{
        type: Boolean,
        default: true
    },
    supportedCarriers: [String]
},{timestamps: true});

export const DeliveryPartner = mongoose.model("DeliveryPartner",deliveryPartnerSchema);