"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-khach/AppShell";

export default function TaiUngDungAppKhachPage() {
  return (
    <AppShell active="toi">
      <Link href="/app-khach/toi" className="app-back">
        ← Cài đặt
      </Link>
        <header className="app-home-top">
          <div>
            <h1>Tải ứng dụng</h1>
            <p>Cài App khách Studio trên Android</p>
          </div>
        </header>

        <div className="app-info-card">
          <strong>Ứng dụng WebStudio</strong>
          <p>
            Tải về điện thoại Android như một ứng dụng. Mở tệp, cho phép cài từ
            nguồn này, rồi bấm Cài đặt.
          </p>
        </div>

        <a
          className="app-btn app-btn-primary app-dl-full"
          href="/WebStudio.apk"
          type="application/vnd.android.package-archive"
        >
          Tải ứng dụng
        </a>

        <p className="app-sec-label">Cài đặt</p>
        <ul className="app-info-list">
          <li>
            <strong>1. Tải ứng dụng</strong>
            <span>Bấm nút trên — điện thoại nhận tệp WebStudio.apk</span>
          </li>
          <li>
            <strong>2. Cho phép cài</strong>
            <span>Mở tệp, cho phép cài đặt từ trình duyệt nếu hệ thống hỏi</span>
          </li>
          <li>
            <strong>3. Mở Studio</strong>
            <span>Cài xong, mở icon WebStudio để soạn website trên điện thoại</span>
          </li>
        </ul>
    </AppShell>
  );
}
