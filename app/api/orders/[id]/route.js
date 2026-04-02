import { connectDB } from "@/app/lib/mongodb";
import Order from "@/app/lib/Order";

export async function PATCH(request, { params }) {
  await connectDB();
  const { id } = await params;
  const { status } = await request.json();
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!order) {
    return Response.json({ success: false, error: "Order not found" }, { status: 404 });
  }
  return Response.json({ success: true, order });
}
