import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";

import orderRouter from "./routes/orderRoute.js";
import dotenv from "dotenv";

// import adminRoutes from './routes/adminRoutes.js';
// import settingRoutes from './routes/settingRoutes.js';
import cartRouter from './routes/cartRoutes.js';





// Load environment variables
dotenv.config();

// App Config
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Database Connection
connectDB();


const allowedOrigins = [
  // "http://localhost:5173", // User frontend
  // "http://localhost:5174", // Admin frontend
  "https://new-online-delivery-frontend.vercel.app",
  "https://new-admin-gray.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS blocked for:", origin);
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Allow preflight requests for all routes
app.options("*", cors());



// ✅ Middleware
app.use(express.json());
app.use("/images", express.static("uploads"));

// ✅ API Routes
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.use("/images", express.static("uploads"));

// app.use('/api/admin', adminRoutes);
// app.use('/api/setting', settingRoutes);
// ✅ Default Route
app.get("/", (req, res) => {
  res.send("🚀 Fish Delivery API is working!");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
