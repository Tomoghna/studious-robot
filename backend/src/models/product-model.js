import mongoose, {Schema} from 'mongoose';

const productSchema = new Schema({
    name:{
        type: String,   
        required: [true, 'Product name is required'],
        trim: true,
    },
    description:{
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
    },
    price:{
        type: Number,
        required: [true, 'Product price is required'],
        trim: true,
    },
    category:{
        type: String,
        required: [true, 'Product category is required'],
        trim: true,
    },
    brand:{
        type: String,
        required: [true, 'Product brand is required'],
        trim: true,
    },
    stock:{
        type: Number,
        required: [true, 'Product stock is required'],
        trim: true,
    },
    images:[
        {
            type: String,
            required: [true, 'Product image is required'],
        }
    ],
    numOfReviews:{
        type: Number,
        default: 0
    },
    ratings:{
        type: Number,
        default: 0
    },
    reviews:[
        {
            userId:{
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            name:{
                type: String,
                required: true
            },
            rating:{
                type: Number,
                required: true,
                default: -1
            },
            comment:{
                type: String,
                required: true
            },
            ratedAt:{
                type: Date,
                default: Date.now
            }
        }
    ]
},{timestamps: true});

export const Product = mongoose.model("Product", productSchema);