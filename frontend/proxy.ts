import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  userId: number;
  role: "USER" | "ADMIN";
  exp?: number;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    if (decoded.exp && Date.now() > decoded.exp * 1000) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (
      pathname.startsWith("/admin/dashboard") &&
      decoded.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }

    if (
      pathname.startsWith("/user/dashboard") &&
      decoded.role !== "USER"
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

  } catch {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/dashboard/:path*", "/admin/dashboard/:path*"],
};