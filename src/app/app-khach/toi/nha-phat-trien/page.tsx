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

      <p className="app-sec-label">Luồng dữ liệu</p>
      <ol className="app-flow">
        <li>
          <strong>App (Frontend)</strong>
          <span>Bạn thao tác trên WebView / trình duyệt</span>
        </li>
        <li>
          <strong>API</strong>
          <span>fetch /api/auth, /api/me, /api/sites, /api/chats</span>
        </li>
        <li>
          <strong>Máy chủ (Backend)</strong>
          <span>Next.js xử lý đăng nhập, quyền, soạn site, chat</span>
        </li>
        <li>
          <strong>Database</strong>
          <span>SQLite: users, sessions, sites, messages</span>
        </li>
        <li>
          <strong>Trả kết quả</strong>
          <span>JSON về app → giao diện cập nhật</span>
        </li>
      </ol>

      <p className="app-sec-label">Kỹ thuật app</p>
      <ul className="app-info-list">
        <li>
          <strong>Vỏ điện thoại</strong>
          <span>APK Android WebView, mở /app-khach trên máy chủ</span>
        </li>
        <li>
          <strong>Nền tảng</strong>
          <span>Next.js, React, SQLite trên máy chủ — không phải GitHub Pages tĩnh</span>
        </li>
        <li>
          <strong>Dữ liệu</strong>
          <span>Nội dung site, chat và tài khoản lưu theo từng khách</span>
        </li>
        <li>
          <strong>Bảo mật</strong>
          <span>Phiên cookie hoặc Bearer token; mật khẩu được băm, không lưu thô</span>
        </li>
      </ul>
    </AppShell>
  );
}
