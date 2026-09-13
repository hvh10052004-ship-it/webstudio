"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-khach/AppShell";
import { AvatarCropper } from "@/components/app-khach/AvatarCropper";
import { useCollab } from "@/components/app-khach/CollabProvider";

export default function HoSoPage() {
  return (
    <AppShell active="toi">
      <HoSoBody />
    </AppShell>
  );
}

function HoSoBody() {
  const { data, refresh } = useCollab();
  const [cropping, setCropping] = useState(false);
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [inited, setInited] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!data || inited) return;
    setNickname(data.user.nickname || data.user.name);
    setBirthday(data.user.birthday || "");
    setInited(true);
  }, [data, inited]);

  if (!data) return null;

  const letter = (data.user.nickname || data.user.name).slice(0, 1).toUpperCase();

  async function saveProfile() {
    setErr("");
    setMsg("");
    const res = await fetch("/api/me/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nickname, birthday }),
    });
    const json = (await res.json()) as { error?: string };
    if (!res.ok) {
      setErr(json.error || "Không lưu được");
      return;
    }
    setMsg("Đã lưu hồ sơ.");
    await refresh();
  }

  async function onCropped(blob: Blob) {
    const form = new FormData();
    form.append("avatar", blob, "avatar.jpg");
    const res = await fetch("/api/me/avatar", {
      method: "POST",
      credentials: "include",
      body: form,
    });
    if (!res.ok) {
      setErr("Không tải ảnh được");
      return;
    }
    setCropping(false);
    setMsg("Đã cập nhật ảnh đại diện.");
    await refresh();
  }

  return (
    <>
      <Link href="/app-khach/toi" className="app-back">
        ← Cài đặt
      </Link>
      <header className="app-home-top">
        <div>
          <h1>Hồ sơ</h1>
          <p>Ảnh đại diện, biệt danh và ngày sinh</p>
        </div>
      </header>

      {cropping ? (
        <AvatarCropper
          onCropped={(blob) => void onCropped(blob)}
          onCancel={() => setCropping(false)}
        />
      ) : (
        <>
          <button
            type="button"
            className="app-avatar-edit"
            onClick={() => setCropping(true)}
          >
            {data.user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.user.avatarUrl} alt="Ảnh đại diện" />
            ) : (
              <span>{letter}</span>
            )}
            <em>Thay ảnh</em>
          </button>

          <label className="app-field">
            <span>Tên biệt danh</span>
            <input
              value={nickname}
              maxLength={24}
              onChange={(e) => setNickname(e.target.value)}
            />
          </label>
          <label className="app-field">
            <span>Ngày tháng năm sinh</span>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </label>
          {err ? <p className="app-form-error">{err}</p> : null}
          {msg ? <p className="app-form-ok">{msg}</p> : null}
          <button
            type="button"
            className="app-btn app-btn-primary app-btn-full"
            onClick={() => void saveProfile()}
          >
            Lưu hồ sơ
          </button>
        </>
      )}
    </>
  );
}
