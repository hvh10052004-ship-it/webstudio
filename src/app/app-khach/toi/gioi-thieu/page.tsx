"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-khach/AppShell";

export default function GioiThieuPage() {
  return (
    <AppShell active="toi">
      <Link href="/app-khach/toi" className="app-back">
        ← Cài đặt
      </Link>
      <header className="app-home-top">
        <div>
          <h1>Giới thiệu</h1>
          <p>WebStudio — tạo website trên điện thoại</p>
        </div>
      </header>

      <div className="app-info-card">
        <strong>WebStudio App</strong>
        <p>
          Ứng dụng giúp bạn tự soạn Landing Page, website công ty, SaaS và web
          bán hàng. Nhiều người cùng chỉnh nội dung, xem trước và chat với nhóm
          ngay trên điện thoại.
        </p>
      </div>

      <p className="app-sec-label">Bạn làm được gì</p>
      <ul className="app-info-list">
        <li>
          <strong>4 loại website</strong>
          <span>Landing, công ty, SaaS, bán hàng — mỗi loại lưu riêng</span>
        </li>
        <li>
          <strong>Soạn theo khối</strong>
          <span>Điền chữ, giá, sản phẩm, SĐT/Zalo rồi lưu</span>
        </li>
        <li>
          <strong>Xem trước</strong>
          <span>Sau khi lưu, tab Xem hiện đúng loại bạn đã soạn</span>
        </li>
        <li>
          <strong>Chat nhóm</strong>
          <span>Gửi chữ, ảnh, ghim tin; lưu thông tin sẽ báo trên chat</span>
        </li>
      </ul>

      <p className="app-info-foot">Phiên bản 1.0 · © 2026 WebStudio</p>
    </AppShell>
  );
}
