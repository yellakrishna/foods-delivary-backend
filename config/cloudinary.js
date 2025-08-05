import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // e.g. new-cloud-name
  api_key: process.env.CLOUDINARY_API_KEY,        // e.g. 1234567890
  api_secret: process.env.CLOUDINARY_API_SECRET   // e.g. abcdefghijklmnop
});

export default cloudinary;
