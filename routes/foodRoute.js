import express from "express";
import multer from "multer";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";

const foodRouter = express.Router();

// Store file in memory for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

foodRouter.get("/list", listFood);
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;
