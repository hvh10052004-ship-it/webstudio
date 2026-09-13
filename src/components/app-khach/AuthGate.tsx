"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AvatarCropper } from "./AvatarCropper";
import { useCollab } from "./CollabProvider";
import { loadLoginInfo } from "./session-client";

export function AuthGate({ children }: { children: ReactNode }) {
  const { loggedIn, data } = useCollab();
  if (loggedIn || data) return children;
  return <LoginForm />;
}

export function LoginForm() {
  const { login, error } = useCollab();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const saved = loadLoginInfo();
    if (saved.name) setName(saved.name);
    if (saved.password) setPassword(saved.password);
  }, []);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    await login(name.trim(), password);
    setBusy(false);
  }

  return (
    <div className="app-form">
      <form onSubmit={(e) => void onLogin(e)}>
        <header className="app-home-top">
          <div>
            <h1>Đăng nhập</h1>
            <p>Vào app bằng tài khoản của bạn</p>
          </div>
        </header>
        <div className="app-account-card">
          <label className="app-auth-row">
            <span>Tên đăng nhập</span>
            <input
              value={name}
              maxLength={24}
              autoComplete="username"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="app-auth-row">
            <span>Mật khẩu</span>
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              required
              minLength={4}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        {error ? <p className="app-form-error">{error}</p> : null}
        <button
          type="submit"
          className="app-btn app-btn-primary app-btn-full"
          disabled={busy}
        >
          {busy ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>
      <Link href="/app-khach/toi/dang-ky" className="app-auth-switch">
        Tạo tài khoản mới
      </Link>
    </div>
  );
}

export function RegisterForm() {
  const { loggedIn, data, register, error, refresh } = useCollab();
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [preview, setPreview] = useState("");
  const [pendingAvatar, setPendingAvatar] = useState<Blob | null>(null);
  const [cropping, setCropping] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loggedIn || data) router.replace("/app-khach/toi");
  }, [loggedIn, data, router]);

  async function onRegister(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await register({
      name: name.trim(),
      password,
      nickname,
      birthday,
      phone,
    });
    if (ok && pendingAvatar) {
      const form = new FormData();
      form.append("avatar", pendingAvatar, "avatar.jpg");
      await fetch("/api/me/avatar", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      await refresh();
    }
    setBusy(false);
    if (ok) router.replace("/app-khach/toi");
  }

  if (cropping) {
    return (
      <AvatarCropper
        onCropped={(blob) => {
          setPendingAvatar(blob);
          setPreview(URL.createObjectURL(blob));
          setCropping(false);
        }}
        onCancel={() => setCropping(false)}
      />
    );
  }

  const letter = (nickname || name || "?").slice(0, 1).toUpperCase();

  return (
    <div className="app-form">
      <form onSubmit={(e) => void onRegister(e)}>
        <header className="app-home-top">
          <div>
            <h1>Đăng ký</h1>
            <p>Tạo tài khoản mới</p>
          </div>
        </header>

        <button
          type="button"
          className="app-avatar-edit"
          onClick={() => setCropping(true)}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Ảnh đại diện" />
          ) : (
            <span>{letter}</span>
          )}
          <em>Thay ảnh</em>
        </button>

        <div className="app-account-card">
          <label className="app-auth-row">
            <span>Tên biệt danh</span>
            <input
              value={nickname}
              maxLength={24}
              placeholder="hương"
              required
              onChange={(e) => setNickname(e.target.value)}
            />
          </label>
          <label className="app-auth-row">
            <span>Ngày sinh</span>
            <input
              type="date"
              value={birthday}
              required
              onChange={(e) => setBirthday(e.target.value)}
            />
          </label>
          <label className="app-auth-row">
            <span>Tên đăng nhập</span>
            <input
              value={name}
              maxLength={24}
              autoComplete="username"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="app-auth-row">
            <span>Mật khẩu</span>
            <input
              type="password"
              value={password}
              autoComplete="new-password"
              required
              minLength={4}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className="app-auth-row">
            <span>Số điện thoại</span>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              placeholder="0900000000"
              required
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
            />
          </label>
        </div>

        {error ? <p className="app-form-error">{error}</p> : null}
        <button
          type="submit"
          className="app-btn app-btn-primary app-btn-full"
          disabled={busy}
        >
          {busy ? "Đang tạo…" : "Tạo tài khoản"}
        </button>
      </form>
      <Link href="/app-khach/toi" className="app-auth-switch">
        Đã có tài khoản? Đăng nhập
      </Link>
    </div>
  );
}
