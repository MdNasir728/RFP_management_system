import mongoose from "mongoose";
import { env } from "./env";

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Keeps DB connection logic isolated from app bootstrap.
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(env.MONGODB_URI);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    process.exit(1);
  }
};
