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
            // required: [true, 'Product image is required'],
        }
    ],
    ratings:{
        type: Number,
        default: 0
    },
    numOfReviews:{
        type: Number,
        default: 0
    },
    reviews:[
        {
            user:{
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            name:{
                type: String,
                required: true
            },
            rating:{
                type: Number,
                required: true
            },
            comment:{
                type: String,
                required: true
            }
        }
    ]
},{timestamps: true});

export const Product = mongoose.model("Product", productSchema);