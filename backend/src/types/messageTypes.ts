import mongoose from 'mongoose';
import { Document } from 'mongoose';


export interface Message extends Document {
    _id: string;
    tripId: mongoose.Types.ObjectId | string;
    userId: mongoose.Types.ObjectId | string;
    content: string;
}