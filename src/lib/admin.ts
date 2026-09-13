import { NextResponse } from "next/server";
import { getAdminUser } from "./auth";
import type { UserRow } from "./db";

export async function requireAdmin(): Promise<
  { ok: true; user: UserRow } | { ok: false; response: NextResponse }
> {
  const user = await getAdminUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Chưa đăng nhập admin" }, { status: 401 }),
    };
  }
  if (user.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Không có quyền quản trị" }, { status: 403 }),
    };
  }
  return { ok: true, user };
}
