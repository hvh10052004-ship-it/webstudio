import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { SITE_TYPES, type SiteTypeId } from "@/data/app-khach";
import {
  ensureSiteForType,
  publicSite,
  siteActivities,
  siteMembers,
  touchPresence,
  userTypeSites,
} from "@/lib/sites";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  const body = (await request.json()) as { typeId?: string };
  const typeId = body.typeId as SiteTypeId;
  if (!SITE_TYPES.some((t) => t.id === typeId)) {
    return NextResponse.json({ error: "Loại không hợp lệ" }, { status: 400 });
  }
  const site = ensureSiteForType(user.id, typeId);
  touchPresence(site.id, user.id);
  return NextResponse.json({
    site: publicSite(site),
    typeSites: userTypeSites(user.id),
    members: siteMembers(site.id),
    activities: siteActivities(site.id),
  });
}
