"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-khach/AppShell";
import { settingsBack } from "@/components/app-khach/settings-nav";

export default function MatKhauPage() {
  return (
    <AppShell active="toi">
      <Suspense>
        <MatKhauBody />
      </Suspense>
    </AppShell>
  );
}

function MatKhauBody() {
  const from = useSearchParams().get("from");
  const back = settingsBack(from);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function save() {
    setErr("");
    setMsg("");
    const res = await fetch("/api/me/password", {
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
      <Link href={back.href} className="app-back">
        {back.label}
      </Link>
      <header className="app-home-top">
        <div>
          <h1>Thay đổi mật khẩu</h1>
        </div>
      </header>
      <label className="app-field">
        <span>Mật khẩu hiện tại</span>
        <input
          type="password"
          value={current}
          autoComplete="current-password"
          onChange={(e) => setCurrent(e.target.value)}
        />
      </label>
      <label className="app-field">
        <span>Mật khẩu mới</span>
        <input
          type="password"
          value={next}
          autoComplete="new-password"
          onChange={(e) => setNext(e.target.value)}
        />
      </label>
      {err ? <p className="app-form-error">{err}</p> : null}
      {msg ? <p className="app-form-ok">{msg}</p> : null}
      <button
        type="button"
        className="app-btn app-btn-primary app-btn-full"
        onClick={() => void save()}
      >
        Lưu mật khẩu
      </button>
    </>
  );
}
