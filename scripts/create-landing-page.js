const fs = require("fs");
const path = require("path");
const root = "C:/Users/LAPTOP VINH HA/thiet-ke-website-chuyen-nghiep";

// Take header+footer shell from product.html
const product = fs.readFileSync(path.join(root, "product.html"), "utf8");
const headerMatch = product.match(/[\s\S]*?<main>/);
const footerMatch = product.match(/<\/main>[\s\S]*/);
if (!headerMatch || !footerMatch) {
  throw new Error("Cannot parse product.html shell");
}

let head = headerMatch[0]
  .replace(
    /<title>[\s\S]*?<\/title>/,
    "<title>Thiết kế Landing Page | WebStudio</title>"
  )
  .replace(
    /<meta name="description"[^>]*>/,
    '<meta name="description" content="Thiết kế Landing Page chuyên nghiệp, tối ưu chuyển đổi cho quảng cáo, sản phẩm và thu lead." />'
  )
  .replace(
    /<li><a href="product\.html">Landing Page<\/a><\/li>/,
    '<li><a href="landing.html">Landing Page</a></li>'
  );

const body = `
    <main>
      <section class="page-hero">
        <div class="container">
          <div class="section-label">Landing Page</div>
          <h1>Landing Page tập trung chuyển đổi.</h1>
          <p>
            Một trang — một mục tiêu rõ ràng: thu lead, đặt lịch hoặc bán sản phẩm.
            Thiết kế đẹp, tải nhanh, sẵn sàng chạy quảng cáo.
          </p>
          <div class="hero-actions" style="margin-top:24px">
            <a class="btn btn-primary" href="index.html#contact">Nhận tư vấn Landing Page</a>
            <a class="btn btn-secondary" href="cart.html">Thêm vào giỏ yêu cầu</a>
          </div>
        </div>
      </section>

      <section class="page-content">
        <div class="container content-grid">
          <article class="product-panel">
            <h2>Landing Page mang lại gì?</h2>
            <ul class="price-features">
              <li>01 trang tập trung thông điệp chính</li>
              <li>Bố cục tối ưu CTA / form đăng ký</li>
              <li>Responsive trên mobile &amp; desktop</li>
              <li>Tối ưu tốc độ tải trang</li>
              <li>SEO cơ bản + gắn tracking (Pixel/GA)</li>
            </ul>
            <div class="price-inline">Từ 3.900.000đ</div>
            <div class="hero-actions">
              <a class="btn btn-primary" href="index.html#contact">Đặt lịch tư vấn</a>
              <a class="btn btn-secondary" href="collection.html">Xem mẫu dự án</a>
            </div>
          </article>

          <div class="stack">
            <article class="list-card">
              <h3>Phù hợp khi nào?</h3>
              <p>
                Chạy Facebook/Google Ads, ra mắt sản phẩm mới, sự kiện, khóa học
                hoặc chiến dịch cần thu khách hàng tiềm năng nhanh.
              </p>
              <div class="meta-row">
                <span class="chip">Quảng cáo</span>
                <span class="chip">Thu lead</span>
                <span class="chip">Chuyển đổi</span>
              </div>
            </article>
            <article class="list-card">
              <h3>Quy trình làm việc</h3>
              <p>
                Trao đổi mục tiêu → thiết kế UI → lập trình → tối ưu → bàn giao
                và hướng dẫn chạy campaign.
              </p>
            </article>
            <article class="list-card">
              <h3>Thời gian dự kiến</h3>
              <p>Thường 5–10 ngày làm việc tùy độ phức tạp nội dung và form.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="cta-box">
            <h2>Sẵn sàng có Landing Page chuyển đổi tốt?</h2>
            <p>
              Gửi brief ngắn — chúng tôi đề xuất bố cục, thông điệp và ước tính
              thời gian phù hợp ngân sách của bạn.
            </p>
            <a href="index.html#contact" class="btn btn-primary">Trao đổi dự án →</a>
          </div>
        </div>
      </section>
    </main>
`;

let html = head + body + footerMatch[0];
fs.writeFileSync(path.join(root, "landing.html"), html, "utf8");
console.log("Created landing.html");

// Update links across site
const files = [
  "index.html",
  "about.html",
  "collection.html",
  "product.html",
  "cart.html",
  "search.html",
  "sitemap.html",
  "landing.html",
];

for (const file of files) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) continue;
  let text = fs.readFileSync(full, "utf8");
  text = text.replaceAll(
    '<li><a href="product.html">Landing Page</a></li>',
    '<li><a href="landing.html">Landing Page</a></li>'
  );
  text = text.replaceAll(
    '<li><a href="product.html">Thiết kế landing page</a></li>',
    '<li><a href="landing.html">Thiết kế landing page</a></li>'
  );
  fs.writeFileSync(full, text, "utf8");
}

// Make service card clickable on index
let index = fs.readFileSync(path.join(root, "index.html"), "utf8");
index = index.replace(
  `<article class="service-card">
              <div class="service-number">01</div>
              <div class="service-icon">⚡</div>
              <h3>Landing Page</h3>
              <p>
                Landing Page tập trung vào chuyển đổi, phù hợp cho chạy quảng
                cáo, giới thiệu sản phẩm, sự kiện hoặc thu thập khách hàng tiềm năng.
              </p>
              <div class="service-arrow">↗</div>
            </article>`,
  `<a class="service-card" href="landing.html">
              <div class="service-number">01</div>
              <div class="service-icon">⚡</div>
              <h3>Landing Page</h3>
              <p>
                Landing Page tập trung vào chuyển đổi, phù hợp cho chạy quảng
                cáo, giới thiệu sản phẩm, sự kiện hoặc thu thập khách hàng tiềm năng.
              </p>
              <div class="service-arrow">↗</div>
            </a>`
);
fs.writeFileSync(path.join(root, "index.html"), index, "utf8");

// Update search featured href
let mainJs = fs.readFileSync(path.join(root, "main.js"), "utf8");
mainJs = mainJs.replace(
  `title: "Thiết kế Landing Page",
    href: "product.html",`,
  `title: "Thiết kế Landing Page",
    href: "landing.html",`
);
fs.writeFileSync(path.join(root, "main.js"), mainJs, "utf8");

// CSS for anchor service cards
let css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
if (!css.includes("a.service-card")) {
  css += `

a.service-card {
  display: block;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
`;
  fs.writeFileSync(path.join(root, "styles.css"), css, "utf8");
}

console.log("Landing page linked.");
