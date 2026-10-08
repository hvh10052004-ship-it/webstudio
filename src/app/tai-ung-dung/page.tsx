import Link from "next/link";
import { ContactFloat } from "@/components/ContactFloat";
import { DownloadAppCta } from "@/components/DownloadAppCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function TaiUngDungPage() {
  return (
    <div id="top">
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="container">
            <div className="section-label">App khách</div>
            <h1>Tải App khách Studio về điện thoại.</h1>
            <p>
              Soạn website, xem trước, chat hỗ trợ và chạy thử như một ứng dụng
              thật — dành cho khách hàng WebStudio trên Android.
            </p>
          </div>
        </section>

        <section className="page-content">
          <div className="container content-grid">
            <article className="content-card">
              <h2>App khách WebStudio</h2>
              <p>
                Cài APK trên Android để mở Studio ngay trên điện thoại: chọn loại
                website, điền nội dung, xem bản xem trước và trao đổi với đội ngũ
                hỗ trợ.
              </p>
              <div className="meta-row">
                <span className="chip">Android</span>
                <span className="chip">APK</span>
                <span className="chip">Soạn website</span>
                <span className="chip">Xem trước</span>
              </div>
              <DownloadAppCta />
              <p className="app-dl-hint">
                Sau khi tải, mở <b>WebStudio.apk</b>, cho phép cài từ nguồn này,
                rồi bấm Cài đặt. Trên máy tính hãy mở trang này từ điện thoại
                cùng mạng (npm run dev:lan).
              </p>
            </article>

            <div className="app-phone" aria-hidden>
              <div className="app-phone-notch" />
              <div className="app-phone-screen">
                <p className="app-phone-kicker">WebStudio</p>
                <h3>Tạo website của bạn</h3>
                <p>Chọn loại site — soạn trên điện thoại</p>
                <div className="app-phone-tiles">
                  <span>Landing</span>
                  <span>Công ty</span>
                  <span>Bán hàng</span>
                  <span>SaaS</span>
                </div>
                <div className="app-phone-cta">Bắt đầu soạn</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section about-section">
          <div className="container">
            <div className="section-label">Tính năng</div>
            <h2 className="section-title">Studio trên điện thoại làm được gì.</h2>
            <div className="about-values">
              <article className="list-card">
                <h3>Soạn nội dung</h3>
                <p>
                  Chọn mẫu, điền thông tin doanh nghiệp, dịch vụ và liên hệ ngay
                  trên điện thoại.
                </p>
              </article>
              <article className="list-card">
                <h3>Xem trước</h3>
                <p>
                  Xem website đang dựng như khách thật, chỉnh từng khối rồi lưu.
                </p>
              </article>
              <article className="list-card">
                <h3>Chat hỗ trợ</h3>
                <p>
                  Nhắn với WebStudio khi cần chỉnh sửa, báo giá hoặc bàn giao.
                </p>
              </article>
              <article className="list-card">
                <h3>Chạy như app</h3>
                <p>
                  Giao diện full-screen, không thanh địa chỉ — trải nghiệm như
                  ứng dụng cài sẵn.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section about-section">
          <div className="container">
            <div className="section-label">Cài đặt</div>
            <h2 className="section-title">Ba bước để mở App khách Studio.</h2>
            <div className="app-dl-steps">
              <article className="list-card">
                <h3>1. Tải APK</h3>
                <p>Bấm Tải App khách Studio và chờ tệp WebStudio.apk về máy.</p>
              </article>
              <article className="list-card">
                <h3>2. Cho phép cài</h3>
                <p>
                  Mở tệp, cho phép cài đặt từ trình duyệt hoặc Files nếu hệ
                  thống hỏi.
                </p>
              </article>
              <article className="list-card">
                <h3>3. Mở Studio</h3>
                <p>
                  Cài xong, mở icon WebStudio trên màn hình chính để bắt đầu
                  soạn.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section about-section">
          <div className="container">
            <div className="cta-box">
              <h2>Sẵn sàng soạn website trên điện thoại?</h2>
              <p>
                Tải App khách Studio, hoặc mở bản web nếu bạn đang dùng máy tính.
              </p>
              <div className="hero-actions" style={{ justifyContent: "center" }}>
                <DownloadAppCta />
                <Link href="/app-khach" className="btn btn-secondary">
                  Mở Studio trên web
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <ContactFloat />
    </div>
  );
}
