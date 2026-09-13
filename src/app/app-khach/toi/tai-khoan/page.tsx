"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-khach/AppShell";
import { useCollab } from "@/components/app-khach/CollabProvider";
import {
  IconChevron,
  IconHandset,
  IconKey,
  IconMail,
} from "@/components/app-khach/AppIcons";

function formatVnPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("0") && d.length === 10) {
    const rest = d.slice(1);
    return `(+84) ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
  }
  return phone || "Chưa có";
}

export default function TaiKhoanPage() {
  return (
    <AppShell active="toi">
      <TaiKhoanBody />
    </AppShell>
  );
}

function TaiKhoanBody() {
  const { data } = useCollab();
  if (!data) return null;

  const displayName = data.user.nickname || data.user.name;
  const letter = displayName.slice(0, 1).toUpperCase();

  return (
    <>
      <Link href="/app-khach/toi" className="app-back">
        ← Cài đặt
      </Link>
      <header className="app-home-top">
        <div>
          <h1>Tài khoản và bảo mật</h1>
        </div>
      </header>

      <p className="app-sec-label">Tài khoản</p>
      <Link
        href="/app-khach/toi/thong-tin"
        className="app-nav-card"
      >
        {data.user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="app-nav-avatar" src={data.user.avatarUrl} alt="" />
        ) : (
          <span className="app-nav-avatar app-nav-letter">{letter}</span>
        )}
        <span className="app-nav-text">
          <small>Thông tin cá nhân</small>
          <strong>{displayName}</strong>
        </span>
        <IconChevron size={16} />
      </Link>

      <Link href="/app-khach/toi/so-dien-thoai" className="app-nav-row">
        <span className="app-nav-ico">
          <IconHandset size={20} />
        </span>
        <span className="app-nav-text">
          <strong>Số điện thoại</strong>
          <small>{formatVnPhone(data.user.phone)}</small>
        </span>
        <IconChevron size={16} />
      </Link>

      <p className="app-sec-label">Bảo mật</p>
      <div className="app-account-card">
        <Link href="/app-khach/toi/mat-khau" className="app-nav-row is-in-card">
          <span className="app-nav-ico">
            <IconKey size={18} />
          </span>
          <span className="app-nav-text">
            <strong>Mật khẩu</strong>
            <small>Thay đổi mật khẩu</small>
          </span>
          <IconChevron size={16} />
        </Link>
        <Link href="/app-khach/toi/email" className="app-nav-row is-in-card">
          <span className="app-nav-ico">
            <IconMail size={18} />
          </span>
          <span className="app-nav-text">
            <strong>Email</strong>
            <small>{data.user.email || "Thêm email"}</small>
          </span>
          <IconChevron size={16} />
        </Link>
      </div>
    </>
  );
}
