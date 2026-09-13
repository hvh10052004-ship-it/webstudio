const fs = require("fs");
const path = require("path");

const root = "C:/Users/LAPTOP VINH HA/thiet-ke-website-chuyen-nghiep";

const searchIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>`;
const sunIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>`;

function headerHtml(contactHref) {
  return `    <header class="site-header" id="siteHeader">
      <div class="container">
        <nav class="site-nav">
          <a class="logo" href="index.html">Web<span>Studio.</span></a>

          <div class="nav-cluster" id="navLinks">
            <ul class="nav-pill">
              <li><a href="index.html">Trang chủ</a></li>
              <li><a href="about.html">Về chúng tôi</a></li>
              <li class="has-dropdown">
                <button type="button" class="nav-drop-btn" aria-expanded="false">
                  Thiết kế Website <span class="chev" aria-hidden="true"></span>
                </button>
                <ul class="dropdown">
                  <li><a href="product.html">Landing Page</a></li>
                  <li><a href="product.html">Website công ty</a></li>
                  <li><a href="product.html">Website Startup / SaaS</a></li>
                  <li><a href="product.html">Web bán hàng / E-commerce</a></li>
                </ul>
              </li>
              <li class="has-dropdown">
                <button type="button" class="nav-drop-btn" aria-expanded="false">
                  Dịch vụ <span class="chev" aria-hidden="true"></span>
                </button>
                <ul class="dropdown">
                  <li><a href="index.html#services">Thiết kế UI/UX</a></li>
                  <li><a href="index.html#services">Lập trình web</a></li>
                  <li><a href="index.html#pricing">Bảng giá</a></li>
                </ul>
              </li>
              <li><a href="collection.html">Dự án</a></li>
              <li class="has-dropdown more">
                <button type="button" class="nav-more" aria-label="Thêm menu" aria-expanded="false">⋯</button>
                <ul class="dropdown">
                  <li><a href="cart.html">Giỏ yêu cầu</a></li>
                  <li><a href="sitemap.html">Sitemap</a></li>
                  <li><a href="index.html#process">Quy trình</a></li>
                </ul>
              </li>
            </ul>

            <div class="nav-tools">
              <a class="icon-btn" href="search.html" aria-label="Tìm kiếm">${searchIcon}</a>
              <button type="button" class="icon-btn" id="themeToggle" aria-label="Đổi giao diện">${sunIcon}</button>
            </div>

            <a class="nav-cta" href="${contactHref}">Tư vấn ngay</a>
          </div>

          <button type="button" class="menu-btn" id="menuBtn" aria-label="Mở menu">☰</button>
        </nav>
      </div>
    </header>`;
}

const files = [
  "index.html",
  "about.html",
  "collection.html",
  "product.html",
  "cart.html",
  "search.html",
  "sitemap.html",
];

for (const file of files) {
  const full = path.join(root, file);
  let html = fs.readFileSync(full, "utf8");
  const contactHref = file === "index.html" ? "#contact" : "index.html#contact";
  html = html.replace(
    /<header class="site-header"[\s\S]*?<\/header>/,
    headerHtml(contactHref)
  );
  fs.writeFileSync(full, html, "utf8");
  console.log("Updated header:", file);
}

// Replace header CSS block in styles.css
let css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

const newHeaderCss = `.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  border-bottom: 0;
  background: transparent;
  transition: background 0.3s ease, backdrop-filter 0.3s ease;
}

.site-header.scrolled {
  background: rgba(7, 11, 20, 0.72);
  backdrop-filter: blur(16px);
}

.site-nav {
  min-height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
}

.logo {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -1px;
  color: #fff;
  flex-shrink: 0;
}

.logo span {
  color: #8f7cff;
}

.nav-cluster {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.nav-pill,
.nav-tools {
  display: flex;
  align-items: center;
  list-style: none;
  background: #e8ebf0;
  border-radius: 999px;
  padding: 6px;
  gap: 2px;
}

.nav-pill a,
.nav-drop-btn,
.nav-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  color: #1a1f2b;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  white-space: nowrap;
}

.nav-pill a:hover,
.nav-drop-btn:hover,
.nav-more:hover,
.has-dropdown.open > .nav-drop-btn,
.has-dropdown.open > .nav-more {
  background: rgba(255, 255, 255, 0.85);
}

.chev {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #1a1f2b;
  margin-top: 2px;
}

.nav-more {
  font-size: 18px;
  line-height: 1;
  padding: 8px 14px;
  letter-spacing: 1px;
}

.has-dropdown {
  position: relative;
}

.dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  min-width: 200px;
  list-style: none;
  padding: 8px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
  display: none;
  z-index: 20;
}

.has-dropdown.open > .dropdown {
  display: grid;
  gap: 2px;
}

.dropdown a {
  display: block;
  padding: 10px 12px;
  border-radius: 10px;
  color: #1a1f2b;
  font-size: 14px;
  font-weight: 500;
}

.dropdown a:hover {
  background: #eef1f5;
}

.more .dropdown {
  left: auto;
  right: 0;
}

.icon-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 0;
  background: #fff;
  color: #1a1f2b;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.icon-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.nav-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 22px;
  border-radius: 999px;
  background: #e11d2e;
  color: #fff !important;
  font-size: 14px;
  font-weight: 700;
  transition: transform 0.2s ease, background 0.2s ease;
}

.nav-cta:hover {
  background: #c41625;
  transform: translateY(-1px);
}

.menu-btn {
  display: none;
  font-size: 28px;
  cursor: pointer;
  background: none;
  border: 0;
  color: #fff;
  line-height: 1;
}

body.theme-light {
  background: #f4f6f8;
  color: #121722;
}

body.theme-light::before,
body.theme-light::after {
  opacity: 0.05;
}

body.theme-light .logo,
body.theme-light .menu-btn {
  color: #121722;
}

body.theme-light .site-header.scrolled {
  background: rgba(244, 246, 248, 0.86);
}
`;

css = css.replace(
  /\.site-header \{[\s\S]*?\.menu-btn \{[\s\S]*?line-height: 1;\n\}/,
  newHeaderCss.trim()
);

css = css.replace(
  /@media \(max-width: 900px\) \{\n  \.nav-links \{[\s\S]*?\.menu-btn \{\n    display: block;\n  \}/,
  `@media (max-width: 900px) {
  .nav-cluster {
    display: none;
    position: absolute;
    top: 76px;
    left: 0;
    right: 0;
    width: 100%;
    padding: 18px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    background: #0b101a;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .nav-cluster.active {
    display: flex;
  }

  .nav-pill,
  .nav-tools {
    width: 100%;
    border-radius: 18px;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .nav-cta {
    width: 100%;
  }

  .dropdown {
    position: static;
    box-shadow: none;
    background: #f3f5f8;
    margin: 0 8px 8px;
  }

  .menu-btn {
    display: block;
  }`
);

fs.writeFileSync(path.join(root, "styles.css"), css, "utf8");

fs.writeFileSync(
  path.join(root, "main.js"),
  `const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const siteHeader = document.getElementById("siteHeader");
const contactForm = document.getElementById("contactForm");
const searchForm = document.getElementById("searchForm");
const themeToggle = document.getElementById("themeToggle");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      document.querySelectorAll(".has-dropdown.open").forEach((el) => {
        el.classList.remove("open");
        const btn = el.querySelector("[aria-expanded]");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    });
  });
}

document.querySelectorAll(".has-dropdown").forEach((item) => {
  const btn = item.querySelector(".nav-drop-btn, .nav-more");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !item.classList.contains("open");
    document.querySelectorAll(".has-dropdown.open").forEach((el) => {
      if (el !== item) {
        el.classList.remove("open");
        const other = el.querySelector("[aria-expanded]");
        if (other) other.setAttribute("aria-expanded", "false");
      }
    });
    item.classList.toggle("open", willOpen);
    btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });
});

document.addEventListener("click", () => {
  document.querySelectorAll(".has-dropdown.open").forEach((el) => {
    el.classList.remove("open");
    const btn = el.querySelector("[aria-expanded]");
    if (btn) btn.setAttribute("aria-expanded", "false");
  });
});

if (siteHeader) {
  window.addEventListener(
    "scroll",
    () => {
      siteHeader.classList.toggle("scrolled", window.scrollY > 50);
    },
    { passive: true }
  );
}

if (themeToggle) {
  const saved = localStorage.getItem("webstudio-theme");
  if (saved === "light") document.body.classList.add("theme-light");

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("theme-light");
    localStorage.setItem(
      "webstudio-theme",
      document.body.classList.contains("theme-light") ? "light" : "dark"
    );
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Cảm ơn bạn! Yêu cầu của bạn đã được gửi.");
    this.reset();
  });
}

if (searchForm) {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const q = new FormData(this).get("q");
    const result = document.getElementById("searchResult");
    if (result) {
      result.textContent = q
        ? \`Đã tìm: "\${q}" — hiển thị các dự án / dịch vụ liên quan.\`
        : "Vui lòng nhập từ khóa.";
    }
  });
}
`,
  "utf8"
);

console.log("Nav redesign complete.");
