import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createSite, publicSite, userSites } from "@/lib/sites";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  return NextResponse.json({
    sites: userSites(user.id).map(publicSite),
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  const body = (await request.json()) as { templateId?: string; name?: string };
  const site = createSite(user.id, body.templateId || "aura", body.name);
  return NextResponse.json({ site: publicSite(site) });
}
