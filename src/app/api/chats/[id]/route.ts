import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { saveChatImage } from "@/lib/chat-files";
import {
  addChatMessage,
  getChatForUser,
  isChatMember,
  listChatMessages,
  memberCount,
} from "@/lib/direct-chat";

export const runtime = "nodejs";

async function gate(id: string) {
  const user = await getSessionUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 }) };
  }
  const chatId = Number(id);
  if (!chatId || !isChatMember(chatId, user.id)) {
    return { error: NextResponse.json({ error: "Không có cuộc trò chuyện này" }, { status: 404 }) };
  }
  return { user, chatId };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const g = await gate(id);
  if ("error" in g) return g.error;
  const chat = getChatForUser(g.chatId, g.user.id);
  return NextResponse.json({
    chat: {
      ...chat,
      members: memberCount(g.chatId),
    },
    messages: listChatMessages(g.chatId),
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const g = await gate(id);
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
  const messageId = addChatMessage(g.chatId, g.user.id, text, imageUrl, replyTo);
  if (!messageId) {
    return NextResponse.json({ error: "Nhập nội dung hoặc chọn ảnh" }, { status: 400 });
  }
  return NextResponse.json({ messages: listChatMessages(g.chatId) });
}
