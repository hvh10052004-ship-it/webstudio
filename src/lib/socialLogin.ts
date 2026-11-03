import { createSign } from "node:crypto";
import { NextResponse } from "next/server";

export function originOf(request: Request) {
  return new URL(request.url).origin;
}

export function loginError(request: Request, message: string) {
  const url = new URL("/neon-lamp-login.html", originOf(request));
  url.searchParams.set("loi", message);
  return NextResponse.redirect(url);
}

export function finishLogin(
  request: Request,
  profile: { name: string; email: string },
) {
  const url = new URL("/auth-xong.html", originOf(request));
  const res = NextResponse.redirect(url);
  res.cookies.set("ws-social", JSON.stringify(profile), {
    path: "/",
    maxAge: 120,
    sameSite: "lax",
  });
  return res;
}

export function appleClientSecret() {
  const team = process.env.APPLE_TEAM_ID?.trim();
  const keyId = process.env.APPLE_KEY_ID?.trim();
  const clientId = process.env.APPLE_CLIENT_ID?.trim();
  const privateKey = process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!team || !keyId || !clientId || !privateKey) return "";
  const header = Buffer.from(JSON.stringify({ alg: "ES256", kid: keyId })).toString(
    "base64url",
  );
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({
      iss: team,
      iat: now,
      exp: now + 60 * 30,
      aud: "https://appleid.apple.com",
      sub: clientId,
    }),
  ).toString("base64url");
  const data = `${header}.${payload}`;
  const sign = createSign("SHA256");
  sign.update(data);
  const sig = sign.sign({ key: privateKey, dsaEncoding: "ieee-p1363" });
  return `${data}.${sig.toString("base64url")}`;
}
