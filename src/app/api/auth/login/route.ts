import { NextResponse } from "next/server";
import {
  COOKIE,
  cookieOptions,
  createSession,
  findUserByName,
  getUserById,
  markLogin,
  pinsMatch,
  savePinHint,
} from "@/lib/auth";
import { customerSession, ensureDefaultSite } from "@/lib/sites";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      password?: string;
      pin?: string;
    };
    const name = (body.name ?? "").trim();
    const password = (body.password ?? body.pin ?? "").trim();
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
    if (!existing) {
      return NextResponse.json(
        { error: "Tài khoản chưa có. Hãy đăng ký." },
        { status: 404 },
      );
    }
    if (!pinsMatch(password, existing.pin_salt, existing.pin_hash)) {
      return NextResponse.json({ error: "Mật khẩu không đúng" }, { status: 401 });
    }
    if (existing.role === "admin") {
      return NextResponse.json(
        { error: "Tài khoản quản trị hãy đăng nhập tại /admin" },
        { status: 403 },
      );
    }

    ensureDefaultSite(existing.id);
    savePinHint(existing.id, password);
    markLogin(existing.id);
    const token = createSession(existing.id);
    const user = getUserById(existing.id);
    if (!user) {
      return NextResponse.json({ error: "Không đăng nhập được" }, { status: 500 });
    }
    const session = customerSession(user);
    const res = NextResponse.json({ ...session, token, ok: true });
    res.cookies.set(COOKIE, token, cookieOptions());
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Không đăng nhập được" }, { status: 500 });
  }
}
