import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  connectByCode,
  createGroupChat,
  ensureChatCode,
  getChatForUser,
  listMyChats,
} from "@/lib/direct-chat";
import { currentSiteFor, isMember } from "@/lib/sites";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  const myCode = ensureChatCode(user.id);
  const site = currentSiteFor(user.id, user.current_site_id);
  const siteOk = site && isMember(site.id, user.id);
  return NextResponse.json({
    myCode,
    site: siteOk ? { id: site.id, name: site.name } : null,
    chats: listMyChats(user.id),
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  const body = (await request.json()) as { action?: string; code?: string };
  if (body.action === "create") {
    const chatId = createGroupChat(user.id);
    const chat = getChatForUser(chatId, user.id);
    return NextResponse.json({ chatId, code: chat?.code, chats: listMyChats(user.id) });
  }
  const result = connectByCode(user.id, body.code || "");
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ chatId: result.chatId, chats: listMyChats(user.id) });
}
