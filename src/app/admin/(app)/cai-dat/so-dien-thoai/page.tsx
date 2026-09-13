"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPhonePage() {
  const [phone, setPhone] = useState("");
  const [inited, setInited] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    void fetch("/api/admin/me", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        const user = (json as { user?: { phone: string } }).user;
        if (user && !inited) {
          setPhone(user.phone || "");
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
      body: JSON.stringify({ phone }),
    });
    const json = (await res.json()) as { error?: string };
    if (!res.ok) {
      setErr(json.error || "Không lưu được");
      return;
    }
    setMsg("Đã lưu số điện thoại.");
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <Link href="/admin/cai-dat" className="admin-chat-back">
            ←
          </Link>
          <h1>Số điện thoại</h1>
        </div>
      </header>
      <label className="admin-field admin-field-light">
        Số điện thoại
        <input
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
        />
      </label>
      {err ? <p className="admin-error">{err}</p> : null}
      {msg ? <p className="admin-ok">{msg}</p> : null}
      <button type="button" className="admin-btn" onClick={() => void save()}>
        Lưu
      </button>
    </>
  );
}
