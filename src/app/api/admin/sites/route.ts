import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const sites = getDb()
    .prepare(
      `SELECT s.id, s.name, s.type_id, s.template_id, s.invite_code,
              s.updated_at, u.name AS updated_by_name
       FROM sites s
       LEFT JOIN users u ON u.id = s.updated_by
       ORDER BY s.updated_at DESC`,
    )
    .all() as {
    id: number;
    name: string;
    type_id: string;
    template_id: string;
    invite_code: string;
    updated_at: string;
    updated_by_name: string | null;
  }[];
  return NextResponse.json({ sites });
}
