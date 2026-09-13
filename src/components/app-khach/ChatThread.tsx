"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { authHeaders } from "@/components/app-khach/session-client";
import { ChatQuote } from "@/components/chat/ChatQuote";
import { SwipePinRow } from "@/components/chat/SwipePinRow";

export type ChatMsg = {
  id: number;
  body: string;
  created_at: string;
  user_id: number;
  name: string;
  nickname?: string;
  image_url: string;
  reply_to: number;
  reply_body: string;
  reply_name: string;
  reply_image: string;
};

export function ChatThread({
  meId,
  loadUrl,
  emptyText,
}: {
  meId?: number;
  loadUrl: string;
  emptyText: string;
}) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMsg | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottom = useRef<HTMLDivElement>(null);

  async function load() {
    const res = await fetch(loadUrl, {
      credentials: "include",
      cache: "no-store",
      headers: authHeaders(),
    });
    if (!res.ok) return;
    const json = (await res.json()) as { messages: ChatMsg[] };
    setMessages(json.messages ?? []);
  }

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 2000);
    return () => clearInterval(t);
  }, [loadUrl]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e: FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setText("");
    setError("");
    const replyId = replyTo?.id ?? 0;
    setReplyTo(null);
    const res = await fetch(loadUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      credentials: "include",
      body: JSON.stringify({ text: body, replyTo: replyId || undefined }),
    });
    const json = (await res.json()) as { messages?: ChatMsg[]; error?: string };
    if (!res.ok) {
      setError(json.error || "Không gửi được");
      setText(body);
      return;
    }
    setMessages(json.messages ?? []);
  }

  async function sendImage(file: File) {
    setError("");
    const form = new FormData();
    form.append("image", file);
    if (text.trim()) form.append("text", text.trim());
    if (replyTo) form.append("replyTo", String(replyTo.id));
    setText("");
    setReplyTo(null);
    const res = await fetch(loadUrl, {
      method: "POST",
      credentials: "include",
      headers: authHeaders(),
      body: form,
    });
    const json = (await res.json()) as { messages?: ChatMsg[]; error?: string };
    if (!res.ok) {
      setError(json.error || "Không gửi ảnh được");
      return;
    }
    setMessages(json.messages ?? []);
  }

  return (
    <>
      <div className="app-chat-list">
        {messages.length === 0 ? (
          <p className="app-note">{emptyText}</p>
        ) : (
          messages.map((m) => (
            <SwipePinRow key={m.id} onReply={() => setReplyTo(m)}>
              <div
                id={`msg-${m.id}`}
                className={`app-bubble${m.user_id === meId ? " mine" : ""}`}
              >
                <strong>{m.user_id === meId ? "Bạn" : m.nickname || m.name}</strong>
                {m.reply_to ? (
                  <ChatQuote
                    name={m.reply_name}
                    body={m.reply_body}
                    image={m.reply_image}
                    onClick={() =>
                      document
                        .getElementById(`msg-${m.reply_to}`)
                        ?.scrollIntoView({ behavior: "smooth", block: "center" })
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
          ))
        )}
        <div ref={bottom} className="app-chat-end" />
      </div>

      <form className="app-chat-form" onSubmit={(e) => void send(e)}>
        {replyTo ? (
          <div className="chat-reply-bar">
            <ChatQuote
              name={replyTo.user_id === meId ? "Bạn" : replyTo.nickname || replyTo.name}
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
        {error ? <p className="app-form-error">{error}</p> : null}
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
          className="app-chat-attach"
          aria-label="Gửi ảnh"
          onClick={() => fileRef.current?.click()}
        >
          Ảnh
        </button>
        <input
          value={text}
          maxLength={400}
          placeholder={replyTo ? "Nhập tin hồi…" : "Nhắn tin…"}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="app-btn app-btn-primary">
          Gửi
        </button>
      </form>
    </>
  );
}
