"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { AppShell } from "@/components/app-khach/AppShell";
import { AuthGate } from "@/components/app-khach/AuthGate";
import { authHeaders } from "@/components/app-khach/session-client";
import { formatAgo } from "@/components/admin/format";

type ChatRow = {
  id: number;
  code: string;
  kind: string;
  title: string;
  avatar_url: string;
  last_body: string;
  last_image: string;
  last_at: string;
};

type Inbox = {
  myCode: string;
  site: { id: number; name: string } | null;
  chats: ChatRow[];
};

export default function ChatInboxPage() {
  return (
    <AppShell active="chat">
      <AuthGate>
        <ChatInbox />
      </AuthGate>
    </AppShell>
  );
}

function ChatInbox() {
  const router = useRouter();
  const [data, setData] = useState<Inbox | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function load() {
    const res = await fetch("/api/chats", {
      credentials: "include",
      cache: "no-store",
      headers: authHeaders(),
    });
    if (!res.ok) return;
    setData((await res.json()) as Inbox);
  }

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 4000);
    return () => clearInterval(t);
  }, []);

  async function copyCode() {
    if (!data?.myCode) return;
    try {
      await navigator.clipboard.writeText(data.myCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Không sao chép được mã");
    }
  }

  async function join(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/chats", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ code }),
    });
    const json = (await res.json()) as { chatId?: number; error?: string; chats?: ChatRow[] };
    if (!res.ok) {
      setError(json.error || "Không kết nối được");
      return;
    }
    setCode("");
    if (json.chats && data) setData({ ...data, chats: json.chats });
    if (json.chatId) router.push(`/app-khach/chat/${json.chatId}`);
  }

  async function createGroup() {
    setError("");
    const res = await fetch("/api/chats", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ action: "create" }),
    });
    const json = (await res.json()) as { chatId?: number; error?: string };
    if (!res.ok) {
      setError(json.error || "Không tạo được nhóm");
      return;
    }
    if (json.chatId) router.push(`/app-khach/chat/${json.chatId}`);
  }

  return (
    <div className="app-chat-screen">
      <header className="app-home-top">
        <div>
          <h1>Chat</h1>
          <p>Chia sẻ mã của bạn hoặc nhập mã để kết nối</p>
        </div>
      </header>

      <section className="app-chat-code-card">
        <div>
          <small>Mã của bạn</small>
          <strong>{data?.myCode || "…"}</strong>
        </div>
        <button type="button" className="app-btn app-btn-primary" onClick={() => void copyCode()}>
          {copied ? "Đã copy" : "Sao chép"}
        </button>
      </section>

      <form className="app-chat-join" onSubmit={(e) => void join(e)}>
        <input
          value={code}
          maxLength={8}
          placeholder="Nhập mã kết nối"
          autoCapitalize="characters"
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        <button type="submit" className="app-btn app-btn-primary">
          Kết nối
        </button>
      </form>
      {error ? <p className="app-form-error">{error}</p> : null}

      <button type="button" className="app-chat-create" onClick={() => void createGroup()}>
        Tạo nhóm và lấy mã chia sẻ
      </button>

      <div className="app-chat-inbox">
        {data?.site ? (
          <Link href="/app-khach/chat/site" className="app-chat-inbox-item">
            <span className="app-chat-inbox-avatar is-letter">S</span>
            <span className="app-chat-inbox-copy">
              <span className="app-chat-inbox-row">
                <strong>{data.site.name}</strong>
                <span>Nhóm site</span>
              </span>
              <span className="app-chat-inbox-preview">Chat cùng người soạn website này</span>
            </span>
          </Link>
        ) : null}

        {(data?.chats ?? []).map((t) => {
          const preview = t.last_body.trim() || (t.last_image ? "Ảnh" : "Chưa có tin");
          return (
            <Link key={t.id} href={`/app-khach/chat/${t.id}`} className="app-chat-inbox-item">
              {t.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="app-chat-inbox-avatar" src={t.avatar_url} alt="" />
              ) : (
                <span className="app-chat-inbox-avatar is-letter">
                  {t.title.slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="app-chat-inbox-copy">
                <span className="app-chat-inbox-row">
                  <strong>{t.title}</strong>
                  <time>{t.last_at ? formatAgo(t.last_at) : t.kind === "group" ? t.code : ""}</time>
                </span>
                <span className="app-chat-inbox-preview">{preview}</span>
              </span>
            </Link>
          );
        })}

        {data && !data.site && data.chats.length === 0 ? (
          <p className="app-note">Chưa có cuộc trò chuyện. Chia sẻ mã hoặc nhập mã để bắt đầu.</p>
        ) : null}
      </div>
    </div>
  );
}
