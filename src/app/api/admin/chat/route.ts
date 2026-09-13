import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { saveChatImage } from "@/lib/chat-files";
import {
  addMessage,
  getSite,
  listCustomerChatThreads,
  listMessagesForOwner,
  ownerSiteIds,
  replySiteForOwner,
  messageSiteId,
} from "@/lib/sites";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const url = new URL(request.url);
  const userId = Number(url.searchParams.get("userId") || 0);
  if (!userId) {
    return NextResponse.json({ threads: listCustomerChatThreads() });
  }
  const ids = ownerSiteIds(userId);
  if (!ids.length) {
    return NextResponse.json({ error: "Không tìm thấy khách" }, { status: 404 });
  }
  return NextResponse.json({
    userId,
    replySiteId: replySiteForOwner(userId),
    messages: listMessagesForOwner(userId),
  });
}

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const type = request.headers.get("content-type") || "";
  let userId = 0;
  let text = "";
  let imageUrl = "";
  let replyTo = 0;
  if (type.includes("multipart/form-data")) {
    const form = await request.formData();
    userId = Number(form.get("userId") || 0);
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
    const body = (await request.json()) as {
      userId?: number;
      text?: string;
      replyTo?: number;
    };
    userId = Number(body.userId || 0);
    text = body.text || "";
    replyTo = Number(body.replyTo || 0);
  }
  const siteId = replyTo
    ? messageSiteId(replyTo)
    : replySiteForOwner(userId);
  if (!userId || !siteId || !getSite(siteId)) {
    return NextResponse.json({ error: "Không tìm thấy khách" }, { status: 404 });
  }
  const id = addMessage(siteId, gate.user.id, text, imageUrl, replyTo);
  if (!id) {
    return NextResponse.json({ error: "Nhập nội dung hoặc chọn ảnh" }, { status: 400 });
  }
  return NextResponse.json({ messages: listMessagesForOwner(userId) });
}
