import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { saveChatImage } from "@/lib/chat-files";
import {
  addMessage,
  currentSiteFor,
  isMember,
  listMessages,
  setMessagePinned,
  touchPresence,
} from "@/lib/sites";

export const runtime = "nodejs";

async function gate() {
  const user = await getSessionUser();
  if (!user) return { error: NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 }) };
  const site = currentSiteFor(user.id, user.current_site_id);
  if (!isMember(site.id, user.id)) {
    return { error: NextResponse.json({ error: "Không có quyền" }, { status: 403 }) };
  }
  return { user, site };
}

export async function GET() {
  const g = await gate();
  if ("error" in g) return g.error;
  touchPresence(g.site.id, g.user.id);
  return NextResponse.json({
    siteId: g.site.id,
    siteName: g.site.name,
    messages: listMessages(g.site.id),
  });
}

export async function POST(request: Request) {
  const g = await gate();
  if ("error" in g) return g.error;
  const type = request.headers.get("content-type") || "";
  let text = "";
  let imageUrl = "";
  let replyTo = 0;
  if (type.includes("multipart/form-data")) {
    const form = await request.formData();
    text = String(form.get("text") || "");
    replyTo = Number(form.get("replyTo") || 0);
    const file = form.get("image");
    if (file instanceof File && file.size > 0) {
      const saved = await saveChatImage(file);
      if ("error" in saved) {
        return NextResponse.json({ error: saved.error }, { status: saved.status });
      }
      imageUrl = saved.url;
    }
  } else {
    const body = (await request.json()) as { text?: string; replyTo?: number };
    text = body.text || "";
    replyTo = Number(body.replyTo || 0);
  }
  const id = addMessage(g.site.id, g.user.id, text, imageUrl, replyTo);
  if (!id) {
    return NextResponse.json({ error: "Nhập nội dung hoặc chọn ảnh" }, { status: 400 });
  }
  touchPresence(g.site.id, g.user.id);
  return NextResponse.json({ messages: listMessages(g.site.id) });
}

export async function PATCH(request: Request) {
  const g = await gate();
  if ("error" in g) return g.error;
  const body = (await request.json()) as { id?: number; pinned?: boolean };
  const id = Number(body.id || 0);
  if (!id) {
    return NextResponse.json({ error: "Thiếu tin nhắn" }, { status: 400 });
  }
  const ok = setMessagePinned(g.site.id, id, Boolean(body.pinned));
  if (!ok) {
    return NextResponse.json({ error: "Không ghim được" }, { status: 404 });
  }
  return NextResponse.json({ messages: listMessages(g.site.id) });
}
