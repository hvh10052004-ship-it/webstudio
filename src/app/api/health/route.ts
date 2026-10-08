import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const row = getDb()
      .prepare("SELECT COUNT(*) AS n FROM users")
      .get() as { n: number };
    return NextResponse.json({
      ok: true,
      db: true,
      users: row.n,
    });
  } catch {
    return NextResponse.json({ ok: false, db: false }, { status: 500 });
  }
}
