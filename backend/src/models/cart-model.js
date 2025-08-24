import mongoose, {Schema} from "mongoose";

const cartItemSchema = new Schema({
    product:{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity:{
        type: Number,
        required: true,
        default: 1
    },
    price:{
        type: Number,
        required: true
    }
},{
    _id: false
});

const cartSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    items:[cartItemSchema],
    totalPrice:{
        type: Number,
        required: true,
        default: 0
    },
    totalItems:{
        type: Number,
        required: true,
        default: 1
    }
},{timestamps: true});

export const Cart = mongoose.model("Cart", cartSchema);