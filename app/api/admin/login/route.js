import { cookies } from "next/headers";

// POST /api/admin/login — set admin cookie
export async function POST(request) {
  const { password } = await request.json();
  const secret = process.env.ADMIN_SECRET || "medvault2026";

  if (password !== secret) {
    return Response.json({ success: false, error: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_token", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return Response.json({ success: true });
}

// DELETE /api/admin/login — clear admin cookie (logout)
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  return Response.json({ success: true });
}
