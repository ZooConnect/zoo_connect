import mongoose from "mongoose";
import dotenv from "dotenv";

// Explicitly load the file from the current directory to be safe
dotenv.config({ path: './.env' }); 

export async function connectToDb() {
  try {
    // --- DEBUGGING BLOCK ---
    console.log("------------------------------------------------");
    console.log("DEBUG: Reading .env file...");
    console.log("DEBUG: MONGO_URI is:", process.env.MONGO_URI);
    console.log("------------------------------------------------");
    // -----------------------

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB via Mongoose");
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
}