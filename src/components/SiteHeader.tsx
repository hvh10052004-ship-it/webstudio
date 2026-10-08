"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const home = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const section = (hash: string) => (home ? hash : `/${hash}`);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="container">
        <nav className="site-nav">
          <Link className="logo" href="/">
            Web<span>Studio.</span>
          </Link>
          <ul className={`nav-links${open ? " active" : ""}`} id="navLinks">
            <li>
              <Link
                href="/"
                className={home ? "is-active" : undefined}
                onClick={() => setOpen(false)}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                href="/ve-chung-toi"
                className={pathname === "/ve-chung-toi" ? "is-active" : undefined}
                onClick={() => setOpen(false)}
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link
                href="/tai-ung-dung"
                className={pathname === "/tai-ung-dung" ? "is-active" : undefined}
                onClick={() => setOpen(false)}
              >
                Tải ứng dụng
              </Link>
            </li>
            <li>
              <a href={section("#services")} onClick={() => setOpen(false)}>
                Dịch vụ
              </a>
            </li>
            <li>
              <a href={section("#portfolio")} onClick={() => setOpen(false)}>
                Dự án
              </a>
            </li>
            <li>
              <a href={section("#process")} onClick={() => setOpen(false)}>
                Quy trình
              </a>
            </li>
            <li>
              <a href={section("#pricing")} onClick={() => setOpen(false)}>
                Bảng giá
              </a>
            </li>
            <li>
              <a
                className="nav-cta"
                href={section("#contact")}
                onClick={() => setOpen(false)}
              >
                Tư vấn ngay
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
