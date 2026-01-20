import mongoose, {Schema} from "mongoose";

const categorySchema = new Schema({
    category:{
        type: String,
        required: true,
        unique: true
    },
    image:{
        type:String,
        required: true
    },
    totalCount:{
        type: Number,
        default:0
    }
}, { timestamps: true})

export const Category = mongoose.model("category", categorySchema);