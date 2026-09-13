"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AdminPhone } from "@/components/admin/AdminPhone";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, password, confirm }),
    });
    const json = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Không tạo tài khoản được");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <AdminPhone>
      <form className="admin-login-card" onSubmit={(e) => void onSubmit(e)}>
        <h1>Tạo tài khoản</h1>
        <p>Tài khoản quản trị mới cho app admin</p>
        <label className="admin-field">
          Tên đăng nhập
          <input
            value={name}
            autoComplete="username"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="admin-field">
          Mật khẩu
          <input
            type="password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="admin-field">
          Nhập lại mật khẩu
          <input
            type="password"
            value={confirm}
            autoComplete="new-password"
            onChange={(e) => setConfirm(e.target.value)}
          />
        </label>
        {error ? <p className="admin-error">{error}</p> : null}
        <button className="admin-btn" type="submit" disabled={busy}>
          Tạo và vào bảng điều khiển
        </button>
        <p className="admin-auth-switch">
          Đã có tài khoản?{" "}
          <Link href="/admin/dang-nhap">Đăng nhập</Link>
        </p>
      </form>
    </AdminPhone>
  );
}
