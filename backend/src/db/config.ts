import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectToDb = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGO_URI not found in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
