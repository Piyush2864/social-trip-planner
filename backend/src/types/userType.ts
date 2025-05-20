import type {Document} from 'mongoose';
import mongoose from 'mongoose';

export interface Location{
    type: string;
    coordinates: Number[];
    country: string;
    city: string;
};

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    role: string;
    location: Location[];
    number: string;
    interests: string[];
    profilePic: string;
    friendRequests:mongoose.Types.ObjectId[];
    sendRequests:mongoose.Types.ObjectId[];
    friends:mongoose.Types.ObjectId[];
    matchPassword(password: string): Promise<boolean>;
}