import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PASS = ["/app-khach", "/api", "/_next", "/icons", "/avatars"];

const APP_PREFIXES = ["/mau", "/soan", "/xem", "/toi", "/chat"];

export function middleware(request: NextRequest) {
  if (process.env.APP_KHACH_SERVER !== "1") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (PASS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }
  if (
    pathname === "/sw.js" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/favicon.ico" ||
    pathname === "/WebStudio.apk" ||
    pathname === "/webstudio.apk"
  ) {
    return NextResponse.next();
  }
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  if (pathname === "/" || pathname === "") {
    url.pathname = "/app-khach";
    return NextResponse.rewrite(url);
  }
  if (APP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    url.pathname = `/app-khach${pathname}`;
    return NextResponse.rewrite(url);
  }

  url.pathname = "/app-khach";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
