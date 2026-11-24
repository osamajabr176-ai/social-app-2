import mongoose from "mongoose";
import { env } from "../config/env";

export async function connectDB() {
  await mongoose.connect(env.db.url, { serverSelectionTimeoutMS: 5000 });
  console.log("MongoDB connected");
}