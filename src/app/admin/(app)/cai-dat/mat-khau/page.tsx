"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminPasswordPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function save() {
    setErr("");
    setMsg("");
    const res = await fetch("/api/admin/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ current, next }),
    });
    const json = (await res.json()) as { error?: string };
    if (!res.ok) {
      setErr(json.error || "Không đổi được mật khẩu");
      return;
    }
    setCurrent("");
    setNext("");
    setMsg("Đã thay đổi mật khẩu.");
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <Link href="/admin/cai-dat" className="admin-chat-back">
            ←
          </Link>
          <h1>Đổi mật khẩu</h1>
        </div>
      </header>
      <label className="admin-field admin-field-light">
        Mật khẩu hiện tại
        <input
          type="password"
          value={current}
          autoComplete="current-password"
          onChange={(e) => setCurrent(e.target.value)}
        />
      </label>
      <label className="admin-field admin-field-light">
        Mật khẩu mới
        <input
          type="password"
          value={next}
          autoComplete="new-password"
          onChange={(e) => setNext(e.target.value)}
        />
      </label>
      {err ? <p className="admin-error">{err}</p> : null}
      {msg ? <p className="admin-ok">{msg}</p> : null}
      <button type="button" className="admin-btn" onClick={() => void save()}>
        Lưu mật khẩu
      </button>
    </>
  );
}
