"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AdminMe = {
  name: string;
  phone: string;
  email: string;
};

function formatVnPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("0") && d.length === 10) {
    const rest = d.slice(1);
    return `(+84) ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
  }
  return phone || "Chưa có";
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [me, setMe] = useState<AdminMe | null>(null);

  useEffect(() => {
    void fetch("/api/admin/me", { credentials: "include" })
      .then((r) => r.json())
      .then((json) => {
        const user = (json as { user?: AdminMe }).user;
        if (user) setMe(user);
      });
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    router.replace("/admin/dang-nhap");
    router.refresh();
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <h1>Cài đặt</h1>
          <p className="admin-lead">Tài khoản quản trị</p>
        </div>
      </header>
      <div className="admin-set-list">
        <Link href="/admin/cai-dat/tai-khoan" className="admin-set-row">
          <strong>Tài khoản</strong>
          <small>{me?.name || "Tên đăng nhập"}</small>
        </Link>
        <Link href="/admin/cai-dat/mat-khau" className="admin-set-row">
          <strong>Mật khẩu</strong>
          <small>Thay đổi mật khẩu</small>
        </Link>
        <Link href="/admin/cai-dat/so-dien-thoai" className="admin-set-row">
          <strong>Số điện thoại</strong>
          <small>{me ? formatVnPhone(me.phone) : "Thêm số"}</small>
        </Link>
        <Link href="/admin/cai-dat/email" className="admin-set-row">
          <strong>Email</strong>
          <small>{me?.email || "Thêm email"}</small>
        </Link>
        <Link href="/tai-ung-dung-admin" className="admin-set-row">
          <strong>Tải app admin</strong>
          <small>Tệp APK cài trên Android</small>
        </Link>
        <button type="button" className="admin-set-row is-danger" onClick={() => void logout()}>
          Đăng xuất
        </button>
      </div>
    </>
  );
}
