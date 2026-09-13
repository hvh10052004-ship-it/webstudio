"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { AppShell } from "@/components/app-khach/AppShell";
import { AuthGate } from "@/components/app-khach/AuthGate";
import { ChatThread } from "@/components/app-khach/ChatThread";
import { useCollab } from "@/components/app-khach/CollabProvider";
import { authHeaders } from "@/components/app-khach/session-client";

export default function ChatRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <AppShell active="chat">
      <AuthGate>
        {id === "site" ? <SiteRoom /> : <DirectRoom id={id} />}
      </AuthGate>
    </AppShell>
  );
}

function SiteRoom() {
  const { data } = useCollab();
  return (
    <div className="app-chat-screen">
      <header className="app-home-top">
        <div>
          <Link href="/app-khach/chat" className="app-chat-back">
            ← Chat
          </Link>
          <h1>{data?.site.name ?? "Nhóm site"}</h1>
          <p>Người cùng soạn website này · lướt trái để hồi tin</p>
        </div>
      </header>
      <ChatThread
        meId={data?.user.id}
        loadUrl="/api/chat"
        emptyText="Chưa có tin. Gửi chữ hoặc ảnh, lướt trái để hồi tin."
      />
    </div>
  );
}

function DirectRoom({ id }: { id: string }) {
  const { data } = useCollab();
  const [title, setTitle] = useState("Trò chuyện");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void fetch(`/api/chats/${id}`, {
      credentials: "include",
      cache: "no-store",
      headers: authHeaders(),
    })
      .then((r) => r.json())
      .then((json) => {
        const chat = (json as { chat?: { title: string; code: string } }).chat;
        if (chat?.title) setTitle(chat.title);
        if (chat?.code) setCode(chat.code);
      });
  }, [id]);

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="app-chat-screen">
      <header className="app-home-top">
        <div>
          <Link href="/app-khach/chat" className="app-chat-back">
            ← Chat
          </Link>
          <h1>{title}</h1>
          <p>
            Mã phòng {code || "…"} ·{" "}
            <button type="button" className="app-chat-share" onClick={() => void copyCode()}>
              {copied ? "Đã copy mã" : "Sao chép mã để mời"}
            </button>
          </p>
        </div>
      </header>
      <ChatThread
        meId={data?.user.id}
        loadUrl={`/api/chats/${id}`}
        emptyText="Đã kết nối. Gửi tin nhắn đầu tiên, hoặc chia sẻ mã phòng để mời thêm người."
      />
    </div>
  );
}
