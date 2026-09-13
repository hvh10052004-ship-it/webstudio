"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-khach/AppShell";
import { useCollab } from "@/components/app-khach/CollabProvider";
import { settingsBack } from "@/components/app-khach/settings-nav";
import {
  IconGenderFemale,
  IconGenderMale,
} from "@/components/app-khach/AppIcons";

export default function ThongTinPage() {
  return (
    <AppShell active="toi">
      <Suspense>
        <ThongTinBody />
      </Suspense>
    </AppShell>
  );
}

function ThongTinBody() {
  const { data, refresh } = useCollab();
  const from = useSearchParams().get("from");
  const back = settingsBack(from);
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [inited, setInited] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!data || inited) return;
    setNickname(data.user.nickname || data.user.name);
    setBirthday(data.user.birthday || "");
    setGender(data.user.gender || "");
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
      body: JSON.stringify({ nickname, birthday, gender }),
    });
    const json = (await res.json()) as { error?: string };
    if (!res.ok) {
      setErr(json.error || "Không lưu được");
      return;
    }
    setMsg("Đã lưu thông tin.");
    await refresh();
  }

  return (
    <>
      <Link href={back.href} className="app-back">
        {back.label}
      </Link>
      <header className="app-home-top">
        <div>
          <h1>Thông tin cá nhân</h1>
        </div>
      </header>

      <label className="app-field">
        <span>Tên</span>
        <input
          value={nickname}
          maxLength={24}
          onChange={(e) => setNickname(e.target.value)}
        />
      </label>
      <label className="app-field">
        <span>Ngày sinh</span>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />
      </label>

      <div className="app-field">
        <span>Giới tính</span>
        <div className="app-gender-picks">
          <button
            type="button"
            className={`app-gender-pick${gender === "male" ? " is-on" : ""}`}
            onClick={() => setGender("male")}
            aria-label="Nam"
          >
            <IconGenderMale size={28} />
          </button>
          <button
            type="button"
            className={`app-gender-pick${gender === "female" ? " is-on" : ""}`}
            onClick={() => setGender("female")}
            aria-label="Nữ"
          >
            <IconGenderFemale size={28} />
          </button>
        </div>
      </div>

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
