import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },

    // ✅ Status (single definition)
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivered", "Cancelled"],
      default: "Pending",
    },

    // ✅ Payment method & status
    paymentMode: {
      type: String,
      enum: ["online", "cod"],
      required: true,
    },
    payment: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // ✅ createdAt & updatedAt will be added automatically
);

export default mongoose.model("orders", orderSchema);
