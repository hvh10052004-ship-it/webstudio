import Image from "next/image";
import Link from "next/link";
import { OrderForm } from "@/components/sales/OrderForm";
import { SalesHeader } from "@/components/sales/SalesHeader";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80";
const GALLERY_MAIN =
  "https://images.unsplash.com/photo-1570172619604-71fdc3087b5d?auto=format&fit=crop&w=1400&q=80";
const GALLERY_A =
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80";
const GALLERY_B =
  "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=80";

export default function SalesLandingPage() {
  return (
    <div className="sales-lp" id="top">
      <SalesHeader />

      <main>
        <section className="sales-hero">
          <div className="sales-wrap sales-hero-grid">
            <div>
              <div className="sales-kicker">Ưu đãi đến 31/08/2026</div>
              <h1>Da hết mụn, sáng mịn 14 ngày — cho da dầu, không kích ứng.</h1>
              <p className="sales-hero-lead">
                AURA Glow Essence là tinh chất dưỡng đêm 30ml: niacinamide 5% +
                peptide. Thấm nhanh, không bết, dùng được cho da nhạy cảm.
              </p>
              <div className="sales-price-row">
                <div className="sales-price">449.000đ</div>
                <div className="sales-price-old">890.000đ</div>
              </div>
              <p className="sales-save">Tiết kiệm 441.000đ · Freeship COD toàn quốc</p>
              <div className="sales-actions">
                <a className="sales-btn sales-btn-primary" href="#dat-hang">
                  Mua ngay
                </a>
                <a className="sales-btn sales-btn-ghost" href="#danh-gia">
                  Xem 2.400+ đánh giá
                </a>
              </div>
              <div className="sales-trust">
                <div>
                  <strong>12.800+</strong>
                  <span>Đơn đã giao</span>
                </div>
                <div>
                  <strong>4.8/5</strong>
                  <span>Từ 2.416 review</span>
                </div>
                <div>
                  <strong>7 ngày</strong>
                  <span>Đổi trả nếu không hợp</span>
                </div>
              </div>
            </div>

            <div className="sales-hero-visual">
              <div className="sales-hero-frame">
                <Image
                  src={HERO_IMAGE}
                  alt="Chai AURA Glow Essence trên nền vải be"
                  fill
                  sizes="(max-width: 900px) 100vw, 520px"
                  preload
                  style={{ objectFit: "cover" }}
                />
                <div className="sales-hero-chip">30ml · Dùng 4–6 tuần</div>
              </div>
            </div>
          </div>
        </section>

        <div className="sales-bar">
          <div className="sales-wrap sales-bar-row">
            <div>COD — trả khi nhận</div>
            <div>Freeship toàn quốc</div>
            <div>Đổi trả 7 ngày</div>
            <div>Hàng chính hãng AURA</div>
          </div>
        </div>

        <section className="sales-section">
          <div className="sales-wrap">
            <h2>Da dầu mụn không cần thêm 7 bước skincare.</h2>
            <p className="sales-section-lead">
              Ban đêm da đang tự phục hồi. Một tinh chất đúng thành phần giúp
              giảm mụn ẩn, lỗ chân lông và xỉn màu — không cần chồng lớp.
            </p>
            <div className="sales-pain-grid">
              <article className="sales-card">
                <div className="sales-num">01</div>
                <h3>Mụn ẩn, da sần</h3>
                <p>
                  Rửa mặt xong vẫn nổi hạt dưới da. Makeup càng làm lỗ chân lông
                  to hơn.
                </p>
              </article>
              <article className="sales-card">
                <div className="sales-num">02</div>
                <h3>Serum bết, bí da</h3>
                <p>
                  Nhiều tinh chất đặc, thơm nồng. Da dầu ban đêm càng bóng và dễ
                  viêm.
                </p>
              </article>
              <article className="sales-card">
                <div className="sales-num">03</div>
                <h3>Sợ kích ứng</h3>
                <p>
                  Đã thử acid mạnh rồi rát, bong da. Cần công thức dịu nhưng vẫn
                  thấy kết quả.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="sales-section" id="loi-ich">
          <div className="sales-wrap">
            <h2>Một lớp đêm. Da sáng hơn khi thức dậy.</h2>
            <p className="sales-section-lead">
              Thoa 3–4 giọt sau toner, trước kem. Không cần đợi khô lâu, không
              trôi gối.
            </p>
            <div className="sales-benefit-grid">
              <article className="sales-card">
                <h3>Giảm mụn ẩn</h3>
                <p>Niacinamide 5% giúp thông thoáng, mờ vết thâm sau mụn.</p>
              </article>
              <article className="sales-card">
                <h3>Thấm trong 20 giây</h3>
                <p>Kết cấu nước-gel. Da dầu dùng được cả mùa hè.</p>
              </article>
              <article className="sales-card">
                <h3>Không cồn, không hương</h3>
                <p>Phù hợp da nhạy cảm. Không gây khô căng sáng hôm sau.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="sales-section">
          <div className="sales-wrap">
            <h2>Ảnh thật sản phẩm</h2>
            <p className="sales-section-lead">
              Chai thủy tinh tối màu, ống nhỏ giọt. Dễ mang đi, không lộ khi
              để bàn.
            </p>
            <div className="sales-gallery">
              <div className="sales-gallery-main">
                <Image
                  src={GALLERY_MAIN}
                  alt="Kết cấu tinh chất AURA Glow"
                  fill
                  sizes="(max-width: 900px) 100vw, 60vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="sales-gallery-side">
                <div className="sales-gallery-tile">
                  <Image
                    src={GALLERY_A}
                    alt="Sản phẩm dưỡng da AURA trên bàn"
                    fill
                    sizes="(max-width: 900px) 100vw, 40vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="sales-gallery-tile">
                  <Image
                    src={GALLERY_B}
                    alt="Tinh chất nhỏ giọt trên tay"
                    fill
                    sizes="(max-width: 900px) 100vw, 40vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sales-section" id="danh-gia">
          <div className="sales-wrap">
            <h2>Khách dùng 14 đêm nói gì.</h2>
            <p className="sales-section-lead">
              4.8/5 từ 2.416 đánh giá. Đây là phản hồi mẫu trên landing demo.
            </p>
            <div className="sales-review-grid">
              <article className="sales-card">
                <div className="sales-stars">★★★★★</div>
                <p>
                  Da dầu buổi sáng đỡ bóng hẳn. Mụn ẩn hai má giảm sau tuần thứ
                  hai. Không hôi, không rát.
                </p>
                <div className="sales-reviewer">
                  Lan Anh
                  <span>Quận 7, TP.HCM · Da dầu mụn</span>
                </div>
              </article>
              <article className="sales-card">
                <div className="sales-stars">★★★★★</div>
                <p>
                  Từng sợ niacinamide. Chai này thấm nhanh, makeup hôm sau mịn
                  hơn. Đã mua combo 3.
                </p>
                <div className="sales-reviewer">
                  Minh Thư
                  <span>Cầu Giấy, Hà Nội · Da hỗn hợp</span>
                </div>
              </article>
              <article className="sales-card">
                <div className="sales-stars">★★★★☆</div>
                <p>
                  Thâm cũ chưa hết hẳn nhưng lỗ chân lông nhỏ hơn. Ship 2 ngày,
                  đóng gói kỹ.
                </p>
                <div className="sales-reviewer">
                  Hữu Phước
                  <span>Hải Châu, Đà Nẵng · Da nhạy cảm</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="sales-section" id="offer">
          <div className="sales-wrap">
            <div className="sales-offer">
              <h2>Chọn deal, không chỉ mua 1 hộp.</h2>
              <p className="sales-section-lead">
                Giá niêm yết 890.000đ. Ưu đãi áp dụng đến 23:59 ngày 31/08/2026.
                Freeship mọi gói.
              </p>
              <div className="sales-offer-grid">
                <article className="sales-offer-card">
                  <h3>1 hộp dùng thử</h3>
                  <div className="amount">449.000đ</div>
                  <ul>
                    <li>1 chai 30ml</li>
                    <li>Đủ 4–6 tuần</li>
                    <li>Đổi trả 7 ngày</li>
                  </ul>
                  <a className="sales-btn sales-btn-ghost" href="#dat-hang">
                    Chọn gói này
                  </a>
                </article>
                <article className="sales-offer-card featured">
                  <div className="sales-tag">Bán chạy</div>
                  <h3>Combo 3 — mua 2 tặng 1</h3>
                  <div className="amount">898.000đ</div>
                  <ul>
                    <li>3 chai 30ml</li>
                    <li>Tiết kiệm 1.172.000đ</li>
                    <li>Kèm guide dưỡng đêm PDF</li>
                  </ul>
                  <a className="sales-btn sales-btn-primary" href="#dat-hang">
                    Lấy combo
                  </a>
                </article>
                <article className="sales-offer-card">
                  <h3>2 hộp tiết kiệm</h3>
                  <div className="amount">799.000đ</div>
                  <ul>
                    <li>2 chai 30ml</li>
                    <li>Giảm thêm 99.000đ</li>
                    <li>Freeship COD</li>
                  </ul>
                  <a className="sales-btn sales-btn-ghost" href="#dat-hang">
                    Chọn gói này
                  </a>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="sales-section">
          <div className="sales-wrap">
            <h2>Khác serum giá rẻ chỗ nào?</h2>
            <p className="sales-section-lead">
              Không bôi nhọ đối thủ — chỉ so với serum hương liệu phổ thông trên
              thị trường.
            </p>
            <table className="sales-compare">
              <thead>
                <tr>
                  <th>Tiêu chí</th>
                  <th>AURA Glow</th>
                  <th>Serum thường</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Thành phần chính</td>
                  <td>Niacinamide 5% + peptide</td>
                  <td>Nước, hương, silicone</td>
                </tr>
                <tr>
                  <td>Kết cấu</td>
                  <td>Nước-gel, thấm 20 giây</td>
                  <td>Đặc, dễ bết gối</td>
                </tr>
                <tr>
                  <td>Da nhạy cảm</td>
                  <td>Không cồn, không hương</td>
                  <td>Dễ rát, đỏ</td>
                </tr>
                <tr>
                  <td>Đổi trả</td>
                  <td>7 ngày, giữ bill</td>
                  <td>Thường không nhận</td>
                </tr>
                <tr>
                  <td>Giao hàng</td>
                  <td>Freeship COD</td>
                  <td>Phí ship ẩn</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="sales-section" id="faq">
          <div className="sales-wrap sales-faq">
            <h2>Câu hỏi trước khi đặt.</h2>
            <p className="sales-section-lead">
              Trả lời đúng lý do hay làm khách ngần ngại bấm mua.
            </p>
            <details>
              <summary>Ship bao lâu? Có COD không?</summary>
              <p>
                Nội thành 1–2 ngày, tỉnh 2–4 ngày. COD toàn quốc, kiểm tra hàng
                trước khi thanh toán.
              </p>
            </details>
            <details>
              <summary>Da nhạy cảm dùng được không?</summary>
              <p>
                Công thức không cồn, không hương. Nên patch test 24 giờ ở hàm
                dưới nếu da đang viêm nặng.
              </p>
            </details>
            <details>
              <summary>Dùng bao lâu hết 1 chai?</summary>
              <p>3–4 giọt/đêm, khoảng 4–6 tuần. Combo 3 đủ liệu trình 3 tháng.</p>
            </details>
            <details>
              <summary>Đổi trả thế nào?</summary>
              <p>
                Không hợp da trong 7 ngày, còn trên 80% dung tích, gửi lại để
                hoàn tiền. Phí ship hoàn bên AURA chịu nếu lỗi hàng.
              </p>
            </details>
            <details>
              <summary>Có hóa đơn không?</summary>
              <p>Có hóa đơn VAT khi ghi MST vào ghi chú lúc đặt hàng.</p>
            </details>
          </div>
        </section>

        <section className="sales-section" id="dat-hang">
          <div className="sales-wrap sales-order-grid">
            <div>
              <h2>Đặt hàng — không cần tạo tài khoản.</h2>
              <p className="sales-section-lead">
                Điền tên, SĐT và địa chỉ. Nhân viên gọi xác nhận, giao COD.
              </p>
              <div className="sales-guarantee">
                <article className="sales-card">
                  <h3>Cam kết 7 ngày</h3>
                  <p>Không hợp da, đổi hoặc hoàn. Không giữ khách bằng lý do kỹ thuật.</p>
                </article>
                <article className="sales-card">
                  <h3>Giá trên trang là giá chốt</h3>
                  <p>Không phụ thu khi giao. Freeship mọi tỉnh thành.</p>
                </article>
              </div>
            </div>
            <OrderForm />
          </div>
        </section>
      </main>

      <footer className="sales-footer">
        <div className="sales-wrap sales-footer-row">
          <p>© 2026 AURA Glow · MST 0123456789 · Chính sách đổi trả 7 ngày</p>
          <p>
            Landing mẫu do{" "}
            <Link href="/">WebStudio</Link> thiết kế ·{" "}
            <a href="tel:0900000000">0900 000 000</a>
          </p>
        </div>
      </footer>

      <div className="sales-sticky">
        <div>
          <strong>449.000đ</strong>
          <span>890.000đ</span>
        </div>
        <a className="sales-btn sales-btn-primary" href="#dat-hang">
          Mua ngay
        </a>
      </div>
    </div>
  );
}
