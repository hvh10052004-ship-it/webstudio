import { finishLogin, loginError, originOf } from "@/lib/socialLogin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!code || !clientId || !clientSecret) {
    return loginError(request, "Google không trả về mã đăng nhập.");
  }
  const redirect = `${originOf(request)}/api/auth/google/callback`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirect,
      grant_type: "authorization_code",
    }),
  });
  const token = (await tokenRes.json()) as { access_token?: string };
  if (!token.access_token) {
    return loginError(request, "Không đăng nhập được bằng Google.");
  }
  const infoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  const info = (await infoRes.json()) as { email?: string; name?: string };
  if (!info.email) return loginError(request, "Google không cung cấp email.");
  return finishLogin(request, { name: info.name || info.email, email: info.email });
}
