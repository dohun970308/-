import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/login은 누구나 접근 가능
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // /admin/* 경로만 인증 보호
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin-token");
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 그 외 모든 경로는 통과 (/, /cars/*, /notices/* 등)
  return NextResponse.next();
}

// /admin 경로에만 미들웨어 적용 — 다른 경로는 미들웨어 자체가 실행되지 않음
export const config = {
  matcher: ["/admin/:path*"],
};
