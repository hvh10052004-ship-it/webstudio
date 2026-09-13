"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminEmailPage() {
  const [email, setEmail] = useState("");
  const [inited, setInited] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    void fetch("/api/admin/me", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        const user = (json as { user?: { email: string } }).user;
        if (user && !inited) {
          setEmail(user.email || "");
          setInited(true);
        }
      });
  }, [inited]);

  async function save() {
    setErr("");
    setMsg("");
    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    const json = (await res.json()) as { error?: string };
    if (!res.ok) {
      setErr(json.error || "Không lưu được");
      return;
    }
    setMsg("Đã lưu email.");
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <Link href="/admin/cai-dat" className="admin-chat-back">
            ←
          </Link>
          <h1>Email</h1>
        </div>
      </header>
      <label className="admin-field admin-field-light">
        Email
        <input
          type="email"
          value={email}
          placeholder="ban@email.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      {err ? <p className="admin-error">{err}</p> : null}
      {msg ? <p className="admin-ok">{msg}</p> : null}
      <button type="button" className="admin-btn" onClick={() => void save()}>
        Lưu email
      </button>
    </>
  );
}
