"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { formatAgo, formatWhen } from "@/components/admin/format";
import { ChatQuote } from "@/components/chat/ChatQuote";
import { SwipePinRow } from "@/components/chat/SwipePinRow";

type Thread = {
  id: number;
  name: string;
  nickname: string;
  avatar_url: string;
  last_body: string;
  last_image: string;
  last_at: string;
  last_user_id: number;
};

type Msg = {
  id: number;
  site_id: number;
  site_name: string;
  body: string;
  created_at: string;
  user_id: number;
  name: string;
  image_url: string;
  reply_to: number;
  reply_body: string;
  reply_name: string;
  reply_image: string;
};

export default function AdminChatPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [me, setMe] = useState<number | null>(null);
  const [replyTo, setReplyTo] = useState<Msg | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadThreads() {
    const res = await fetch("/api/admin/chat", { credentials: "include" });
    if (!res.ok) return;
    const json = (await res.json()) as { threads: Thread[] };
    setThreads(json.threads ?? []);
  }

  useEffect(() => {
    void loadThreads();
    void fetch("/api/admin/overview", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        const id = (json as { admin?: { id: number } }).admin?.id;
        if (id) setMe(id);
      });
    const t = setInterval(() => void loadThreads(), 4000);
    return () => clearInterval(t);
  }, []);

  async function load(id: number) {
    const res = await fetch(`/api/admin/chat?userId=${id}`, {
      credentials: "include",
    });
    if (!res.ok) return;
    const json = (await res.json()) as { messages: Msg[] };
    setMessages(json.messages ?? []);
  }

  useEffect(() => {
    setReplyTo(null);
    if (!userId) return;
    void load(userId);
    const t = setInterval(() => void load(userId), 2500);
    return () => clearInterval(t);
  }, [userId]);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!userId || !text.trim()) return;
    const body = text.trim();
    const replyId = replyTo?.id ?? 0;
    setText("");
    setReplyTo(null);
    const res = await fetch("/api/admin/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userId,
        text: body,
        replyTo: replyId || undefined,
      }),
    });
    const json = (await res.json()) as { messages?: Msg[] };
    if (res.ok) setMessages(json.messages ?? []);
    void loadThreads();
  }

  async function sendImage(file: File) {
    if (!userId) return;
    const form = new FormData();
    form.append("userId", String(userId));
    form.append("image", file);
    if (text.trim()) form.append("text", text.trim());
    if (replyTo) form.append("replyTo", String(replyTo.id));
    setText("");
    setReplyTo(null);
    const res = await fetch("/api/admin/chat", {
      method: "POST",
      credentials: "include",
      body: form,
    });
    const json = (await res.json()) as { messages?: Msg[] };
    if (res.ok) setMessages(json.messages ?? []);
    void loadThreads();
  }

  const current = threads.find((t) => t.id === userId);

  if (!userId) {
    return (
      <div className="admin-inbox">
        <header className="admin-inbox-head">
          <h1>Chat</h1>
        </header>
        <div className="admin-inbox-list">
          {threads.length === 0 ? (
            <p className="admin-inbox-empty">Chưa có hội thoại</p>
          ) : (
            threads.map((t) => {
              const preview = t.last_body.trim() || (t.last_image ? "Ảnh" : "Chưa có tin");
              const mine = me != null && t.last_user_id === me;
              return (
                <button
                  key={t.id}
                  type="button"
                  className="admin-inbox-item"
                  onClick={() => setUserId(t.id)}
                >
                  {t.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="admin-inbox-avatar" src={t.avatar_url} alt="" />
                  ) : (
                    <span className="admin-inbox-avatar is-letter">
                      {(t.nickname || t.name).slice(0, 1)}
                    </span>
                  )}
                  <span className="admin-inbox-copy">
                    <span className="admin-inbox-row">
                      <strong>{t.name}</strong>
                      <time>{formatAgo(t.last_at)}</time>
                    </span>
                    <span className="admin-inbox-preview">
                      {t.last_body || t.last_image
                        ? `${mine ? "Bạn: " : ""}${preview}`
                        : preview}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-chat-layout">
      <div className="admin-chat-pane">
        <div className="admin-panel-head">
          <button
            type="button"
            className="admin-chat-back"
            onClick={() => setUserId(null)}
          >
            ←
          </button>
          {current ? current.name : "Chat"}
        </div>
        <div className="admin-chat-msgs">
          {messages.map((m) => (
            <SwipePinRow key={m.id} onReply={() => setReplyTo(m)}>
              <div
                id={`admin-msg-${m.id}`}
                className={`admin-msg${m.user_id === me ? " is-mine" : ""}`}
              >
                <div className="admin-msg-top">
                  <strong>{m.name}</strong>
                  <time>{formatWhen(m.created_at)}</time>
                </div>
                {m.reply_to ? (
                  <ChatQuote
                    name={m.reply_name}
                    body={m.reply_body}
                    image={m.reply_image}
                    onClick={() =>
                      document
                        .getElementById(`admin-msg-${m.reply_to}`)
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        })
                    }
                  />
                ) : null}
                {m.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="chat-img" src={m.image_url} alt="" />
                ) : null}
                {m.body ? <p>{m.body}</p> : null}
              </div>
            </SwipePinRow>
          ))}
        </div>
        <form className="admin-chat-form" onSubmit={(e) => void send(e)}>
          {replyTo ? (
            <div className="chat-reply-bar">
              <ChatQuote
                name={replyTo.name}
                body={replyTo.body}
                image={replyTo.image_url}
              />
              <button
                type="button"
                className="chat-reply-close"
                onClick={() => setReplyTo(null)}
                aria-label="Hủy hồi tin"
              >
                ×
              </button>
            </div>
          ) : null}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void sendImage(file);
            }}
          />
          <button
            type="button"
            className="admin-attach"
            onClick={() => fileRef.current?.click()}
          >
            Ảnh
          </button>
          <input
            value={text}
            placeholder={replyTo ? "Nhập tin hồi…" : "Nhập trả lời…"}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="admin-btn" type="submit">
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
}
