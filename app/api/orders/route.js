import { connectDB } from "@/app/lib/mongodb";
import Order from "@/app/lib/Order";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return Response.json({ success: true, orders });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const order = await Order.create(body);
    return Response.json({ success: true, order }, { status: 201 });
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
