"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AdminPhone } from "@/components/admin/AdminPhone";

export default function AdminLoginPage() {
  const router = useRouter();
  const [name, setName] = useState("Admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, password }),
    });
    const json = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setError(json.error || "Không đăng nhập được");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <AdminPhone>
      <form className="admin-login-card" onSubmit={(e) => void onSubmit(e)}>
        <h1>Đăng nhập</h1>
        <p>Bảng quản trị khách và website</p>
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
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? <p className="admin-error">{error}</p> : null}
        <button className="admin-btn" type="submit" disabled={busy}>
          Vào bảng điều khiển
        </button>
        <p className="admin-auth-switch">
          Chưa có tài khoản?{" "}
          <Link href="/admin/dang-ky">Tạo tài khoản</Link>
        </p>
      </form>
    </AdminPhone>
  );
}
