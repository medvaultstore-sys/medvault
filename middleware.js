import { NextResponse } from "next/server";

// Protect /admin (but NOT /admin/login) using a cookie
export function middleware(request) {
  const token = request.cookies.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET || "medvault2026";

  if (token !== secret) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match /admin exactly (not /admin/login or other sub-routes)
  matcher: ["/admin"],
};
