import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");
  const isApiAdminRoute = pathname.startsWith("/api/admin");

  // 🚫 JANGAN PROTECT API LOGIN
  if (isLoginApi) {
    return NextResponse.next();
  }

  // PROTECT API ADMIN
  if (isApiAdminRoute && !token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: Admin token is missing" },
      { status: 401 }
    );
  }

  // PROTECT ADMIN PAGE
  if (isAdminRoute && !isLoginPage && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // JIKA SUDAH LOGIN JANGAN BALIK KE LOGIN
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};