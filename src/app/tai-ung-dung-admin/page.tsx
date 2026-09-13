"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export default function TaiUngDungAdminPage() {
  const [phase, setPhase] = useState<"verify" | "thanks">("verify");
  const [progress, setProgress] = useState(8);
  const [ios, setIos] = useState(false);
  const started = useRef(false);

  function finish() {
    setProgress(100);
    setPhase("thanks");
  }

  function restart() {
    started.current = false;
    setProgress(8);
    setPhase("verify");
  }

  function downloadApk() {
    window.location.href = "/api/download/apk-admin";
  }

  useEffect(() => {
    setIos(isIos());
  }, []);

  useEffect(() => {
    if (phase !== "verify") return;
    const tick = setInterval(() => {
      setProgress((p) => (p >= 92 ? p : p + 7));
    }, 180);
    const done = setTimeout(finish, 2400);
    return () => {
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "thanks" || ios || started.current) return;
    started.current = true;
    downloadApk();
  }, [phase, ios]);

  return (
    <div className="dl-page">
      <div className="dl-phone-outline" aria-hidden />

      {phase === "verify" ? (
        <div className="dl-dialog" role="status">
          <p className="dl-dialog-title">Đang mở “WebStudio Admin.app”…</p>
          <p className="dl-dialog-sub">Đang xác minh…</p>
          <div className="dl-progress">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="dl-dialog-actions">
            <Link href="/" className="dl-ghost">
              Hủy
            </Link>
            <button type="button" className="dl-ghost" onClick={finish}>
              Bỏ qua
            </button>
          </div>
        </div>
      ) : null}

      {phase === "thanks" ? (
        <main className="dl-main">
          <img className="dl-icon" src="/icons/app-khach-192.png" alt="" />
          <h1>Cảm ơn bạn đã tải WebStudio Admin xuống!</h1>
          <p className="dl-lead">
            Tệp cài đặt sẽ được tải về máy. Mở tệp trên điện thoại Android để cài
            ứng dụng quản trị.
          </p>

          {ios ? (
            <p className="dl-hint">
              iPhone không cài được tệp Android. Hãy mở trang này trên điện thoại
              Android để tải và cài đặt.
            </p>
          ) : (
            <p className="dl-hint">
              Mở trang này trên điện thoại bằng địa chỉ{" "}
              <b>http://IP-máy-tính:3000/tai-ung-dung-admin</b> (chạy{" "}
              <b>npm run dev:lan</b>), không mở file HTML trên máy tính. Sau khi
              tải, mở <b>WebStudio-Admin.apk</b> → cho phép cài từ nguồn này → Cài
              đặt. App này mở thẳng trang quản trị và có thể cài cạnh app khách.
            </p>
          )}

          <a className="dl-download" href="/api/download/apk-admin">
            Tải tệp cài đặt admin
          </a>

          <p className="dl-retry">
            Nếu quá trình tải xuống không bắt đầu, vui lòng{" "}
            <button type="button" onClick={restart}>
              nhấp vào đây
            </button>{" "}
            để thử lại.
          </p>
        </main>
      ) : null}
    </div>
  );
}
