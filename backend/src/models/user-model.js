import mongoose, {Schema} from 'mongoose';

const addressSchema =  new Schema({
    street:{
        type: String,
    },
    city: {
        type: String,
        required: true
    },       
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    defaultAddress: {
        type: Boolean,
        default: false
    }
});

const userSchema = new Schema({
    _uid:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: [true, 'Name is required'], 
        trim: true,
    },
    email:{
        type: String,
        required: [true, 'Email is required'], 
        unique: true,
        trim: true,
        lowercase: true,
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    phone:{
        type: String
    },
    refreshToken:{
        type: String
    },
    address:[addressSchema],
    whislist:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    cart:[
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                default: 1,
                min: [1, 'Quantity can not be less than 1']
            }
        }
    ],
    isVerified:{
        type: Boolean,
        default: false
    }
},{timestamps: true})

export const User = mongoose.model("User", userSchema);