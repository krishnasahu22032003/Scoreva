import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;
  
  if (
    pathname.startsWith("/user/dashboard") ||
    pathname.startsWith("/admin/dashboard")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/dashboard/:path*", "/admin/dashboard/:path*"],
};