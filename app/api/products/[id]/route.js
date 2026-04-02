import { connectDB } from "@/app/lib/mongodb";
import Product from "@/models/Product";
import { cookies } from "next/headers";

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET || "medvault2026";
  return token === secret;
}

export async function PUT(request, { params }) {
  if (!(await checkAdmin())) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!product) {
    return Response.json({ success: false, error: "Product not found" }, { status: 404 });
  }
  return Response.json({ success: true, product });
}

export async function DELETE(request, { params }) {
  if (!(await checkAdmin())) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { id } = await params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return Response.json({ success: false, error: "Product not found" }, { status: 404 });
  }
  return Response.json({ success: true });
}
