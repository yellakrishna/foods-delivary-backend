// controllers/foodController.js
import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// ✅ List all food
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});

    const updatedFoods = foods.map(food => {
      let imageUrl = food.image;

      // If image is not a Cloudinary URL, prefix with your server's image folder
      if (!imageUrl?.startsWith("http")) {
        imageUrl = `${req.protocol}://${req.get("host")}/images/${food.image}`;
      }

      return {
        ...food._doc,
        image: imageUrl
      };
    });

    res.json({ success: true, data: updatedFoods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};




// ✅ Add food (upload to Cloudinary from memory)
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "Image file is required" });
    }

    // Upload buffer to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "fish-delivery" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    // Save to MongoDB
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: result.secure_url // Cloudinary URL
    });

    await food.save();

    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding food" });
  }
};

// ✅ Remove food
const removeFood = async (req, res) => {
  try {
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

export { listFood, addFood, removeFood };
