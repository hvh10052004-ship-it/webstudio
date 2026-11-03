import { appleClientSecret, finishLogin, loginError, originOf } from "@/lib/socialLogin";

export const runtime = "nodejs";

function emailFromIdToken(idToken: string) {
  const part = idToken.split(".")[1];
  if (!part) return "";
  try {
    const json = JSON.parse(Buffer.from(part, "base64url").toString("utf8")) as {
      email?: string;
    };
    return json.email || "";
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  const form = await request.formData();
  const code = String(form.get("code") || "");
  const idToken = String(form.get("id_token") || "");
  const clientId = process.env.APPLE_CLIENT_ID?.trim();
  const secret = appleClientSecret();
  if (!code || !clientId || !secret) {
    return loginError(request, "Không đăng nhập được bằng iCloud.");
  }
  const redirect = `${originOf(request)}/api/auth/apple/callback`;
  const tokenRes = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: secret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirect,
    }),
  });
  const token = (await tokenRes.json()) as { id_token?: string };
  const email = emailFromIdToken(token.id_token || idToken);
  if (!email) return loginError(request, "iCloud không cung cấp email.");
  const userRaw = String(form.get("user") || "");
  let name = email;
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw) as { name?: { firstName?: string; lastName?: string } };
      const full = `${user.name?.firstName || ""} ${user.name?.lastName || ""}`.trim();
      if (full) name = full;
    } catch {
      name = email;
    }
  }
  return finishLogin(request, { name, email });
}
