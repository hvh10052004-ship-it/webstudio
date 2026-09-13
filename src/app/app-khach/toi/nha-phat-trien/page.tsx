"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-khach/AppShell";

export default function NhaPhatTrienPage() {
  return (
    <AppShell active="toi">
      <Link href="/app-khach/toi" className="app-back">
        ← Cài đặt
      </Link>
      <header className="app-home-top">
        <div>
          <h1>Nhà phát triển</h1>
          <p>Studio thiết kế và lập trình WebStudio</p>
        </div>
      </header>

      <div className="app-info-card">
        <strong>WebStudio</strong>
        <p>
          Chúng tôi thiết kế và phát triển website hiện đại cho doanh nghiệp,
          thương hiệu, cửa hàng và startup. Ưu tiên giao diện rõ, tốc độ, SEO
          và trải nghiệm trên điện thoại.
        </p>
      </div>

      <p className="app-sec-label">Liên hệ studio</p>
      <ul className="app-info-list">
        <li>
          <strong>Website</strong>
          <span>webstudio.vn — trang giới thiệu và nhận dự án</span>
        </li>
        <li>
          <strong>Hỗ trợ trong app</strong>
          <span>Tab Chat để nhắn với admin khi đang soạn site</span>
        </li>
        <li>
          <strong>Dự án làm tay</strong>
          <span>SaaS / e-commerce phức tạp có thể thuê studio triển khai</span>
        </li>
      </ul>

      <p className="app-sec-label">Kỹ thuật app</p>
      <ul className="app-info-list">
        <li>
          <strong>Nền tảng</strong>
          <span>Next.js, React, SQLite trên máy chủ</span>
        </li>
        <li>
          <strong>Dữ liệu</strong>
          <span>Nội dung site, chat và tài khoản lưu theo từng khách</span>
        </li>
        <li>
          <strong>Bảo mật</strong>
          <span>Đăng nhập cookie phiên; mật khẩu được băm, không lưu thô</span>
        </li>
      </ul>
    </AppShell>
  );
}
