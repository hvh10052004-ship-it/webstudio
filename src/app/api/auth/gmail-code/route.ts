import { NextResponse } from "next/server";
import {
  COOKIE,
  cookieOptions,
  createSession,
  createUser,
  findUserByLogin,
  findUserByName,
  markLogin,
  savePinHint,
  updateProfile,
} from "@/lib/auth";
import { consumePending, issueCode, sendGmailCode } from "@/lib/gmailCode";
import { ensureDefaultSite } from "@/lib/sites";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      action?: string;
      name?: string;
      gmail?: string;
      password?: string;
      code?: string;
    };
    const gmail = (body.gmail ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@gmail\.com$/.test(gmail)) {
      return NextResponse.json({ error: "Hãy nhập địa chỉ Gmail." }, { status: 400 });
    }

    if (body.action === "verify") {
      const code = (body.code ?? "").trim();
      const pending = consumePending(gmail, code);
      if (!pending) {
        return NextResponse.json({ error: "Mã không đúng hoặc đã hết hạn." }, { status: 400 });
      }
      if (findUserByName(pending.name) || findUserByLogin(gmail)) {
        return NextResponse.json({ error: "Tài khoản hoặc Gmail đã có người dùng." }, { status: 409 });
      }
      if (pending.password.length < 4) {
        return NextResponse.json({ error: "Mật khẩu không hợp lệ." }, { status: 400 });
      }
      const userId = createUser(pending.name, pending.password, {
        nickname: pending.name,
      });
      updateProfile(userId, { email: gmail });
      ensureDefaultSite(userId);
      savePinHint(userId, pending.password);
      markLogin(userId);
      const token = createSession(userId);
      const res = NextResponse.json({ ok: true, token });
      res.cookies.set(COOKIE, token, cookieOptions());
      return res;
    }

    const name = (body.name ?? "").trim();
    const password = (body.password ?? "").trim();
    if (name.length < 2) {
      return NextResponse.json({ error: "Tên tài khoản ít nhất 2 ký tự." }, { status: 400 });
    }
    if (password.length < 4) {
      return NextResponse.json({ error: "Mật khẩu ít nhất 4 ký tự." }, { status: 400 });
    }
    if (findUserByName(name) || findUserByLogin(gmail)) {
      return NextResponse.json({ error: "Tài khoản hoặc Gmail đã có người dùng." }, { status: 409 });
    }
    const code = issueCode(gmail, name, password);
    await sendGmailCode(gmail, code);
    return NextResponse.json({ ok: true, gmail });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không gửi được mã.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
