import mongoose from "mongoose";
import dotenv from "dotenv";
import foodModel from "./models/foodModel.js";

dotenv.config();

async function previewOldImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Find all items that are NOT Cloudinary URLs
    const oldItems = await foodModel.find({
      image: { $not: { $regex: "^http" } }
    });

    if (oldItems.length === 0) {
      console.log("✅ No old images found — nothing to delete.");
    } else {
      console.log(`⚠️ Found ${oldItems.length} old food items without Cloudinary URLs:`);
      oldItems.forEach(item => {
        console.log(`- ${item.name} (${item.image})`);
      });
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Failed to preview old images:", error);
  }
}

previewOldImages();
