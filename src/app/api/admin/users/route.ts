import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const users = getDb()
    .prepare(
      `SELECT u.id, u.name, u.phone, u.email, u.nickname,
              COALESCE(u.role, 'customer') AS role,
              s.name AS site_name, s.id AS site_id
       FROM users u
       LEFT JOIN sites s ON s.id = u.current_site_id
       WHERE COALESCE(u.role, 'customer') = 'customer'
       ORDER BY u.id DESC`,
    )
    .all() as {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    nickname: string | null;
    role: string;
    site_name: string | null;
    site_id: number | null;
  }[];
  return NextResponse.json({ users });
}
