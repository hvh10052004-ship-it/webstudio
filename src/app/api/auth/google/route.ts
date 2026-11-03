import { NextResponse } from "next/server";
import { loginError, originOf } from "@/lib/socialLogin";

export const runtime = "nodejs";

export function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET?.trim()) {
    return loginError(
      request,
      "Chưa cấu hình GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET trong file .env",
    );
  }
  const redirect = `${originOf(request)}/api/auth/google/callback`;
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirect);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("prompt", "select_account");
  return NextResponse.redirect(url);
}
