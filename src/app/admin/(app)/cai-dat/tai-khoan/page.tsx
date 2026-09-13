"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminAccountPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [inited, setInited] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    void fetch("/api/admin/me", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        const user = (json as { user?: { name: string } }).user;
        if (user && !inited) {
          setName(user.name);
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
      body: JSON.stringify({ name }),
    });
    const json = (await res.json()) as { error?: string };
    if (!res.ok) {
      setErr(json.error || "Không lưu được");
      return;
    }
    setMsg("Đã lưu tài khoản.");
    router.refresh();
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <Link href="/admin/cai-dat" className="admin-chat-back">
            ←
          </Link>
          <h1>Tài khoản</h1>
        </div>
      </header>
      <label className="admin-field admin-field-light">
        Tên đăng nhập
        <input
          value={name}
          autoComplete="username"
          onChange={(e) => setName(e.target.value)}
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
