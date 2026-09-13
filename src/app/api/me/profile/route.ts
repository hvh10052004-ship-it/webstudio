import { NextResponse } from "next/server";
import { getSessionUser, updateProfile } from "@/lib/auth";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  const body = (await request.json()) as {
    nickname?: string;
    birthday?: string;
    gender?: string;
    email?: string;
    phone?: string;
  };

  if (body.nickname !== undefined) {
    const nickname = body.nickname.trim();
    if (nickname.length < 1) {
      return NextResponse.json({ error: "Nhập tên" }, { status: 400 });
    }
    updateProfile(user.id, { nickname });
  }
  if (body.birthday !== undefined) {
    const birthday = body.birthday.trim();
    if (birthday && !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
      return NextResponse.json({ error: "Ngày sinh không hợp lệ" }, { status: 400 });
    }
    updateProfile(user.id, { birthday });
  }
  if (body.gender !== undefined) {
    if (!["male", "female", ""].includes(body.gender)) {
      return NextResponse.json({ error: "Giới tính không hợp lệ" }, { status: 400 });
    }
    updateProfile(user.id, { gender: body.gender });
  }
  if (body.email !== undefined) {
    const email = body.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });
    }
    updateProfile(user.id, { email });
  }
  if (body.phone !== undefined) {
    const phone = body.phone.replace(/\D/g, "");
    if (!/^0\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Số điện thoại gồm 10 số, bắt đầu bằng 0" },
        { status: 400 },
      );
    }
    updateProfile(user.id, { phone });
  }

  return NextResponse.json({ ok: true });
}
