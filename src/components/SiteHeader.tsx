"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<"design" | "service" | "more" | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    try {
      if (localStorage.getItem("webstudio-theme") === "light") {
        document.documentElement.classList.add("theme-light");
        document.body.classList.add("theme-light");
      }
    } catch {}
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="container">
        <nav className="site-nav">
          <a className="logo" href="/index.html">
            Web<span>Studio</span>
          </a>
          <ul className={`nav-links${open ? " active" : ""}`} id="navLinks">
            <li>
              <a href="/index.html" onClick={() => setOpen(false)}>
                Trang chủ
              </a>
            </li>
            <li>
              <a href="/about.html">Về chúng tôi</a>
            </li>
            <li
              className="nav-drop"
              onMouseEnter={() => setMenu("design")}
              onMouseLeave={() => setMenu(null)}
            >
              <button type="button" className={menu === "design" ? "is-open" : undefined} onClick={() => setMenu(menu === "design" ? null : "design")}>
                Thiết kế Website
              </button>
              {menu === "design" ? (
                <div className="nav-panel">
                  <a href="/landing.html">Landing Page</a>
                  <a href="/company.html">Website công ty</a>
                  <a href="/ecommerce.html">Web bán hàng</a>
                  <a href="/saas.html">Website Startup / SaaS</a>
                </div>
              ) : null}
            </li>
            <li
              className="nav-drop"
              onMouseEnter={() => setMenu("service")}
              onMouseLeave={() => setMenu(null)}
            >
              <button type="button" className={menu === "service" ? "is-open" : undefined} onClick={() => setMenu(menu === "service" ? null : "service")}>
                Dịch vụ
              </button>
              {menu === "service" ? (
                <div className="nav-panel">
                  <a href="/index.html#services">Lập trình web</a>
                  <a href="/index.html#pricing">Bảng giá</a>
                  <a href="/product.html">Gói dịch vụ</a>
                  <a href="/contact.html">Liên hệ</a>
                </div>
              ) : null}
            </li>
            <li>
              <a href="/collection.html" onClick={() => setOpen(false)}>
                Dự án
              </a>
            </li>
            <li
              className="nav-drop"
              onMouseEnter={() => setMenu("more")}
              onMouseLeave={() => setMenu(null)}
            >
              <button type="button" aria-label="Thêm" onClick={() => setMenu(menu === "more" ? null : "more")}>
                ···
              </button>
              {menu === "more" ? (
                <div className="nav-panel">
                  <a href="/cart.html">Giỏ yêu cầu</a>
                  <a href="/search.html">Tìm kiếm</a>
                  <a href="/privacy.html">Bảo mật</a>
                  <a href="/sitemap.html">Sitemap</a>
                </div>
              ) : null}
            </li>
          </ul>
          <div className="nav-tools">
            <a className="icon-btn" href="/search.html" aria-label="Tìm kiếm">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            </a>
            <button
              type="button"
              className="icon-btn"
              aria-label="Đổi giao diện"
              onClick={() => {
                const next = !document.documentElement.classList.contains("theme-light");
                document.documentElement.classList.toggle("theme-light", next);
                document.body.classList.toggle("theme-light", next);
                try {
                  localStorage.setItem("webstudio-theme", next ? "light" : "dark");
                } catch {}
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            </button>
            <a className="nav-cta" href="/contact.html">
              Tư vấn ngay
            </a>
            <button
              type="button"
              className="menu-btn"
              aria-label={open ? "Đóng menu" : "Mở menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              ☰
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
