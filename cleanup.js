import mongoose from "mongoose";
import dotenv from "dotenv";
import foodModel from "./models/foodModel.js";

dotenv.config();

async function cleanOldImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await foodModel.deleteMany({
      image: { $not: { $regex: "^http" } } // Delete images NOT starting with http
    });

    console.log(`🗑️ Deleted ${result.deletedCount} old food items without Cloudinary URLs.`);

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
  }
}

cleanOldImages();
