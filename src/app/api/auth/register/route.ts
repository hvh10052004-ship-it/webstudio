import { NextResponse } from "next/server";
import {
  COOKIE,
  cookieOptions,
  createSession,
  createUser,
  findUserByName,
  getUserById,
  markLogin,
  savePinHint,
} from "@/lib/auth";
import { customerSession, ensureDefaultSite } from "@/lib/sites";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      password?: string;
      nickname?: string;
      birthday?: string;
      phone?: string;
    };
    const name = (body.name ?? "").trim();
    const password = (body.password ?? "").trim();
    const nickname = (body.nickname ?? "").trim();
    const birthday = (body.birthday ?? "").trim();
    const phone = (body.phone ?? "").replace(/\D/g, "");

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
    if (nickname.length < 1) {
      return NextResponse.json({ error: "Nhập biệt danh" }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
      return NextResponse.json({ error: "Chọn ngày sinh" }, { status: 400 });
    }
    if (!/^0\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Số điện thoại gồm 10 số, bắt đầu bằng 0" },
        { status: 400 },
      );
    }
    if (findUserByName(name)) {
      return NextResponse.json(
        { error: "Tên đăng nhập đã có người dùng" },
        { status: 409 },
      );
    }

    const userId = createUser(name, password, { nickname, birthday, phone });
    ensureDefaultSite(userId);
    savePinHint(userId, password);
    markLogin(userId);
    const token = createSession(userId);
    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "Không đăng ký được" }, { status: 500 });
    }
    const session = customerSession(user);
    const res = NextResponse.json({ ...session, token, ok: true });
    res.cookies.set(COOKIE, token, cookieOptions());
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Không đăng ký được" }, { status: 500 });
  }
}
