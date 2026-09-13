import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getSessionUser, updateProfile } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  const form = await request.formData();
  const file = form.get("avatar");
  if (!(file instanceof File) || file.size < 20) {
    return NextResponse.json({ error: "Chưa có ảnh" }, { status: 400 });
  }
  if (file.size > 2_000_000) {
    return NextResponse.json({ error: "Ảnh tối đa 2MB" }, { status: 400 });
  }
  const dir = path.join(process.cwd(), "public", "avatars");
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${user.id}.jpg`;
  const buf = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, filename), buf);
  const url = `/avatars/${filename}?t=${Date.now()}`;
  updateProfile(user.id, { avatar_url: `/avatars/${filename}` });
  return NextResponse.json({ ok: true, avatarUrl: url });
}
