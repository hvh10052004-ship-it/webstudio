import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <div id="top">
      <SiteHeader />

      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-grid">
              <div>
                <div className="badge">
                  <span className="badge-dot" />
                  Nhận dự án thiết kế Website
                </div>
                <h1>
                  Website đẹp.
                  <br />
                  <span className="gradient-text">Chuyển đổi tốt.</span>
                </h1>
                <p className="hero-description">
                  Chúng tôi thiết kế và phát triển website hiện đại dành cho
                  doanh nghiệp, thương hiệu, cửa hàng và startup. Tối ưu giao
                  diện, tốc độ, SEO và trải nghiệm người dùng.
                </p>
                <div className="hero-actions">
                  <a href="#contact" className="btn btn-primary">
                    Bắt đầu dự án →
                  </a>
                  <a href="/tai-ung-dung" className="btn btn-secondary">
                    Tải ứng dụng khách
                  </a>
                </div>
                <div className="hero-info">
                  <div className="hero-stat">
                    <strong>50+</strong>
                    <span>Dự án</span>
                  </div>
                  <div className="hero-stat">
                    <strong>30+</strong>
                    <span>Khách hàng</span>
                  </div>
                  <div className="hero-stat">
                    <strong>4</strong>
                    <span>Loại Website</span>
                  </div>
                </div>
              </div>

              <div className="hero-preview">
                <div className="browser-card">
                  <div className="browser">
                    <div className="browser-top">
                      <span className="circle" />
                      <span className="circle" />
                      <span className="circle" />
                    </div>
                    <div className="browser-content">
                      <div className="mini-nav">
                        <div className="mini-logo" />
                        <div className="mini-links">
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                      <div className="mock-tag" />
                      <div className="mock-title" />
                      <div className="mock-title short" />
                      <div className="mock-text">
                        <div />
                        <div />
                        <div />
                      </div>
                      <div className="mock-buttons">
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section">
          <div className="container">
            <div className="section-label">Dịch vụ</div>
            <h2 className="section-title">
              Thiết kế website cho mọi nhu cầu kinh doanh.
            </h2>
            <p className="section-description">
              Từ Landing Page đơn giản đến hệ thống SaaS, chúng tôi xây dựng
              website phù hợp với mục tiêu và mô hình kinh doanh của bạn.
            </p>
            <div className="services-grid">
              <article className="service-card">
                <div className="service-number">01</div>
                <div className="service-icon">⚡</div>
                <h3>Landing Page</h3>
                <p>
                  Landing Page tập trung vào chuyển đổi, phù hợp cho chạy quảng
                  cáo, giới thiệu sản phẩm, sự kiện hoặc thu thập khách hàng tiềm
                  năng.
                </p>
                <div className="service-arrow">↗</div>
              </article>
              <article className="service-card">
                <div className="service-number">02</div>
                <div className="service-icon">🏢</div>
                <h3>Website công ty</h3>
                <p>
                  Website chuyên nghiệp giúp giới thiệu doanh nghiệp, dịch vụ,
                  đội ngũ, dự án và xây dựng uy tín thương hiệu trên Internet.
                </p>
                <div className="service-arrow">↗</div>
              </article>
              <article className="service-card">
                <div className="service-number">03</div>
                <div className="service-icon">🛒</div>
                <h3>Web bán hàng / E-commerce</h3>
                <p>
                  Website bán hàng hoàn chỉnh với danh mục sản phẩm, giỏ hàng,
                  đặt hàng, quản lý đơn và tích hợp các phương thức thanh toán.
                </p>
                <div className="service-arrow">↗</div>
              </article>
              <article className="service-card">
                <div className="service-number">04</div>
                <div className="service-icon">🚀</div>
                <h3>Website Startup / SaaS</h3>
                <p>
                  Website và Web App dành cho Startup với Dashboard, đăng nhập,
                  tài khoản người dùng, subscription và các tính năng tùy chỉnh.
                </p>
                <div className="service-arrow">↗</div>
              </article>
              <Link href="/tai-ung-dung" className="service-card">
                <div className="service-number">05</div>
                <div className="service-icon">📲</div>
                <h3>Tải ứng dụng khách</h3>
                <p>
                  Tải app khách WebStudio về điện thoại để tự soạn website,
                  xem trước, chat hỗ trợ và chạy thử như một ứng dụng thật.
                </p>
                <div className="service-arrow">↗</div>
              </Link>
              <Link href="/tai-ung-dung-admin" className="service-card">
                <div className="service-number">06</div>
                <div className="service-icon">🛡️</div>
                <h3>Tải app admin</h3>
                <p>
                  Tải ứng dụng quản trị WebStudio về Android. Cài cạnh app khách,
                  mở thẳng trang admin trên điện thoại.
                </p>
                <div className="service-arrow">↗</div>
              </Link>
            </div>
          </div>
        </section>

        <section className="features section">
          <div className="container">
            <div className="section-label">Chất lượng</div>
            <h2 className="section-title">
              Không chỉ đẹp. Website phải hoạt động hiệu quả.
            </h2>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">✦</div>
                <h3>UI/UX hiện đại</h3>
                <p>
                  Thiết kế giao diện rõ ràng, trực quan và phù hợp thương hiệu.
                </p>
              </div>
              <div className="feature">
                <div className="feature-icon">⚡</div>
                <h3>Tốc độ cao</h3>
                <p>Tối ưu mã nguồn, hình ảnh và hiệu suất tải trang.</p>
              </div>
              <div className="feature">
                <div className="feature-icon">📱</div>
                <h3>Responsive</h3>
                <p>Hiển thị đẹp trên máy tính, tablet và điện thoại.</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🔎</div>
                <h3>SEO Friendly</h3>
                <p>Cấu trúc website thân thiện với công cụ tìm kiếm.</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🔐</div>
                <h3>Bảo mật</h3>
                <p>Áp dụng các tiêu chuẩn bảo mật website hiện đại.</p>
              </div>
              <div className="feature">
                <div className="feature-icon">⚙</div>
                <h3>Dễ mở rộng</h3>
                <p>
                  Kiến trúc rõ ràng giúp thêm tính năng khi doanh nghiệp phát
                  triển.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="portfolio" className="section">
          <div className="container">
            <div className="section-label">Portfolio</div>
            <h2 className="section-title">
              Một số phong cách website chúng tôi có thể xây dựng.
            </h2>
            <div className="portfolio-grid">
              <div className="portfolio-item">
                <div className="portfolio-bg">
                  <span className="portfolio-badge">Startup / SaaS</span>
                  <div className="portfolio-name">
                    <h3>Nova Analytics</h3>
                    <p>SaaS Dashboard Platform</p>
                  </div>
                </div>
              </div>
              <div className="portfolio-item">
                <div className="portfolio-bg">
                  <span className="portfolio-badge">E-commerce</span>
                  <div className="portfolio-name">
                    <h3>Green Store</h3>
                    <p>Online Shopping</p>
                  </div>
                </div>
              </div>
              <Link className="portfolio-item" href="/ban-hang">
                <div className="portfolio-bg">
                  <span className="portfolio-badge">Landing Page</span>
                  <div className="portfolio-name">
                    <h3>Aura Studio</h3>
                    <p>Landing bán hàng — xem trang</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section id="process" className="section">
          <div className="container">
            <div className="section-label">Quy trình</div>
            <h2 className="section-title">
              Từ ý tưởng đến website hoàn chỉnh.
            </h2>
            <div className="process-grid">
              <article className="process-card">
                <div className="process-number">01</div>
                <h3>Trao đổi</h3>
                <p>
                  Tìm hiểu nhu cầu, khách hàng, sản phẩm và mục tiêu dự án.
                </p>
              </article>
              <article className="process-card">
                <div className="process-number">02</div>
                <h3>UI/UX Design</h3>
                <p>Thiết kế bố cục, giao diện và trải nghiệm người dùng.</p>
              </article>
              <article className="process-card">
                <div className="process-number">03</div>
                <h3>Development</h3>
                <p>
                  Lập trình website, responsive và các tính năng cần thiết.
                </p>
              </article>
              <article className="process-card">
                <div className="process-number">04</div>
                <h3>Launch</h3>
                <p>Kiểm thử, tối ưu và đưa website lên Internet.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="pricing" className="section">
          <div className="container">
            <div className="section-label">Bảng giá</div>
            <h2 className="section-title">
              Gói thiết kế phù hợp với từng giai đoạn.
            </h2>
            <div className="price-grid">
              <div className="price-card">
                <h3>Landing</h3>
                <p className="price-desc">
                  Phù hợp quảng cáo và giới thiệu sản phẩm.
                </p>
                <div className="price">3.900.000đ</div>
                <ul className="price-features">
                  <li>01 Landing Page</li>
                  <li>Responsive Mobile</li>
                  <li>Form liên hệ</li>
                  <li>Tối ưu tốc độ</li>
                  <li>SEO cơ bản</li>
                </ul>
                <a className="btn btn-secondary" href="#contact">
                  Chọn gói
                </a>
              </div>
              <div className="price-card popular">
                <span className="popular-label">PHỔ BIẾN</span>
                <h3>Business</h3>
                <p className="price-desc">
                  Website chuyên nghiệp dành cho doanh nghiệp.
                </p>
                <div className="price">8.900.000đ</div>
                <ul className="price-features">
                  <li>5–10 trang</li>
                  <li>Thiết kế UI riêng</li>
                  <li>Responsive</li>
                  <li>CMS quản trị</li>
                  <li>SEO cơ bản</li>
                  <li>Google Analytics</li>
                </ul>
                <a className="btn btn-primary" href="#contact">
                  Chọn gói
                </a>
              </div>
              <div className="price-card">
                <h3>E-commerce / SaaS</h3>
                <p className="price-desc">
                  Dành cho website bán hàng hoặc nền tảng Startup.
                </p>
                <div className="price">Liên hệ</div>
                <ul className="price-features">
                  <li>Thiết kế riêng</li>
                  <li>Database</li>
                  <li>Đăng nhập người dùng</li>
                  <li>Dashboard</li>
                  <li>Thanh toán</li>
                  <li>API Integration</li>
                </ul>
                <a className="btn btn-secondary" href="#contact">
                  Nhận báo giá
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="cta-box">
              <h2>Bạn đang có ý tưởng cho một website?</h2>
              <p>
                Hãy biến ý tưởng của bạn thành một website chuyên nghiệp, nhanh
                và có khả năng tạo ra khách hàng.
              </p>
              <a href="#contact" className="btn btn-primary">
                Trao đổi dự án →
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-info">
                <div className="section-label">Liên hệ</div>
                <h2>Hãy cùng tạo nên website của bạn.</h2>
                <p>
                  Gửi cho chúng tôi thông tin dự án. Chúng tôi sẽ tư vấn giải
                  pháp phù hợp.
                </p>
                <div className="contact-details">
                  <div className="contact-detail">
                    <span>Email</span>
                    <strong>hello@webstudio.vn</strong>
                  </div>
                  <div className="contact-detail">
                    <span>Điện thoại</span>
                    <strong>0900 000 000</strong>
                  </div>
                  <div className="contact-detail">
                    <span>Thời gian làm việc</span>
                    <strong>Thứ 2 – Thứ 7</strong>
                  </div>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <a className="logo" href="#top">
              Web<span>Studio.</span>
            </a>
            <p>© 2026 WebStudio. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">Facebook</a>
              <a href="#">Behance</a>
              <a href="#">Zalo</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
