"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-khach/AppShell";
import { useCollab } from "@/components/app-khach/CollabProvider";
import { settingsBack } from "@/components/app-khach/settings-nav";

export default function PhonePage() {
  return (
    <AppShell active="toi">
      <Suspense>
        <PhoneBody />
      </Suspense>
    </AppShell>
  );
}

function PhoneBody() {
  const { data, refresh } = useCollab();
  const back = settingsBack(useSearchParams().get("from"));
  const [phone, setPhone] = useState("");
  const [inited, setInited] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!data || inited) return;
    setPhone(data.user.phone || "");
    setInited(true);
  }, [data, inited]);

  if (!data) return null;

  async function save() {
    setErr("");
    setMsg("");
    const res = await fetch("/api/me/profile", {
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
    await refresh();
  }

  return (
    <>
      <Link href={back.href} className="app-back">
        {back.label}
      </Link>
      <header className="app-home-top">
        <div>
          <h1>Số điện thoại</h1>
        </div>
      </header>
      <label className="app-field">
        <span>Số điện thoại</span>
        <input
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
        />
      </label>
      {err ? <p className="app-form-error">{err}</p> : null}
      {msg ? <p className="app-form-ok">{msg}</p> : null}
      <button
        type="button"
        className="app-btn app-btn-primary app-btn-full"
        onClick={() => void save()}
      >
        Lưu
      </button>
    </>
  );
}
