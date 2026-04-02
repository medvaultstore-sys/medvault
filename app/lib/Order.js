import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String, required: true },
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
