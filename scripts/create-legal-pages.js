const fs = require("fs");
const path = require("path");
const root = "C:/Users/LAPTOP VINH HA/thiet-ke-website-chuyen-nghiep";

const shell = fs.readFileSync(path.join(root, "about.html"), "utf8");
const headEnd = shell.indexOf("<main>");
const footStart = shell.indexOf("</main>");
const headTpl = shell.slice(0, headEnd);
const footTpl = shell.slice(footStart);

function buildPage(title, description, label, h1, lead, sections) {
  let head = headTpl
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${description}" />`
    );

  const blocks = sections
    .map(
      (s) => `
            <article class="legal-block">
              <h2>${s.h2}</h2>
              ${s.paras.map((p) => `<p>${p}</p>`).join("\n              ")}
              ${
                s.list
                  ? `<ul>${s.list.map((i) => `<li>${i}</li>`).join("")}</ul>`
                  : ""
              }
            </article>`
    )
    .join("\n");

  const main = `<main>
      <section class="page-hero">
        <div class="container">
          <div class="section-label">${label}</div>
          <h1>${h1}</h1>
          <p>${lead}</p>
        </div>
      </section>
      <section class="page-content">
        <div class="container legal-content">
${blocks}
          <p class="legal-updated">Cập nhật lần cuối: 14/08/2026</p>
        </div>
      </section>
    `;

  return head + main + footTpl;
}

const privacySections = [
  {
    h2: "1. Giới thiệu",
    paras: [
      "WebStudio tôn trọng quyền riêng tư của khách hàng và người dùng website. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin khi bạn sử dụng website hoặc liên hệ nhận tư vấn dịch vụ thiết kế/lập trình web.",
    ],
  },
  {
    h2: "2. Thông tin chúng tôi thu thập",
    paras: [
      "Tùy theo cách bạn tương tác với chúng tôi, thông tin có thể bao gồm:",
    ],
    list: [
      "Họ tên, số điện thoại, email và nội dung yêu cầu tư vấn bạn gửi qua form liên hệ.",
      "Thông tin kỹ thuật cơ bản như loại trình duyệt, thiết bị, địa chỉ IP (ở mức tổng hợp) phục vụ vận hành và bảo mật website.",
      "Dữ liệu hành vi trên website (trang đã xem, nút đã bấm) nếu có gắn công cụ phân tích như Google Analytics.",
    ],
  },
  {
    h2: "3. Mục đích sử dụng thông tin",
    paras: ["Chúng tôi sử dụng thông tin để:"],
    list: [
      "Phản hồi yêu cầu tư vấn, báo giá và hỗ trợ dự án.",
      "Cải thiện chất lượng website, nội dung và trải nghiệm người dùng.",
      "Gửi thông tin liên quan đến dịch vụ khi bạn đồng ý nhận liên hệ.",
      "Đảm bảo an toàn, phòng chống gian lận hoặc truy cập trái phép.",
    ],
  },
  {
    h2: "4. Chia sẻ thông tin",
    paras: [
      "Chúng tôi không bán thông tin cá nhân của bạn. Thông tin chỉ có thể được chia sẻ với đối tác kỹ thuật cần thiết để vận hành dịch vụ (ví dụ: nhà cung cấp hosting, email) theo thỏa thuận bảo mật, hoặc khi pháp luật yêu cầu.",
    ],
  },
  {
    h2: "5. Lưu trữ và bảo mật",
    paras: [
      "Thông tin được lưu trong thời gian cần thiết cho mục đích tư vấn và thực hiện hợp đồng, hoặc theo quy định pháp luật. Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức hợp lý để hạn chế truy cập trái phép, mất mát hoặc tiết lộ dữ liệu.",
    ],
  },
  {
    h2: "6. Cookie và công cụ theo dõi",
    paras: [
      "Website có thể dùng cookie hoặc công cụ phân tích để hiểu cách người dùng sử dụng trang. Bạn có thể tắt cookie trong trình duyệt; một số tính năng website có thể bị ảnh hưởng.",
    ],
  },
  {
    h2: "7. Quyền của bạn",
    paras: [
      "Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân đã cung cấp (trừ trường hợp pháp luật yêu cầu lưu giữ). Liên hệ qua email info@webhd.vn hoặc số điện thoại 0938 002 776 để được hỗ trợ.",
    ],
  },
  {
    h2: "8. Thay đổi chính sách",
    paras: [
      "WebStudio có thể cập nhật Chính sách bảo mật theo thời gian. Phiên bản mới sẽ được đăng trên trang này kèm ngày cập nhật.",
    ],
  },
];

const termsSections = [
  {
    h2: "1. Chấp nhận điều khoản",
    paras: [
      "Khi truy cập website WebStudio hoặc sử dụng dịch vụ thiết kế/lập trình website của chúng tôi, bạn đồng ý với Điều khoản & điều kiện này. Nếu không đồng ý, vui lòng ngừng sử dụng website/dịch vụ.",
    ],
  },
  {
    h2: "2. Phạm vi dịch vụ",
    paras: [
      "WebStudio cung cấp dịch vụ thiết kế và phát triển website (Landing Page, website công ty, E-commerce, Startup/SaaS) theo thỏa thuận cụ thể với từng khách hàng. Phạm vi công việc, tiến độ và chi phí sẽ được xác nhận bằng báo giá/hợp đồng trước khi triển khai.",
    ],
  },
  {
    h2: "3. Trách nhiệm của khách hàng",
    paras: ["Khách hàng chịu trách nhiệm:"],
    list: [
      "Cung cấp thông tin, nội dung, hình ảnh và phản hồi đúng hạn để dự án tiến triển.",
      "Đảm bảo quyền sử dụng hợp pháp đối với nội dung, logo, hình ảnh cung cấp cho WebStudio.",
      "Thanh toán theo đúng thỏa thuận đã thống nhất.",
    ],
  },
  {
    h2: "4. Trách nhiệm của WebStudio",
    paras: [
      "Chúng tôi thực hiện công việc theo phạm vi đã thống nhất, bàn giao sản phẩm và hướng dẫn sử dụng cơ bản. Các hạng mục ngoài phạm vi (tính năng mới, chỉnh sửa lớn sau bàn giao) có thể phát sinh chi phí bổ sung.",
    ],
  },
  {
    h2: "5. Thanh toán và hoàn tiền",
    paras: [
      "Điều kiện thanh toán được nêu trong báo giá/hợp đồng từng dự án. Khoản tạm ứng thường không hoàn lại sau khi đã bắt đầu thiết kế/lập trình, trừ trường hợp hai bên thỏa thuận khác bằng văn bản.",
    ],
  },
  {
    h2: "6. Sở hữu trí tuệ",
    paras: [
      "Sau khi thanh toán đủ và bàn giao, quyền sử dụng sản phẩm website thuộc về khách hàng theo thỏa thuận. WebStudio được phép trưng bày dự án trong portfolio trừ khi khách hàng yêu cầu bảo mật bằng văn bản. Mã nguồn thư viện mã nguồn mở vẫn tuân theo giấy phép gốc của thư viện đó.",
    ],
  },
  {
    h2: "7. Giới hạn trách nhiệm",
    paras: [
      "WebStudio không chịu trách nhiệm cho thiệt hại gián tiếp phát sinh từ việc sử dụng website (mất dữ liệu do hosting bên thứ ba, lỗi từ plugin/dịch vụ ngoài phạm vi quản lý, chiến dịch quảng cáo của khách hàng). Chúng tôi nỗ lực tối ưu tốc độ và bảo mật ở mức hợp lý theo phạm vi đã cam kết.",
    ],
  },
  {
    h2: "8. Nội dung trên website WebStudio",
    paras: [
      "Thông tin giá, gói dịch vụ và nội dung trên website mang tính tham khảo. Báo giá chính thức được xác nhận sau khi trao đổi nhu cầu cụ thể. Nghiêm cấm sao chép, sử dụng trái phép nội dung/thiết kế của website WebStudio.",
    ],
  },
  {
    h2: "9. Luật áp dụng",
    paras: [
      "Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp sẽ ưu tiên giải quyết bằng thương lượng; nếu không thành sẽ đưa ra cơ quan có thẩm quyền tại Việt Nam.",
    ],
  },
  {
    h2: "10. Liên hệ",
    paras: [
      "Mọi thắc mắc về Điều khoản & điều kiện, vui lòng liên hệ: email info@webhd.vn — điện thoại 0938 002 776.",
    ],
  },
];

const privacyHtml = buildPage(
  "Chính sách bảo mật | WebStudio",
  "Chính sách bảo mật của WebStudio về thu thập, sử dụng và bảo vệ thông tin cá nhân.",
  "Chính sách",
  "Chính sách bảo mật",
  "Cách WebStudio thu thập, sử dụng và bảo vệ thông tin của bạn khi sử dụng website và dịch vụ tư vấn.",
  privacySections
);

const termsHtml = buildPage(
  "Điều khoản & điều kiện | WebStudio",
  "Điều khoản và điều kiện sử dụng website và dịch vụ của WebStudio.",
  "Điều khoản",
  "Điều khoản & điều kiện",
  "Các điều khoản áp dụng khi bạn sử dụng website WebStudio và thuê dịch vụ thiết kế/lập trình web.",
  termsSections
);

fs.writeFileSync(path.join(root, "privacy.html"), privacyHtml, "utf8");
fs.writeFileSync(path.join(root, "terms.html"), termsHtml, "utf8");

const files = fs
  .readdirSync(root)
  .filter((f) => f.endsWith(".html"));

for (const file of files) {
  const full = path.join(root, file);
  let html = fs.readFileSync(full, "utf8");
  html = html
    .replaceAll(
      '<li><a href="sitemap.html">Chính sách bảo mật</a></li>',
      '<li><a href="privacy.html">Chính sách bảo mật</a></li>'
    )
    .replaceAll(
      '<li><a href="sitemap.html">Điều khoản &amp; điều kiện</a></li>',
      '<li><a href="terms.html">Điều khoản &amp; điều kiện</a></li>'
    );
  fs.writeFileSync(full, html, "utf8");
}

// Add to sitemap list if present
const sitemapPath = path.join(root, "sitemap.html");
let sitemap = fs.readFileSync(sitemapPath, "utf8");
if (!sitemap.includes("privacy.html")) {
  sitemap = sitemap.replace(
    '<li><a href="sitemap.html"><span>Sitemap</span><span>sitemap.html</span></a></li>',
    `<li><a href="privacy.html"><span>Chính sách bảo mật</span><span>privacy.html</span></a></li>
            <li><a href="terms.html"><span>Điều khoản &amp; điều kiện</span><span>terms.html</span></a></li>
            <li><a href="sitemap.html"><span>Sitemap</span><span>sitemap.html</span></a></li>`
  );
  fs.writeFileSync(sitemapPath, sitemap, "utf8");
}

let css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
if (!css.includes(".legal-content")) {
  css += `

/* ===== LEGAL PAGES ===== */
.legal-content {
  max-width: 820px;
  display: grid;
  gap: 28px;
}

.legal-block h2 {
  font-size: 1.25rem;
  margin-bottom: 10px;
  color: inherit;
}

.legal-block p,
.legal-block li {
  color: #8d96a8;
  font-size: 15px;
  line-height: 1.7;
}

.legal-block p + p {
  margin-top: 10px;
}

.legal-block ul {
  margin: 12px 0 0 1.1rem;
  display: grid;
  gap: 8px;
}

.legal-updated {
  color: #667082;
  font-size: 13px;
  margin-top: 8px;
}

body.theme-light .legal-block p,
body.theme-light .legal-block li,
body.theme-light .legal-updated {
  color: #5b6475;
}
`;
  fs.writeFileSync(path.join(root, "styles.css"), css, "utf8");
}

console.log("Created privacy.html + terms.html and updated footer links.");
