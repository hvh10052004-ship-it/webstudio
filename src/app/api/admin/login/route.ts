import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  cookieOptions,
  createSession,
  findUserByName,
  pinsMatch,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      password?: string;
    };
    const name = (body.name ?? "").trim();
    const password = (body.password ?? "").trim();
    if (name.length < 2) {
      return NextResponse.json(
        { error: "Tên đăng nhập ít nhất 2 ký tự" },
        { status: 400 },
      );
    }
    if (password.length < 4) {
      return NextResponse.json(
        { error: "Mật khẩu ít nhất 4 ký tự" },
        { status: 400 },
      );
    }

    const existing = findUserByName(name);
    if (!existing || existing.role !== "admin") {
      return NextResponse.json(
        { error: "Tài khoản quản trị không hợp lệ" },
        { status: 403 },
      );
    }
    if (!pinsMatch(password, existing.pin_salt, existing.pin_hash)) {
      return NextResponse.json({ error: "Mật khẩu không đúng" }, { status: 401 });
    }

    const token = createSession(existing.id);
    const res = NextResponse.json({ ok: true, name: existing.name });
    res.cookies.set(ADMIN_COOKIE, token, cookieOptions());
    return res;
  } catch {
    return NextResponse.json({ error: "Không đăng nhập được" }, { status: 500 });
  }
}
