const fs = require("fs");
const path = require("path");
const root = "C:/Users/LAPTOP VINH HA/thiet-ke-website-chuyen-nghiep";

const company = fs.readFileSync(path.join(root, "company.html"), "utf8");
const headerPart = company.slice(0, company.indexOf("<main>"));
const footerPart = company.slice(company.indexOf('<footer class="site-footer">'));

function makePage({ file, title, description, navReplace, mainHtml }) {
  let head = headerPart
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${description}" />`
    );
  for (const [from, to] of navReplace) {
    head = head.replaceAll(from, to);
  }
  fs.writeFileSync(path.join(root, file), head + mainHtml + footerPart, "utf8");
  console.log("Created", file);
}

makePage({
  file: "ecommerce.html",
  title: "Thiết kế Web bán hàng / E-commerce | WebStudio",
  description:
    "Thiết kế website bán hàng E-commerce: danh mục, giỏ hàng, đặt hàng, quản lý đơn và thanh toán.",
  navReplace: [
    [
      '<li><a href="product.html">Web bán hàng / E-commerce</a></li>',
      '<li><a href="ecommerce.html">Web bán hàng / E-commerce</a></li>',
    ],
  ],
  mainHtml: `<main>
      <section class="page-hero">
        <div class="container">
          <div class="section-label">E-commerce</div>
          <h1>Web bán hàng hoàn chỉnh.</h1>
          <p>
            Danh mục sản phẩm, giỏ hàng, đặt hàng và thanh toán — tối ưu cho
            trải nghiệm mua trên điện thoại và máy tính.
          </p>
          <div class="hero-actions" style="margin-top:24px">
            <a class="btn btn-primary" href="index.html#contact">Nhận tư vấn E-commerce</a>
            <a class="btn btn-secondary" href="cart.html">Thêm vào giỏ yêu cầu</a>
          </div>
        </div>
      </section>

      <section class="page-content">
        <div class="container content-grid">
          <article class="product-panel">
            <h2>Website bán hàng gồm gì?</h2>
            <ul class="price-features">
              <li>Danh mục &amp; trang chi tiết sản phẩm</li>
              <li>Giỏ hàng, đặt hàng, quản lý đơn</li>
              <li>Tích hợp thanh toán phổ biến</li>
              <li>Responsive mobile-first</li>
              <li>SEO sản phẩm + theo dõi chuyển đổi</li>
            </ul>
            <div class="price-inline">Liên hệ báo giá</div>
            <div class="hero-actions">
              <a class="btn btn-primary" href="index.html#contact">Đặt lịch tư vấn</a>
              <a class="btn btn-secondary" href="#mau-ecommerce">Xem ảnh mẫu</a>
            </div>
          </article>
          <div class="stack">
            <article class="list-card">
              <h3>Phù hợp khi nào?</h3>
              <p>
                Shop online, thương hiệu muốn bán trực tiếp, mở rộng kênh bán
                ngoài mạng xã hội hoặc cần quản lý đơn tập trung.
              </p>
              <div class="meta-row">
                <span class="chip">Bán hàng</span>
                <span class="chip">Giỏ hàng</span>
                <span class="chip">Thanh toán</span>
              </div>
            </article>
            <article class="list-card">
              <h3>Tính năng mở rộng</h3>
              <p>
                Mã giảm giá, phân loại biến thể, kho hàng, thông báo đơn hàng,
                tích hợp vận chuyển — tuỳ theo nhu cầu.
              </p>
            </article>
            <article class="list-card">
              <h3>Thời gian dự kiến</h3>
              <p>Thường 3–6 tuần tùy số sản phẩm, luồng thanh toán và tích hợp.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="section sample-section" id="mau-ecommerce">
        <div class="container">
          <div class="section-label">Ảnh mẫu</div>
          <h2 class="section-title">Phong cách web bán hàng tham khảo</h2>
          <p class="section-description">
            Hình ảnh minh họa trải nghiệm mua sắm — giao diện thực tế sẽ theo
            nhận diện thương hiệu và ngành hàng của bạn.
          </p>
          <div class="sample-grid">
            <figure class="sample-card sample-card--wide">
              <img src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&amp;fit=crop&amp;w=1400&amp;q=80" alt="Mẫu trang cửa hàng online" loading="lazy" />
              <figcaption><strong>Store Front</strong><span>Trang chủ cửa hàng</span></figcaption>
            </figure>
            <figure class="sample-card">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&amp;fit=crop&amp;w=900&amp;q=80" alt="Mẫu danh mục sản phẩm" loading="lazy" />
              <figcaption><strong>Catalog</strong><span>Danh mục sản phẩm</span></figcaption>
            </figure>
            <figure class="sample-card">
              <img src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&amp;fit=crop&amp;w=900&amp;q=80" alt="Mẫu thanh toán online" loading="lazy" />
              <figcaption><strong>Checkout</strong><span>Giỏ hàng &amp; thanh toán</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="cta-box">
            <h2>Sẵn sàng mở kênh bán hàng online?</h2>
            <p>Cho chúng tôi biết ngành hàng và quy mô sản phẩm — nhận đề xuất cấu trúc shop phù hợp.</p>
            <a href="index.html#contact" class="btn btn-primary">Trao đổi dự án →</a>
          </div>
        </div>
      </section>
    </main>
`,
});

makePage({
  file: "saas.html",
  title: "Thiết kế Website Startup / SaaS | WebStudio",
  description:
    "Thiết kế website và web app Startup/SaaS: dashboard, đăng nhập, tài khoản, subscription và tính năng tùy chỉnh.",
  navReplace: [
    [
      '<li><a href="product.html">Website Startup / SaaS</a></li>',
      '<li><a href="saas.html">Website Startup / SaaS</a></li>',
    ],
  ],
  mainHtml: `<main>
      <section class="page-hero">
        <div class="container">
          <div class="section-label">Startup / SaaS</div>
          <h1>Website &amp; Web App cho Startup.</h1>
          <p>
            Landing sản phẩm, dashboard, đăng nhập và subscription — xây nền tảng
            rõ ràng để onboard người dùng và mở rộng tính năng.
          </p>
          <div class="hero-actions" style="margin-top:24px">
            <a class="btn btn-primary" href="index.html#contact">Nhận tư vấn SaaS</a>
            <a class="btn btn-secondary" href="cart.html">Thêm vào giỏ yêu cầu</a>
          </div>
        </div>
      </section>

      <section class="page-content">
        <div class="container content-grid">
          <article class="product-panel">
            <h2>Gói Startup / SaaS gồm gì?</h2>
            <ul class="price-features">
              <li>Website giới thiệu sản phẩm / waitlist</li>
              <li>Đăng nhập &amp; tài khoản người dùng</li>
              <li>Dashboard quản trị cơ bản</li>
              <li>Luồng subscription / gói dịch vụ</li>
              <li>Kiến trúc dễ mở rộng tính năng</li>
            </ul>
            <div class="price-inline">Liên hệ báo giá</div>
            <div class="hero-actions">
              <a class="btn btn-primary" href="index.html#contact">Đặt lịch tư vấn</a>
              <a class="btn btn-secondary" href="#mau-saas">Xem ảnh mẫu</a>
            </div>
          </article>
          <div class="stack">
            <article class="list-card">
              <h3>Phù hợp khi nào?</h3>
              <p>
                Startup cần MVP web, SaaS cần mặt tiền + khu vực đăng nhập,
                hoặc sản phẩm số cần onboarding người dùng rõ ràng.
              </p>
              <div class="meta-row">
                <span class="chip">MVP</span>
                <span class="chip">Dashboard</span>
                <span class="chip">Subscription</span>
              </div>
            </article>
            <article class="list-card">
              <h3>Hướng triển khai</h3>
              <p>
                Ưu tiên luồng cốt lõi trước (đăng ký → dùng thử → trả phí),
                sau đó mở rộng module theo roadmap sản phẩm.
              </p>
            </article>
            <article class="list-card">
              <h3>Thời gian dự kiến</h3>
              <p>MVP thường 4–8 tuần tùy phạm vi tính năng và tích hợp API.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="section sample-section" id="mau-saas">
        <div class="container">
          <div class="section-label">Ảnh mẫu</div>
          <h2 class="section-title">Phong cách Startup / SaaS tham khảo</h2>
          <p class="section-description">
            Hình ảnh minh họa dashboard và landing sản phẩm — giao diện thực tế
            sẽ theo branding và luồng người dùng của bạn.
          </p>
          <div class="sample-grid">
            <figure class="sample-card sample-card--wide">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&amp;fit=crop&amp;w=1400&amp;q=80" alt="Mẫu dashboard SaaS" loading="lazy" />
              <figcaption><strong>Product Dashboard</strong><span>Bảng điều khiển người dùng</span></figcaption>
            </figure>
            <figure class="sample-card">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&amp;fit=crop&amp;w=900&amp;q=80" alt="Mẫu analytics SaaS" loading="lazy" />
              <figcaption><strong>Analytics</strong><span>Theo dõi tăng trưởng</span></figcaption>
            </figure>
            <figure class="sample-card">
              <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&amp;fit=crop&amp;w=900&amp;q=80" alt="Mẫu team startup" loading="lazy" />
              <figcaption><strong>Launch Site</strong><span>Landing giới thiệu sản phẩm</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="cta-box">
            <h2>Sẵn sàng dựng nền tảng Startup / SaaS?</h2>
            <p>Mô tả sản phẩm và người dùng mục tiêu — nhận đề xuất phạm vi MVP rõ ràng.</p>
            <a href="index.html#contact" class="btn btn-primary">Trao đổi dự án →</a>
          </div>
        </div>
      </section>
    </main>
`,
});

// Update links across HTML
const files = fs.readdirSync(root).filter((f) => f.endsWith(".html"));
for (const file of files) {
  const full = path.join(root, file);
  let html = fs.readFileSync(full, "utf8");
  html = html
    .replaceAll(
      '<li><a href="product.html">Web bán hàng / E-commerce</a></li>',
      '<li><a href="ecommerce.html">Web bán hàng / E-commerce</a></li>'
    )
    .replaceAll(
      '<li><a href="product.html">Website Startup / SaaS</a></li>',
      '<li><a href="saas.html">Website Startup / SaaS</a></li>'
    )
    .replaceAll(
      '<li><a href="product.html">Web bán hàng / E-commerce</a></li>',
      '<li><a href="ecommerce.html">Web bán hàng / E-commerce</a></li>'
    );
  // footer variants
  html = html
    .replaceAll(
      '<li><a href="product.html">Website Startup / SaaS</a></li>',
      '<li><a href="saas.html">Website Startup / SaaS</a></li>'
    )
    .replaceAll(
      '<li><a href="product.html">Web bán hàng / E-commerce</a></li>',
      '<li><a href="ecommerce.html">Web bán hàng / E-commerce</a></li>'
    );
  fs.writeFileSync(full, html, "utf8");
}

// index service cards
let index = fs.readFileSync(path.join(root, "index.html"), "utf8");
index = index
  .replace(
    `<article class="service-card">
              <div class="service-number">03</div>
              <div class="service-icon">🛒</div>
              <h3>Web bán hàng / E-commerce</h3>
              <p>
                Website bán hàng hoàn chỉnh với danh mục sản phẩm, giỏ hàng,
                đặt hàng, quản lý đơn và tích hợp các phương thức thanh toán.
              </p>
              <div class="service-arrow">↗</div>
            </article>`,
    `<a class="service-card" href="ecommerce.html">
              <div class="service-number">03</div>
              <div class="service-icon">🛒</div>
              <h3>Web bán hàng / E-commerce</h3>
              <p>
                Website bán hàng hoàn chỉnh với danh mục sản phẩm, giỏ hàng,
                đặt hàng, quản lý đơn và tích hợp các phương thức thanh toán.
              </p>
              <div class="service-arrow">↗</div>
            </a>`
  )
  .replace(
    `<article class="service-card">
              <div class="service-number">04</div>
              <div class="service-icon">🚀</div>
              <h3>Website Startup / SaaS</h3>
              <p>
                Website và Web App dành cho Startup với Dashboard, đăng nhập,
                tài khoản người dùng, subscription và các tính năng tùy chỉnh.
              </p>
              <div class="service-arrow">↗</div>
            </article>`,
    `<a class="service-card" href="saas.html">
              <div class="service-number">04</div>
              <div class="service-icon">🚀</div>
              <h3>Website Startup / SaaS</h3>
              <p>
                Website và Web App dành cho Startup với Dashboard, đăng nhập,
                tài khoản người dùng, subscription và các tính năng tùy chỉnh.
              </p>
              <div class="service-arrow">↗</div>
            </a>`
  );
fs.writeFileSync(path.join(root, "index.html"), index, "utf8");

// main.js search links
let mainJs = fs.readFileSync(path.join(root, "main.js"), "utf8");
mainJs = mainJs
  .replace(
    /title: "Thiết kế Website Startup \/ SaaS",\s*href: "[^"]+",/,
    'title: "Thiết kế Website Startup / SaaS",\n    href: "saas.html",'
  )
  .replace(
    /title: "Thiết kế Web bán hàng \/ E-commerce",\s*href: "[^"]+",/,
    'title: "Thiết kế Web bán hàng / E-commerce",\n    href: "ecommerce.html",'
  );
fs.writeFileSync(path.join(root, "main.js"), mainJs, "utf8");

console.log("Done");
