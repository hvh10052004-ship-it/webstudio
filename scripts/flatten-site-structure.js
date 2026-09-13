const fs = require("fs");
const path = require("path");

const root = "C:/Users/LAPTOP VINH HA/thiet-ke-website-chuyen-nghiep";

const cssParts = [
  "base.css",
  "header.css",
  "hero.css",
  "sections.css",
  "contact.css",
  "footer.css",
  "responsive.css",
].map((f) => fs.readFileSync(path.join(root, "css", f), "utf8"));

const pageCss = `
/* ===== INNER PAGES ===== */
.page-hero {
  padding: 140px 0 50px;
}

.page-hero h1 {
  font-size: clamp(34px, 5vw, 58px);
  letter-spacing: -2px;
  line-height: 1.08;
  max-width: 16ch;
  margin-bottom: 14px;
}

.page-hero p {
  color: #8d96a8;
  max-width: 52ch;
}

.page-content {
  padding: 0 0 110px;
}

.content-card,
.list-card,
.product-panel,
.cart-box,
.search-box {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.035);
  border-radius: 22px;
  padding: 28px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 22px;
}

.stack {
  display: grid;
  gap: 16px;
}

.list-card h3,
.product-panel h2,
.cart-box h2,
.search-box h2 {
  margin-bottom: 10px;
  font-size: 22px;
}

.list-card p,
.product-panel p,
.cart-box p,
.search-box p,
.content-card p {
  color: #8992a4;
  font-size: 15px;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 18px 0 24px;
}

.chip {
  display: inline-flex;
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  font-size: 12px;
  color: #bec5d5;
}

.price-inline {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -1px;
  margin: 18px 0;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.cart-item strong {
  display: block;
  margin-bottom: 4px;
}

.cart-item span {
  color: #7f899b;
  font-size: 13px;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 18px;
  font-weight: 700;
}

.sitemap-list {
  list-style: none;
  display: grid;
  gap: 12px;
}

.sitemap-list a {
  display: flex;
  justify-content: space-between;
  padding: 16px 18px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #d7dbe5;
  transition: 0.25s;
}

.sitemap-list a:hover {
  border-color: rgba(143, 124, 255, 0.5);
  background: rgba(255, 255, 255, 0.055);
}

.search-row {
  display: flex;
  gap: 12px;
  margin-bottom: 22px;
}

.search-row input {
  flex: 1;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.collection-item {
  min-height: 240px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 22px;
  position: relative;
  overflow: hidden;
}

.collection-item:nth-child(1) {
  background: radial-gradient(circle at 70% 20%, #6342ff 0%, transparent 35%), #131925;
}
.collection-item:nth-child(2) {
  background: radial-gradient(circle at 70% 20%, #00bbac 0%, transparent 35%), #10191a;
}
.collection-item:nth-child(3) {
  background: radial-gradient(circle at 70% 20%, #ef667d 0%, transparent 35%), #1b1218;
}
.collection-item:nth-child(4) {
  background: radial-gradient(circle at 70% 20%, #feca57 0%, transparent 35%), #1a1710;
}
.collection-item:nth-child(5) {
  background: radial-gradient(circle at 70% 20%, #72d8ff 0%, transparent 35%), #101820;
}
.collection-item:nth-child(6) {
  background: radial-gradient(circle at 70% 20%, #8f7cff 0%, transparent 35%), #14121f;
}

.collection-item h3 {
  position: absolute;
  left: 22px;
  bottom: 40px;
  font-size: 22px;
}

.collection-item p {
  position: absolute;
  left: 22px;
  bottom: 18px;
  color: #a6adba;
  font-size: 13px;
}

@media (max-width: 900px) {
  .content-grid,
  .collection-grid {
    grid-template-columns: 1fr;
  }
  .search-row {
    flex-direction: column;
  }
}
`;

fs.writeFileSync(
  path.join(root, "styles.css"),
  cssParts.join("\n\n") + "\n" + pageCss,
  "utf8"
);

const mainJs = `const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const siteHeader = document.getElementById("siteHeader");
const contactForm = document.getElementById("contactForm");
const searchForm = document.getElementById("searchForm");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

if (siteHeader) {
  window.addEventListener(
    "scroll",
    () => {
      siteHeader.classList.toggle("scrolled", window.scrollY > 50);
    },
    { passive: true }
  );
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
`;

fs.writeFileSync(path.join(root, "main.js"), mainJs, "utf8");

fs.writeFileSync(
  path.join(root, "manifest.webmanifest"),
  JSON.stringify(
    {
      name: "WebStudio",
      short_name: "WebStudio",
      description: "Thiết kế website chuyên nghiệp",
      start_url: "./index.html",
      display: "standalone",
      background_color: "#070b14",
      theme_color: "#8f7cff",
      lang: "vi",
      icons: [
        {
          src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f310.png",
          sizes: "72x72",
          type: "image/png",
        },
      ],
    },
    null,
    2
  ),
  "utf8"
);

function head(title, description) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="manifest" href="manifest.webmanifest" />
  <meta name="theme-color" content="#8f7cff" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div id="top">
`;
}

function header(active = "") {
  const item = (href, label, key) =>
    `<li><a href="${href}"${key === active ? ' style="color:#fff"' : ""}>${label}</a></li>`;
  return `    <header class="site-header" id="siteHeader">
      <div class="container">
        <nav class="site-nav">
          <a class="logo" href="index.html">Web<span>Studio.</span></a>
          <ul class="nav-links" id="navLinks">
            ${item("index.html", "Trang chủ", "home")}
            ${item("about.html", "Giới thiệu", "about")}
            ${item("collection.html", "Bộ sưu tập", "collection")}
            ${item("product.html", "Gói dịch vụ", "product")}
            ${item("search.html", "Tìm kiếm", "search")}
            <li><a class="nav-btn" href="index.html#contact">Nhận tư vấn</a></li>
          </ul>
          <button type="button" class="menu-btn" id="menuBtn" aria-label="Mở menu">☰</button>
        </nav>
      </div>
    </header>
`;
}

const footer = `    <footer class="site-footer">
      <div class="container">
        <div class="footer-content">
          <a class="logo" href="index.html">Web<span>Studio.</span></a>
          <p>© 2026 WebStudio. All rights reserved.</p>
          <div class="footer-links">
            <a href="sitemap.html">Sitemap</a>
            <a href="cart.html">Giỏ yêu cầu</a>
            <a href="index.html#contact">Liên hệ</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
  <script src="main.js"></script>
</body>
</html>
`;

// Keep homepage body from existing index but update assets + nav
let index = fs.readFileSync(path.join(root, "index.html"), "utf8");
index = index
  .replace(
    /<link rel="stylesheet" href="css\/[\s\S]*?responsive\.css" \/>/,
    `<link rel="manifest" href="manifest.webmanifest" />
  <meta name="theme-color" content="#8f7cff" />
  <link rel="stylesheet" href="styles.css" />`
  )
  .replace(
    /<a class="logo" href="#top">Web<span>Studio\.<\/span><\/a>/,
    `<a class="logo" href="index.html">Web<span>Studio.</span></a>`
  )
  .replace(
    /<ul class="nav-links" id="navLinks">[\s\S]*?<\/ul>/,
    `<ul class="nav-links" id="navLinks">
            <li><a href="index.html" style="color:#fff">Trang chủ</a></li>
            <li><a href="about.html">Giới thiệu</a></li>
            <li><a href="collection.html">Bộ sưu tập</a></li>
            <li><a href="product.html">Gói dịch vụ</a></li>
            <li><a href="search.html">Tìm kiếm</a></li>
            <li><a class="nav-btn" href="#contact">Nhận tư vấn</a></li>
          </ul>`
  )
  .replace(
    /<div class="footer-links">[\s\S]*?<\/div>/,
    `<div class="footer-links">
              <a href="sitemap.html">Sitemap</a>
              <a href="cart.html">Giỏ yêu cầu</a>
              <a href="#contact">Liên hệ</a>
            </div>`
  )
  .replace(
    /<a class="logo" href="#top">Web<span>Studio\.<\/span><\/a>/,
    `<a class="logo" href="index.html">Web<span>Studio.</span></a>`
  )
  .replace(
    /<script src="js\/menu\.js"><\/script>\s*<script src="js\/header\.js"><\/script>\s*<script src="js\/form\.js"><\/script>/,
    `<script src="main.js"></script>`
  );

fs.writeFileSync(path.join(root, "index.html"), index, "utf8");

const pages = {
  "about.html": {
    active: "about",
    title: "Giới thiệu | WebStudio",
    desc: "Tìm hiểu về WebStudio - đội ngũ thiết kế và lập trình website chuyên nghiệp.",
    body: `    <main>
      <section class="page-hero">
        <div class="container">
          <div class="section-label">About</div>
          <h1>Chúng tôi xây website để tạo khách hàng.</h1>
          <p>WebStudio tập trung vào thiết kế hiện đại, tốc độ cao và nội dung rõ ràng giúp doanh nghiệp chuyển đổi tốt hơn.</p>
        </div>
      </section>
      <section class="page-content">
        <div class="container content-grid">
          <article class="content-card">
            <h2 style="margin-bottom:12px">Sứ mệnh</h2>
            <p>Mang đến website đẹp, nhanh và dễ dùng — phù hợp mục tiêu kinh doanh thực tế của từng khách hàng.</p>
            <div class="meta-row">
              <span class="chip">UI/UX</span>
              <span class="chip">Frontend</span>
              <span class="chip">SEO</span>
              <span class="chip">E-commerce</span>
            </div>
            <a class="btn btn-primary" href="index.html#contact">Trao đổi dự án</a>
          </article>
          <div class="stack">
            <article class="list-card"><h3>50+ dự án</h3><p>Landing page, website công ty, cửa hàng online và SaaS.</p></article>
            <article class="list-card"><h3>Làm việc online</h3><p>Đồng hành toàn quốc, bàn giao rõ ràng theo từng giai đoạn.</p></article>
            <article class="list-card"><h3>Hỗ trợ sau launch</h3><p>Chỉnh sửa, hướng dẫn sử dụng và tối ưu tiếp theo nhu cầu.</p></article>
          </div>
        </div>
      </section>
    </main>
`,
  },
  "collection.html": {
    active: "collection",
    title: "Bộ sưu tập dự án | WebStudio",
    desc: "Xem các phong cách website WebStudio có thể xây dựng.",
    body: `    <main>
      <section class="page-hero">
        <div class="container">
          <div class="section-label">Collection</div>
          <h1>Bộ sưu tập phong cách website.</h1>
          <p>Một số hướng thiết kế phổ biến dành cho startup, cửa hàng và doanh nghiệp.</p>
        </div>
      </section>
      <section class="page-content">
        <div class="container collection-grid">
          <a class="collection-item" href="product.html"><h3>Nova Analytics</h3><p>Startup / SaaS</p></a>
          <a class="collection-item" href="product.html"><h3>Green Store</h3><p>E-commerce</p></a>
          <a class="collection-item" href="product.html"><h3>Aura Studio</h3><p>Landing Page</p></a>
          <a class="collection-item" href="product.html"><h3>Clinic Care</h3><p>Website dịch vụ</p></a>
          <a class="collection-item" href="product.html"><h3>Finance Pro</h3><p>Website công ty</p></a>
          <a class="collection-item" href="product.html"><h3>Foodly</h3><p>Nhà hàng / đặt bàn</p></a>
        </div>
      </section>
    </main>
`,
  },
  "product.html": {
    active: "product",
    title: "Gói Business | WebStudio",
    desc: "Chi tiết gói thiết kế website Business của WebStudio.",
    body: `    <main>
      <section class="page-hero">
        <div class="container">
          <div class="section-label">Product</div>
          <h1>Gói Business</h1>
          <p>Website chuyên nghiệp dành cho doanh nghiệp: 5–10 trang, UI riêng, CMS và SEO cơ bản.</p>
        </div>
      </section>
      <section class="page-content">
        <div class="container content-grid">
          <article class="product-panel">
            <h2>Bao gồm gì?</h2>
            <ul class="price-features">
              <li>5–10 trang nội dung</li>
              <li>Thiết kế UI riêng</li>
              <li>Responsive mọi thiết bị</li>
              <li>CMS quản trị</li>
              <li>SEO cơ bản + Analytics</li>
            </ul>
            <div class="price-inline">8.900.000đ</div>
            <div class="hero-actions">
              <a class="btn btn-primary" href="cart.html">Thêm vào giỏ yêu cầu</a>
              <a class="btn btn-secondary" href="index.html#contact">Tư vấn ngay</a>
            </div>
          </article>
          <article class="list-card">
            <h3>Phù hợp khi nào?</h3>
            <p>Doanh nghiệp cần website giới thiệu dịch vụ, dự án, đội ngũ và thu lead từ Google / quảng cáo.</p>
            <div class="meta-row">
              <span class="chip">Doanh nghiệp</span>
              <span class="chip">Dịch vụ</span>
              <span class="chip">Thương hiệu</span>
            </div>
            <a href="collection.html" class="btn btn-secondary">Xem bộ sưu tập</a>
          </article>
        </div>
      </section>
    </main>
`,
  },
  "cart.html": {
    active: "cart",
    title: "Giỏ yêu cầu | WebStudio",
    desc: "Danh sách gói dịch vụ bạn quan tâm.",
    body: `    <main>
      <section class="page-hero">
        <div class="container">
          <div class="section-label">Cart</div>
          <h1>Giỏ yêu cầu của bạn</h1>
          <p>Xác nhận các gói quan tâm rồi gửi yêu cầu tư vấn.</p>
        </div>
      </section>
      <section class="page-content">
        <div class="container">
          <div class="cart-box">
            <h2>Đã chọn</h2>
            <div class="cart-item">
              <div>
                <strong>Gói Business</strong>
                <span>Website doanh nghiệp 5–10 trang</span>
              </div>
              <div>8.900.000đ</div>
            </div>
            <div class="cart-item">
              <div>
                <strong>SEO cơ bản</strong>
                <span>Tối ưu cấu trúc & tốc độ</span>
              </div>
              <div>Miễn phí</div>
            </div>
            <div class="cart-total">
              <span>Tạm tính</span>
              <span>8.900.000đ</span>
            </div>
            <div class="hero-actions" style="margin-top:24px">
              <a class="btn btn-primary" href="index.html#contact">Gửi yêu cầu</a>
              <a class="btn btn-secondary" href="product.html">Xem lại gói</a>
            </div>
          </div>
        </div>
      </section>
    </main>
`,
  },
  "search.html": {
    active: "search",
    title: "Tìm kiếm | WebStudio",
    desc: "Tìm dịch vụ hoặc dự án trên WebStudio.",
    body: `    <main>
      <section class="page-hero">
        <div class="container">
          <div class="section-label">Search</div>
          <h1>Tìm dịch vụ hoặc dự án</h1>
          <p>Nhập từ khóa như Landing Page, SaaS, E-commerce...</p>
        </div>
      </section>
      <section class="page-content">
        <div class="container">
          <form class="search-box" id="searchForm">
            <h2>Từ khóa</h2>
            <div class="search-row">
              <input class="form-control" type="search" name="q" placeholder="Ví dụ: website công ty" required />
              <button class="btn btn-primary" type="submit">Tìm</button>
            </div>
            <p id="searchResult">Kết quả sẽ hiện tại đây.</p>
          </form>
        </div>
      </section>
    </main>
`,
  },
  "sitemap.html": {
    active: "sitemap",
    title: "Sitemap | WebStudio",
    desc: "Sơ đồ trang WebStudio.",
    body: `    <main>
      <section class="page-hero">
        <div class="container">
          <div class="section-label">Sitemap</div>
          <h1>Sơ đồ trang</h1>
          <p>Tất cả trang chính của website WebStudio.</p>
        </div>
      </section>
      <section class="page-content">
        <div class="container">
          <ul class="sitemap-list">
            <li><a href="index.html"><span>Trang chủ</span><span>index.html</span></a></li>
            <li><a href="about.html"><span>Giới thiệu</span><span>about.html</span></a></li>
            <li><a href="collection.html"><span>Bộ sưu tập</span><span>collection.html</span></a></li>
            <li><a href="product.html"><span>Gói dịch vụ</span><span>product.html</span></a></li>
            <li><a href="cart.html"><span>Giỏ yêu cầu</span><span>cart.html</span></a></li>
            <li><a href="search.html"><span>Tìm kiếm</span><span>search.html</span></a></li>
            <li><a href="sitemap.html"><span>Sitemap</span><span>sitemap.html</span></a></li>
          </ul>
        </div>
      </section>
    </main>
`,
  },
};

for (const [filename, page] of Object.entries(pages)) {
  const html =
    head(page.title, page.desc) +
    header(page.active) +
    page.body +
    footer;
  fs.writeFileSync(path.join(root, filename), html, "utf8");
}

// cleanup old folders
for (const dir of ["css", "js"]) {
  const full = path.join(root, dir);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true, force: true });
  }
}

console.log("Done. Flat structure ready.");
