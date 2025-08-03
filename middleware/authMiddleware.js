import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // decoded should have user.id
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};


export default authMiddleware;
