import { updateOrderStatus } from "@/app/lib/orders";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const { status } = await request.json();
  const order = await updateOrderStatus(id, status);
  if (!order) {
    return Response.json({ success: false, error: "Order not found" }, { status: 404 });
  }
  return Response.json({ success: true, order });
}
