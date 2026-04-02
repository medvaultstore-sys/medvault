import { connectDB } from "@/app/lib/mongodb";
import Order from "@/app/lib/Order";

export async function GET() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return Response.json({ success: true, orders });
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const order = await Order.create(body);
  return Response.json({ success: true, order }, { status: 201 });
}
