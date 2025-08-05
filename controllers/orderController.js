import orderModel from "../models/orderModel.js";
import userModel from "../models/user.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 📦 Place a New Order (Online or COD)
const placeOrder = async (req, res) => {
  try {
    const {  items, amount, address, paymentMode } = req.body;

    const userId = req.user.id;

     if (!address || !items || !amount || !paymentMode) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMode, // 'online' or 'cod'
      payment: paymentMode === 'cod' ? false : null,
      status: paymentMode === 'cod' ? 'Confirmed' : 'Pending',
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // ✅ If COD order, return immediately
    if (paymentMode === 'cod') {
      return res.status(201).json({
        success: true,
        message: "COD Order placed successfully",
        orderId: newOrder._id,
        paymentMode: "cod",
      });
    }
    

    // ✅ Stripe Checkout Session for Online Payment
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Add ₹30 Delivery Charge
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charge" },
        unit_amount: 3000,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `https://new-online-delivery-frontend.vercel.app/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: ` https://new-online-delivery-frontend.vercel.app/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    return res.status(201).json({
      success: true,
      session_url: session.url,
      orderId: newOrder._id,
      paymentMode: "online",
    });

  } catch (error) {
    console.error("❌ Order Placement Error:", error.message);
    res.status(500).json({ success: false, message: "Order placement failed" });
  }
};

// 📋 Admin - List All Orders
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).populate("userId", "name email");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ Order List Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};


const userOrders = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id; // ✅ covers all cases
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID not found" });
    }

    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ User Orders Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch user orders" });
  }
};

// 🛠 Admin - Update Order Status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.status(200).json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("❌ Status Update Error:", error.message);
    res.status(500).json({ success: false, message: "Status update failed" });
  }
};

// ✅ Stripe Payment Verification
const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        paymentMode: "online",
        status: "Confirmed",
      });
      return res.status(200).json({ success: true, message: "Payment verified" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.status(400).json({ success: false, message: "Payment failed, order deleted" });
    }
  } catch (error) {
    console.error("❌ Order Verification Error:", error.message);
    res.status(500).json({ success: false, message: "Order verification failed" });
  }
};

export {
  placeOrder,
  listOrders,
  userOrders,
  updateStatus,
  verifyOrder,
};
