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
})

const userSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        unique: true,   
        trim: true,
    },
    email:{
        type: String,
        required: [true, 'Email is required'], 
        unique: true,
        trim: true,
    },
    password:{
        type: password,
        required: [true, 'Password is required'],
        trim: true,
        minLength: [4, 'Password must be at least 4 characters long'],
        select: false
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    phone:{
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