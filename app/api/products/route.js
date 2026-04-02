import { connectDB } from "@/app/lib/mongodb";
import Product from "@/models/Product";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });
  return Response.json({ success: true, products });
}

export async function POST(request) {
  // Admin-only: verify cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET || "medvault2026";
  if (token !== secret) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await request.json();
  const product = await Product.create(body);
  return Response.json({ success: true, product }, { status: 201 });
}
