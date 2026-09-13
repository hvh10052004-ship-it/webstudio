import { NextResponse } from "next/server";
import {
  getSessionUser,
  updatePassword,
  verifyPassword,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  const body = (await request.json()) as {
    current?: string;
    next?: string;
  };
  const current = (body.current ?? "").trim();
  const next = (body.next ?? "").trim();
  if (!verifyPassword(user.id, current)) {
    return NextResponse.json({ error: "Mật khẩu hiện tại không đúng" }, { status: 401 });
  }
  if (next.length < 4) {
    return NextResponse.json({ error: "Mật khẩu mới ít nhất 4 ký tự" }, { status: 400 });
  }
  updatePassword(user.id, next);
  return NextResponse.json({ ok: true });
}
