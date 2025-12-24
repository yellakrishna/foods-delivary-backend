// import jwt from "jsonwebtoken";
// import userModel from "../models/user.js";

// const authMiddleware = (req, res, next) => {
//     const token = req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//         return res.status(401).json({ success: false, message: "Access denied. No token provided." });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // decoded should have user.id
//         next();
//     } catch (err) {
//         return res.status(401).json({ success: false, message: "Invalid token" });
//     }
// };


// export default authMiddleware;


import jwt from "jsonwebtoken";

// Private allowed email
const PRIVATE_EMAIL = "yella11@gmail.com";

 const authMiddleware = (req, res, next) => {
  // Get token from headers
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only allow the private email
    if (decoded.email !== PRIVATE_EMAIL) {
      return res.status(403).json({ message: "Forbidden: You are not allowed" });
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
export default authMiddleware;