import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const db = getDb();
  const customers = (
    db
      .prepare(
        "SELECT COUNT(*) AS n FROM users WHERE COALESCE(role, 'customer') = 'customer'",
      )
      .get() as { n: number }
  ).n;
  const sites = (db.prepare("SELECT COUNT(*) AS n FROM sites").get() as { n: number })
    .n;
  const messages = db
    .prepare(
      `SELECT m.id, m.body, m.created_at, u.name AS user_name, s.name AS site_name
       FROM messages m
       JOIN users u ON u.id = m.user_id
       JOIN sites s ON s.id = m.site_id
       ORDER BY m.id DESC
       LIMIT 12`,
    )
    .all() as {
    id: number;
    body: string;
    created_at: string;
    user_name: string;
    site_name: string;
  }[];
  return NextResponse.json({
    customers,
    sites,
    messages,
    admin: { id: gate.user.id, name: gate.user.name },
  });
}
