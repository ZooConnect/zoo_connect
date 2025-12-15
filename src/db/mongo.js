import mongoose from "mongoose";

export async function connectToDb() {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing. Check your .env file and dotenv.config path.");
    throw new Error("Missing MONGO_URI");
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB:", mongoose.connection.name);
}
