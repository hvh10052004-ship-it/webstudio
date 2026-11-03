import { NextResponse } from "next/server";
import { checkCode, issueCode, sendGmailCode } from "@/lib/gmailCode";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      action?: string;
      name?: string;
      gmail?: string;
      code?: string;
    };
    const gmail = (body.gmail ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@gmail\.com$/.test(gmail)) {
      return NextResponse.json({ error: "Hãy nhập địa chỉ Gmail." }, { status: 400 });
    }

    if (body.action === "verify") {
      const code = (body.code ?? "").trim();
      if (!checkCode(gmail, code)) {
        return NextResponse.json({ error: "Mã không đúng hoặc đã hết hạn." }, { status: 400 });
      }
      return NextResponse.json({ ok: true });
    }

    const name = (body.name ?? "").trim();
    if (name.length < 2) {
      return NextResponse.json({ error: "Tên tài khoản ít nhất 2 ký tự." }, { status: 400 });
    }
    const code = issueCode(gmail, name);
    await sendGmailCode(gmail, code);
    return NextResponse.json({ ok: true, gmail });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không gửi được mã.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
