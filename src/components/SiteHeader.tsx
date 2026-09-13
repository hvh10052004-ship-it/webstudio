"use client";

import { useEffect, useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="container">
        <nav className="site-nav">
          <a className="logo" href="#top">
            Web<span>Studio.</span>
          </a>
          <ul className={`nav-links${open ? " active" : ""}`} id="navLinks">
            <li>
              <a href="#services" onClick={() => setOpen(false)}>
                Dịch vụ
              </a>
            </li>
            <li>
              <a href="/tai-ung-dung" onClick={() => setOpen(false)}>
                Tải ứng dụng
              </a>
            </li>
            <li>
              <a href="#portfolio" onClick={() => setOpen(false)}>
                Dự án
              </a>
            </li>
            <li>
              <a href="#process" onClick={() => setOpen(false)}>
                Quy trình
              </a>
            </li>
            <li>
              <a href="#pricing" onClick={() => setOpen(false)}>
                Bảng giá
              </a>
            </li>
            <li>
              <a
                className="nav-btn"
                href="#contact"
                onClick={() => setOpen(false)}
              >
                Nhận tư vấn
              </a>
            </li>
          </ul>
          <button
            type="button"
            className="menu-btn"
            id="menuBtn"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </nav>
      </div>
    </header>
  );
}
