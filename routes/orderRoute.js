import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyOrder,
} from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.get("/list", listOrders);               // Get all orders (admin maybe)
orderRouter.post("/userorders", authMiddleware, userOrders);  // Get orders of logged-in user
orderRouter.post("/place", authMiddleware, placeOrder);       // Place an order
orderRouter.post("/status", updateStatus);             // Update order status
orderRouter.post("/verify", verifyOrder);              // Verify payment (Razorpay etc)
orderRouter.post("/cash-order", authMiddleware, placeOrder);  // For COD orders

export default orderRouter;
