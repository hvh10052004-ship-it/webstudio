import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { updatePassword, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const body = (await request.json()) as {
    current?: string;
    next?: string;
  };
  const current = (body.current ?? "").trim();
  const next = (body.next ?? "").trim();
  if (!verifyPassword(gate.user.id, current)) {
    return NextResponse.json(
      { error: "Mật khẩu hiện tại không đúng" },
      { status: 401 },
    );
  }
  if (next.length < 4) {
    return NextResponse.json(
      { error: "Mật khẩu mới ít nhất 4 ký tự" },
      { status: 400 },
    );
  }
  updatePassword(gate.user.id, next);
  return NextResponse.json({ ok: true });
}
