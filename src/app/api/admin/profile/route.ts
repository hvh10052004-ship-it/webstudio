import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import {
  findUserByName,
  updateLoginName,
  updateProfile,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    phone?: string;
  };

  if (body.name !== undefined) {
    const name = body.name.trim();
    if (name.length < 2) {
      return NextResponse.json(
        { error: "Tên đăng nhập ít nhất 2 ký tự" },
        { status: 400 },
      );
    }
    const existing = findUserByName(name);
    if (existing && existing.id !== gate.user.id) {
      return NextResponse.json(
        { error: "Tên đăng nhập đã có người dùng" },
        { status: 409 },
      );
    }
    updateLoginName(gate.user.id, name);
  }
  if (body.email !== undefined) {
    const email = body.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });
    }
    updateProfile(gate.user.id, { email });
  }
  if (body.phone !== undefined) {
    const phone = body.phone.replace(/\D/g, "");
    if (!/^0\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Số điện thoại gồm 10 số, bắt đầu bằng 0" },
        { status: 400 },
      );
    }
    updateProfile(gate.user.id, { phone });
  }

  return NextResponse.json({ ok: true });
}
