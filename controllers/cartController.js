import userModel from "../models/user.js";

// Add item to user's cart
 const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;  // ✅ From token
        const { itemId } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = { ...user.cartData };
        cartData[itemId] = (cartData[itemId] || 0) + 1;

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.status(200).json({ success: true, message: "Item added to cart" });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Remove item from user's cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = { ...user.cartData };

    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) delete cartData[itemId];
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Get user's cart data
 const getCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user.cartData || {} });
  } catch (error) {
    console.error("Get cart error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addToCart, removeFromCart, getCart };
