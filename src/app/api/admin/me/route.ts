import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const u = gate.user;
  return NextResponse.json({
    user: {
      id: u.id,
      name: u.name,
      phone: u.phone || "",
      email: u.email || "",
    },
  });
}
