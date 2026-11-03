import { NextResponse } from "next/server";
import { loginError, originOf } from "@/lib/socialLogin";

export const runtime = "nodejs";

export function GET(request: Request) {
  const clientId = process.env.APPLE_CLIENT_ID?.trim();
  if (!clientId) {
    return loginError(
      request,
      "Chưa cấu hình APPLE_CLIENT_ID trong file .env để đăng nhập iCloud.",
    );
  }
  const redirect = `${originOf(request)}/api/auth/apple/callback`;
  const url = new URL("https://appleid.apple.com/auth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirect);
  url.searchParams.set("response_type", "code id_token");
  url.searchParams.set("response_mode", "form_post");
  url.searchParams.set("scope", "name email");
  return NextResponse.redirect(url);
}
