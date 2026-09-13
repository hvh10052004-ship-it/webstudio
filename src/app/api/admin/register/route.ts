import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  cookieOptions,
  createSession,
  createUser,
  findUserByName,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      password?: string;
      confirm?: string;
    };
    const name = (body.name ?? "").trim();
    const password = (body.password ?? "").trim();
    const confirm = (body.confirm ?? "").trim();

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
    if (password !== confirm) {
      return NextResponse.json(
        { error: "Mật khẩu nhập lại không khớp" },
        { status: 400 },
      );
    }
    if (findUserByName(name)) {
      return NextResponse.json(
        { error: "Tên đăng nhập đã có người dùng" },
        { status: 409 },
      );
    }

    const userId = createUser(name, password, {
      nickname: name,
      role: "admin",
    });
    const token = createSession(userId);
    const res = NextResponse.json({ ok: true, name });
    res.cookies.set(ADMIN_COOKIE, token, cookieOptions());
    return res;
  } catch {
    return NextResponse.json({ error: "Không tạo tài khoản được" }, { status: 500 });
  }
}
