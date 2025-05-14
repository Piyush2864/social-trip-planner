import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { Location, IUser } from "../types/userType";

const locationSchema = new Schema<Location>({
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
})

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: [locationSchema],
        default: []
    },
    number: {
        type: String,
        required: true
    },
    interests: {
        type:[String]
    },
    profilePic: {
        type: String
    }
}, {timestamps: true});;

userSchema.pre('save', async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next()
})

userSchema.methods.matchPassword = async function(password : string) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;