"use client";

import { useState } from "react";

export function SalesHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sales-header">
      <div className="sales-wrap">
        <nav className="sales-nav">
          <a className="sales-logo" href="#top">
            AURA<span>.</span>
          </a>
          <ul className={`sales-links${open ? " open" : ""}`}>
            <li>
              <a href="#loi-ich" onClick={() => setOpen(false)}>
                Lợi ích
              </a>
            </li>
            <li>
              <a href="#danh-gia" onClick={() => setOpen(false)}>
                Đánh giá
              </a>
            </li>
            <li>
              <a href="#offer" onClick={() => setOpen(false)}>
                Ưu đãi
              </a>
            </li>
            <li>
              <a href="#faq" onClick={() => setOpen(false)}>
                FAQ
              </a>
            </li>
            <li>
              <a
                className="sales-nav-cta"
                href="#dat-hang"
                onClick={() => setOpen(false)}
              >
                Đặt hàng
              </a>
            </li>
          </ul>
          <button
            type="button"
            className="sales-menu-btn"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "×" : "☰"}
          </button>
        </nav>
      </div>
    </header>
  );
}
