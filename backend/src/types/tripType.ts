import mongoose from 'mongoose';
import {Document} from 'mongoose';

export interface Trip extends Document {
    _id: string;
    title: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    description: string;
    creator?: mongoose.Types.ObjectId | string;
    members: mongoose.Types.ObjectId |string[];
    participants: mongoose.Types.ObjectId |string[];
    joinRequests: mongoose.Types.ObjectId |string[];
    tags: string[];
}