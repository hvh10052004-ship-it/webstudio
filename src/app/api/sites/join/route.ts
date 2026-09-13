import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  addMember,
  getSiteByInvite,
  logActivity,
  publicSite,
  setCurrentSite,
} from "@/lib/sites";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  const body = (await request.json()) as { code?: string };
  const site = getSiteByInvite(body.code || "");
  if (!site) {
    return NextResponse.json({ error: "Mã mời không đúng" }, { status: 404 });
  }
  addMember(site.id, user.id, "editor");
  setCurrentSite(user.id, site.id);
  logActivity(site.id, user.id, "join", `${user.name} vào làm chung`);
  return NextResponse.json({ site: publicSite(site) });
}
