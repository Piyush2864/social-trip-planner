import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URL=process.env.MONGO_URI as string;
export const connectToDb = async() => {
    try {
        await mongoose.connect(MONGODB_URL, {});
        console.log("Successfully connected to MondoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};