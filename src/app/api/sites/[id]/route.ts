import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  applyTemplate,
  getSite,
  isMember,
  publicSite,
  saveSiteBlocks,
  savedSiteChatMessage,
  addMessage,
  setSiteLocked,
  siteActivities,
  siteContentComplete,
  siteMembers,
  touchPresence,
  updateSiteType,
} from "@/lib/sites";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  const { id } = await context.params;
  const siteId = Number(id);
  if (!isMember(siteId, user.id)) {
    return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
  }
  const site = getSite(siteId);
  if (!site) return NextResponse.json({ error: "Không thấy site" }, { status: 404 });
  touchPresence(siteId, user.id);
  return NextResponse.json({
    site: publicSite(site),
    members: siteMembers(siteId),
    activities: siteActivities(siteId),
  });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  const { id } = await context.params;
  const siteId = Number(id);
  if (!isMember(siteId, user.id)) {
    return NextResponse.json({ error: "Không có quyền" }, { status: 403 });
  }
  const body = (await request.json()) as {
    blocks?: Record<string, Record<string, string>>;
    enabled?: Record<string, boolean>;
    detail?: string;
    templateId?: string;
    typeId?: string;
    locked?: boolean;
  };
  const site = getSite(siteId);
  if (!site) return NextResponse.json({ error: "Không thấy site" }, { status: 404 });
  if (body.locked === false) {
    setSiteLocked(siteId, user.id, false);
  }
  const currentLock = getSite(siteId)!;
  if (
    Boolean(currentLock.content_locked) &&
    (body.blocks || body.enabled || body.templateId || body.typeId)
  ) {
    return NextResponse.json(
      { error: "Thông tin đã lưu. Sửa ở tab Xem." },
      { status: 403 },
    );
  }
  if (body.templateId) {
    applyTemplate(siteId, user.id, body.templateId);
  }
  if (body.typeId) {
    updateSiteType(siteId, user.id, body.typeId);
  }
  if (body.blocks || body.enabled) {
    const current = getSite(siteId)!;
    saveSiteBlocks(
      siteId,
      user.id,
      body.blocks ?? JSON.parse(current.blocks_json),
      body.enabled ?? JSON.parse(current.enabled_json),
      body.detail || "Cập nhật nội dung",
    );
  }
  const saved = getSite(siteId)!;
  const complete = siteContentComplete(saved);
  let notified = false;
  if (body.locked === true && complete) {
    setSiteLocked(siteId, user.id, true);
    addMessage(siteId, user.id, savedSiteChatMessage(getSite(siteId)!));
    notified = true;
  }
  touchPresence(siteId, user.id);
  const next = getSite(siteId)!;
  return NextResponse.json({
    site: publicSite(next),
    members: siteMembers(siteId),
    activities: siteActivities(siteId),
    complete,
    notified,
  });
}
