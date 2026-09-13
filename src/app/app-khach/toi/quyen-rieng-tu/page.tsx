"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-khach/AppShell";
import { useCollab } from "@/components/app-khach/CollabProvider";
import {
  IconChevron,
  IconHandset,
  IconKey,
  IconMail,
  IconUser,
} from "@/components/app-khach/AppIcons";

function formatVnPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("0") && d.length === 10) {
    const rest = d.slice(1);
    return `(+84) ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
  }
  return phone || "Chưa có";
}

export default function QuyenRiengTuPage() {
  return (
    <AppShell active="toi">
      <PrivacyBody />
    </AppShell>
  );
}

function PrivacyBody() {
  const { data } = useCollab();
  if (!data) return null;
  const q = "?from=privacy";

  return (
    <>
      <Link href="/app-khach/toi" className="app-back">
        ← Cài đặt
      </Link>
      <header className="app-home-top">
        <div>
          <h1>Quyền riêng tư</h1>
          <p>Sửa tài khoản, mật khẩu, số điện thoại và email</p>
        </div>
      </header>

      <div className="app-account-card">
        <Link href={`/app-khach/toi/thong-tin${q}`} className="app-nav-row is-in-card">
          <span className="app-nav-ico">
            <IconUser size={18} />
          </span>
          <span className="app-nav-text">
            <strong>Tài khoản</strong>
            <small>{data.user.name}</small>
          </span>
          <IconChevron size={16} />
        </Link>
        <Link href={`/app-khach/toi/mat-khau${q}`} className="app-nav-row is-in-card">
          <span className="app-nav-ico">
            <IconKey size={18} />
          </span>
          <span className="app-nav-text">
            <strong>Mật khẩu</strong>
            <small>Thay đổi mật khẩu</small>
          </span>
          <IconChevron size={16} />
        </Link>
        <Link
          href={`/app-khach/toi/so-dien-thoai${q}`}
          className="app-nav-row is-in-card"
        >
          <span className="app-nav-ico">
            <IconHandset size={18} />
          </span>
          <span className="app-nav-text">
            <strong>Số điện thoại</strong>
            <small>{formatVnPhone(data.user.phone)}</small>
          </span>
          <IconChevron size={16} />
        </Link>
        <Link href={`/app-khach/toi/email${q}`} className="app-nav-row is-in-card">
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
