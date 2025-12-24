import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    // name: { type: String, required: true },
    // description: { type: String, required: true },
    // price: { type: Number, required: true },
    
    category: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL
   sno: { type: Number, required: true, default: 1 },
date: { type: Date, required: true, default: Date.now },
tagNo: { type: String, required: true, default: "-" },
plantName: { type: String, required: true, default: "-" },
reason: { type: String, required: true, default: "-" },
action: { type: String, required: true, default: "-" },
remark: { type: String, required: true, default: "-" },


  },
  { timestamps: true }
);

export default mongoose.models.food || mongoose.model("food", foodSchema);
