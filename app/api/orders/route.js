import { getAllOrders, createOrder } from "@/app/lib/orders";

export async function GET() {
  const orders = await getAllOrders();
  return Response.json({ success: true, orders });
}

export async function POST(request) {
  const body = await request.json();
  const order = await createOrder(body);
  return Response.json({ success: true, order }, { status: 201 });
}
