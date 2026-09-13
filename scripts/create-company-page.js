const fs = require("fs");
const path = require("path");
const root = "C:/Users/LAPTOP VINH HA/thiet-ke-website-chuyen-nghiep";

const landing = fs.readFileSync(path.join(root, "landing.html"), "utf8");
const headerPart = landing.slice(0, landing.indexOf("<main>"));
const footerPart = landing.slice(landing.indexOf("<footer class=\"site-footer\">"));

const head = headerPart
  .replace(
    /<title>[\s\S]*?<\/title>/,
    "<title>Thiết kế Website công ty | WebStudio</title>"
  )
  .replace(
    /<meta name="description"[^>]*>/,
    '<meta name="description" content="Thiết kế website công ty chuyên nghiệp: giới thiệu doanh nghiệp, dịch vụ, đội ngũ, dự án và xây dựng thương hiệu." />'
  )
  .replace(
    '<li><a href="product.html">Website công ty</a></li>',
    '<li><a href="company.html">Website công ty</a></li>'
  );

const main = `<main>
      <section class="page-hero">
        <div class="container">
          <div class="section-label">Website công ty</div>
          <h1>Website doanh nghiệp chuyên nghiệp.</h1>
          <p>
            Giới thiệu công ty, dịch vụ, đội ngũ và dự án một cách rõ ràng —
            giúp khách hàng tin tưởng và liên hệ nhanh hơn.
          </p>
          <div class="hero-actions" style="margin-top:24px">
            <a class="btn btn-primary" href="index.html#contact">Nhận tư vấn Website công ty</a>
            <a class="btn btn-secondary" href="cart.html">Thêm vào giỏ yêu cầu</a>
          </div>
        </div>
      </section>

      <section class="page-content">
        <div class="container content-grid">
          <article class="product-panel">
            <h2>Website công ty gồm những gì?</h2>
            <ul class="price-features">
              <li>5–10 trang: Trang chủ, Giới thiệu, Dịch vụ, Dự án, Liên hệ…</li>
              <li>Thiết kế UI đúng nhận diện thương hiệu</li>
              <li>Responsive trên máy tính &amp; điện thoại</li>
              <li>CMS quản trị nội dung cơ bản</li>
              <li>SEO kỹ thuật + Google Analytics</li>
            </ul>
            <div class="price-inline">Từ 8.900.000đ</div>
            <div class="hero-actions">
              <a class="btn btn-primary" href="index.html#contact">Đặt lịch tư vấn</a>
              <a class="btn btn-secondary" href="#mau-cong-ty">Xem ảnh mẫu</a>
            </div>
          </article>

          <div class="stack">
            <article class="list-card">
              <h3>Phù hợp khi nào?</h3>
              <p>
                Doanh nghiệp cần mặt tiền số để giới thiệu dịch vụ, xây dựng uy tín,
                hỗ trợ sales và thu lead từ Google / mạng xã hội.
              </p>
              <div class="meta-row">
                <span class="chip">Doanh nghiệp</span>
                <span class="chip">Thương hiệu</span>
                <span class="chip">Uy tín</span>
              </div>
            </article>
            <article class="list-card">
              <h3>Các trang thường có</h3>
              <p>
                Trang chủ, Về chúng tôi, Dịch vụ/Sản phẩm, Dự án/Case study,
                Đội ngũ, Tin tức (tuỳ chọn), Liên hệ.
              </p>
            </article>
            <article class="list-card">
              <h3>Thời gian dự kiến</h3>
              <p>Thường 2–4 tuần tùy số trang, nội dung và số vòng chỉnh sửa.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="section sample-section" id="mau-cong-ty">
        <div class="container">
          <div class="section-label">Ảnh mẫu</div>
          <h2 class="section-title">Phong cách website công ty tham khảo</h2>
          <p class="section-description">
            Hình ảnh minh họa hướng thiết kế corporate — giao diện thực tế sẽ
            chỉnh theo brand guideline của doanh nghiệp bạn.
          </p>
          <div class="sample-grid">
            <figure class="sample-card sample-card--wide">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&amp;fit=crop&amp;w=1400&amp;q=80"
                alt="Mẫu website công ty văn phòng hiện đại"
                loading="lazy"
              />
              <figcaption>
                <strong>Corporate Home</strong>
                <span>Trang chủ doanh nghiệp chuyên nghiệp</span>
              </figcaption>
            </figure>
            <figure class="sample-card">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&amp;fit=crop&amp;w=900&amp;q=80"
                alt="Mẫu trang giới thiệu đội ngũ"
                loading="lazy"
              />
              <figcaption>
                <strong>About &amp; Team</strong>
                <span>Giới thiệu công ty và đội ngũ</span>
              </figcaption>
            </figure>
            <figure class="sample-card">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&amp;fit=crop&amp;w=900&amp;q=80"
                alt="Mẫu trang dịch vụ doanh nghiệp"
                loading="lazy"
              />
              <figcaption>
                <strong>Services</strong>
                <span>Trang dịch vụ / giải pháp</span>
              </figcaption>
            </figure>
            <figure class="sample-card">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&amp;fit=crop&amp;w=900&amp;q=80"
                alt="Mẫu trang dự án case study"
                loading="lazy"
              />
              <figcaption>
                <strong>Projects</strong>
                <span>Dự án / case study</span>
              </figcaption>
            </figure>
            <figure class="sample-card">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&amp;fit=crop&amp;w=900&amp;q=80"
                alt="Mẫu trang liên hệ doanh nghiệp"
                loading="lazy"
              />
              <figcaption>
                <strong>Contact</strong>
                <span>Trang liên hệ &amp; form tư vấn</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="cta-box">
            <h2>Sẵn sàng có website công ty chuyên nghiệp?</h2>
            <p>
              Chia sẻ ngành nghề và mục tiêu — chúng tôi đề xuất cấu trúc trang,
              phong cách thiết kế và lộ trình bàn giao phù hợp.
            </p>
            <a href="index.html#contact" class="btn btn-primary">Trao đổi dự án →</a>
          </div>
        </div>
      </section>
    </main>
`;

fs.writeFileSync(path.join(root, "company.html"), head + main + footerPart, "utf8");
console.log("Created company.html");

const files = fs.readdirSync(root).filter((f) => f.endsWith(".html"));
for (const file of files) {
  const full = path.join(root, file);
  let html = fs.readFileSync(full, "utf8");
  html = html
    .replaceAll(
      '<li><a href="product.html">Website công ty</a></li>',
      '<li><a href="company.html">Website công ty</a></li>'
    )
    .replaceAll(
      '<li><a href="product.html">Thiết kế website công ty</a></li>',
      '<li><a href="company.html">Thiết kế website công ty</a></li>'
    )
    .replaceAll(
      '<a class="collection-item" href="product.html"><h3>Finance Pro</h3><p>Website công ty</p></a>',
      '<a class="collection-item" href="company.html"><h3>Finance Pro</h3><p>Website công ty</p></a>'
    );
  fs.writeFileSync(full, html, "utf8");
}

let index = fs.readFileSync(path.join(root, "index.html"), "utf8");
index = index.replace(
  `<article class="service-card">
              <div class="service-number">02</div>
              <div class="service-icon">🏢</div>
              <h3>Website công ty</h3>
              <p>
                Website chuyên nghiệp giúp giới thiệu doanh nghiệp, dịch vụ,
                đội ngũ, dự án và xây dựng uy tín thương hiệu trên Internet.
              </p>
              <div class="service-arrow">↗</div>
            </article>`,
  `<a class="service-card" href="company.html">
              <div class="service-number">02</div>
              <div class="service-icon">🏢</div>
              <h3>Website công ty</h3>
              <p>
                Website chuyên nghiệp giúp giới thiệu doanh nghiệp, dịch vụ,
                đội ngũ, dự án và xây dựng uy tín thương hiệu trên Internet.
              </p>
              <div class="service-arrow">↗</div>
            </a>`
);
fs.writeFileSync(path.join(root, "index.html"), index, "utf8");

let mainJs = fs.readFileSync(path.join(root, "main.js"), "utf8");
mainJs = mainJs.replace(
  `title: "Thiết kế Website công ty",
    href: "product.html",`,
  `title: "Thiết kế Website công ty",
    href: "company.html",`
);
// also handle if href is on next line differently
if (!mainJs.includes('href: "company.html"')) {
  mainJs = mainJs.replace(
    /title: "Thiết kế Website công ty",\s*href: "[^"]+",/,
    'title: "Thiết kế Website công ty",\n    href: "company.html",'
  );
}
fs.writeFileSync(path.join(root, "main.js"), mainJs, "utf8");

// sitemap entry
const sitemapPath = path.join(root, "sitemap.html");
let sitemap = fs.readFileSync(sitemapPath, "utf8");
if (!sitemap.includes("company.html")) {
  sitemap = sitemap.replace(
    '<li><a href="landing.html"><span>Chính sách bảo mật</span>',
    "PLACEHOLDER_SKIP"
  );
  // insert near product/landing if exists
  if (sitemap.includes("landing.html") && sitemap.includes("sitemap-list")) {
    sitemap = sitemap.replace(
      /(<li><a href="product\.html">[\s\S]*?<\/a><\/li>)/,
      `$1\n            <li><a href="company.html"><span>Website công ty</span><span>company.html</span></a></li>`
    );
  }
  if (!sitemap.includes('company.html')) {
    sitemap = sitemap.replace(
      '<li><a href="product.html"><span>Gói dịch vụ</span><span>product.html</span></a></li>',
      `<li><a href="product.html"><span>Gói dịch vụ</span><span>product.html</span></a></li>
            <li><a href="company.html"><span>Website công ty</span><span>company.html</span></a></li>
            <li><a href="landing.html"><span>Landing Page</span><span>landing.html</span></a></li>`
    );
  }
  fs.writeFileSync(sitemapPath, sitemap, "utf8");
}

console.log("Company page ready.");
