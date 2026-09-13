const fs = require("fs");
const p = "C:/Users/LAPTOP VINH HA/thiet-ke-website-chuyen-nghiep/styles.css";
let css = fs.readFileSync(p, "utf8");
if (css.includes("SEARCH OVERLAY")) {
  console.log("already present");
  process.exit(0);
}

css += `

/* ===== SEARCH OVERLAY ===== */
body.search-open {
  overflow: hidden;
}

.search-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgba(7, 11, 20, 0.45);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.28s ease;
}

.search-panel {
  position: fixed;
  top: 92px;
  left: max(16px, calc((100vw - 1180px) / 2));
  width: min(640px, calc(100vw - 32px));
  max-height: min(78vh, 720px);
  z-index: 1101;
  background: #f4f5f7;
  color: #121722;
  border-radius: 28px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.28);
  padding: 22px;
  overflow: auto;
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
  pointer-events: none;
  transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

body.search-open .search-backdrop {
  opacity: 1;
  pointer-events: auto;
}

body.search-open .search-panel {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.search-field {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 54px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1.5px solid #2a3140;
  background: #fff;
}

.search-field svg {
  flex-shrink: 0;
  color: #6b7280;
}

.search-field input {
  flex: 1;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: #121722;
  min-width: 0;
}

.search-field input::placeholder {
  color: #9aa1ae;
}

.search-featured {
  margin-top: 28px;
}

.search-featured h3 {
  font-size: 28px;
  letter-spacing: -0.5px;
  margin-bottom: 18px;
  color: #111827;
}

.search-featured ul {
  list-style: none;
  display: grid;
  gap: 14px;
}

.search-featured li a {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #1f2937;
  font-size: 16px;
  line-height: 1.45;
  padding: 4px 2px;
  border-radius: 10px;
  transition: background 0.2s ease;
}

.search-featured li a:hover {
  background: rgba(0, 0, 0, 0.04);
}

.search-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #111827;
  color: #fff;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.search-check svg {
  width: 12px;
  height: 12px;
}

.search-featured li.is-hidden {
  display: none;
}

.search-empty {
  display: none;
  color: #6b7280;
  margin-top: 8px;
}

.search-empty.is-visible {
  display: block;
}

#searchOpen.is-close {
  background: #e11d2e;
  color: #fff;
}

#searchOpen.is-close:hover {
  box-shadow: 0 6px 16px rgba(225, 29, 46, 0.35);
}

body.theme-light .search-backdrop {
  background: rgba(18, 23, 34, 0.28);
}

body:not(.theme-light) .search-panel {
  background: #171b24;
  color: #eef1f6;
}

body:not(.theme-light) .search-field {
  background: #0f131a;
  border-color: #3a4252;
}

body:not(.theme-light) .search-field input,
body:not(.theme-light) .search-featured h3,
body:not(.theme-light) .search-featured li a {
  color: #eef1f6;
}

body:not(.theme-light) .search-field input::placeholder,
body:not(.theme-light) .search-field svg,
body:not(.theme-light) .search-empty {
  color: #8b93a3;
}

body:not(.theme-light) .search-check {
  background: #eef1f6;
  color: #111827;
}

body:not(.theme-light) .search-featured li a:hover {
  background: rgba(255, 255, 255, 0.05);
}

@media (max-width: 900px) {
  .search-panel {
    top: 84px;
    left: 12px;
    width: calc(100vw - 24px);
    border-radius: 22px;
    padding: 18px;
  }

  .search-featured h3 {
    font-size: 22px;
  }
}
`;

fs.writeFileSync(p, css);
console.log("css appended");
