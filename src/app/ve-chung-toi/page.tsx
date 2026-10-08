import type { Metadata } from "next";
import Link from "next/link";
import { ContactFloat } from "@/components/ContactFloat";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Về chúng tôi — WebStudio",
  description:
    "WebStudio thiết kế website hiện đại, tốc độ cao và nội dung rõ ràng để doanh nghiệp chuyển đổi khách hàng tốt hơn.",
};

export default function AboutPage() {
  return (
    <div id="top">
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="container">
            <div className="section-label">About</div>
            <h1>Chúng tôi xây website để tạo khách hàng.</h1>
            <p>
              WebStudio tập trung vào thiết kế hiện đại, tốc độ cao và nội dung
              rõ ràng giúp doanh nghiệp chuyển đổi tốt hơn.
            </p>
          </div>
        </section>

        <section className="page-content">
          <div className="container content-grid">
            <article className="content-card">
              <h2>Sứ mệnh</h2>
              <p>
                Mang đến website đẹp, nhanh và dễ dùng — phù hợp mục tiêu kinh
                doanh thực tế của từng khách hàng.
              </p>
              <div className="meta-row">
                <span className="chip">UI/UX</span>
                <span className="chip">Frontend</span>
                <span className="chip">SEO</span>
                <span className="chip">E-commerce</span>
              </div>
              <Link className="btn btn-primary" href="/#contact">
                Trao đổi dự án
              </Link>
            </article>
            <div className="stack">
              <article className="list-card">
                <h3>50+ dự án</h3>
                <p>
                  Landing page, website công ty, cửa hàng online và SaaS.
                </p>
              </article>
              <article className="list-card">
                <h3>Làm việc online</h3>
                <p>
                  Đồng hành toàn quốc, bàn giao rõ ràng theo từng giai đoạn.
                </p>
              </article>
              <article className="list-card">
                <h3>Hỗ trợ sau launch</h3>
                <p>
                  Chỉnh sửa, hướng dẫn sử dụng và tối ưu tiếp theo nhu cầu.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section about-section">
          <div className="container">
            <div className="section-label">Tầm nhìn</div>
            <h2 className="section-title">
              Website phải bán hàng, không chỉ để “có mặt trên mạng”.
            </h2>
            <p className="section-description">
              Chúng tôi làm website như một công cụ kinh doanh: thông điệp rõ,
              thao tác dễ, tải nhanh, đo được kết quả. Từ landing chạy ads đến
              website công ty hay cửa hàng online, mỗi trang đều hướng tới khách
              hàng thật và mục tiêu chuyển đổi.
            </p>
          </div>
        </section>

        <section className="section about-section">
          <div className="container">
            <div className="section-label">Giá trị</div>
            <h2 className="section-title">Cách WebStudio làm việc cùng bạn.</h2>
            <div className="about-values">
              <article className="list-card">
                <h3>Rõ ràng từ đầu</h3>
                <p>
                  Trao đổi mục tiêu, đối tượng và ngân sách trước khi thiết kế.
                  Bạn biết phạm vi, tiến độ và những gì sẽ nhận khi bàn giao.
                </p>
              </article>
              <article className="list-card">
                <h3>Thiết kế vì người dùng</h3>
                <p>
                  Bố cục, chữ, nút bấm và form được sắp xếp để khách hiểu ngay
                  và hành động — không trang trí cho vui.
                </p>
              </article>
              <article className="list-card">
                <h3>Kỹ thuật chắc</h3>
                <p>
                  Responsive, tốc độ, SEO cơ bản, bảo mật và cấu trúc dễ mở rộng
                  khi bạn thêm tính năng sau này.
                </p>
              </article>
              <article className="list-card">
                <h3>Đồng hành sau ra mắt</h3>
                <p>
                  Hướng dẫn sử dụng, chỉnh sửa theo phản hồi thực tế và hỗ trợ
                  khi bạn chạy chiến dịch.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section about-section">
          <div className="container">
            <div className="section-label">Chúng tôi làm gì</div>
            <h2 className="section-title">Bốn loại website chính.</h2>
            <div className="services-grid about-services">
              <article className="service-card">
                <div className="service-number">01</div>
                <h3>Landing Page</h3>
                <p>
                  Một trang, một mục tiêu: thu lead, đặt lịch hoặc bán sản phẩm.
                  Phù hợp chạy quảng cáo.
                </p>
              </article>
              <article className="service-card">
                <div className="service-number">02</div>
                <h3>Website công ty</h3>
                <p>
                  Giới thiệu doanh nghiệp, dịch vụ, đội ngũ và dự án — xây uy
                  tín thương hiệu trên Internet.
                </p>
              </article>
              <article className="service-card">
                <div className="service-number">03</div>
                <h3>Web bán hàng</h3>
                <p>
                  Danh mục, giỏ hàng, đặt hàng và thanh toán cho cửa hàng muốn
                  bán online rõ ràng.
                </p>
              </article>
              <article className="service-card">
                <div className="service-number">04</div>
                <h3>Startup / SaaS</h3>
                <p>
                  Website sản phẩm kèm đăng nhập, dashboard và luồng dùng thử
                  cho nền tảng số.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section about-section">
          <div className="container">
            <div className="cta-box">
              <h2>Sẵn sàng kể câu chuyện thương hiệu của bạn?</h2>
              <p>
                Gửi nhu cầu dự án. Chúng tôi sẽ đề xuất cấu trúc trang, phong
                cách và lộ trình phù hợp.
              </p>
              <Link href="/#contact" className="btn btn-primary">
                Tư vấn ngay →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <ContactFloat />
    </div>
  );
}
