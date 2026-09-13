import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const css = fs.readFileSync(path.join(root, "src", "styles", "app-khach.css"), "utf8");

const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>App WebStudio — Tạo website trên điện thoại</title>
  <meta name="theme-color" content="#8f7cff" />
  <link rel="icon" href="public/icons/app-khach-192.png" />
  <link rel="apple-touch-icon" href="public/icons/app-khach-192.png" />
  <style>
${css}
.app-page { display: none; flex: 1; flex-direction: column; min-height: 0; }
.app-page.is-on { display: flex; }
.app-compose-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.app-compose-field label { font-size: 12px; color: var(--app-muted); font-weight: 600; }
.app-compose-field input, .app-compose-field textarea, .app-compose-field select {
  border: 1px solid var(--app-line); background: var(--app-card); color: var(--app-fg);
  border-radius: 12px; padding: 10px 12px; font: inherit;
}
.app-compose-field textarea { min-height: 72px; resize: vertical; }
.app-preview-card { background: var(--app-card); border-radius: 18px; overflow: hidden; border: 1px solid var(--app-line); }
.app-preview-card img { width: 100%; height: 160px; object-fit: cover; display: block; }
.app-preview-body { padding: 16px; }
.app-preview-body h2 { font-size: 20px; margin: 0 0 6px; }
.app-preview-price { color: var(--app-accent); font-weight: 800; margin: 8px 0; }
.app-chat-list { display: flex; flex-direction: column; gap: 8px; flex: 1; overflow: auto; padding-bottom: 8px; }
.app-chat-bubble { max-width: 82%; padding: 10px 12px; border-radius: 14px; font-size: 14px; }
.app-chat-bubble.me { align-self: flex-end; background: var(--app-accent); color: #fff; }
.app-chat-bubble.bot { align-self: flex-start; background: var(--app-soft); }
.app-chat-form { display: flex; gap: 8px; }
.app-chat-form input { flex: 1; border: 1px solid var(--app-line); border-radius: 999px; padding: 10px 14px; background: var(--app-card); color: var(--app-fg); font: inherit; }
button.app-soan-item, button.app-settings-row, button.app-settings-head-link {
  width: 100%; text-align: left; border: 0; background: transparent; font: inherit; color: inherit; cursor: pointer;
}
button.app-soan-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; }
button.app-soan-item.is-locked { pointer-events: auto; }
.app-tpl { border: 0; background: transparent; padding: 0; text-align: left; cursor: pointer; width: 100%; font: inherit; color: inherit; }
.app-tpl-img img { width: 100%; height: 110px; object-fit: cover; display: block; }
.app-site-thumb { position: relative; width: 64px; height: 64px; border-radius: 12px; overflow: hidden; flex: none; background: var(--app-preview-img); }
.app-site-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.app-chat-inbox-item { width: 100%; border: 0; background: transparent; font: inherit; color: inherit; cursor: pointer; text-align: left; }
  </style>
</head>
<body>
  <div class="app-stage">
    <p class="app-stage-hint">App khách · GitHub Pages</p>
    <div class="app-phone" id="phone" data-theme="light">
      <div class="app-phone-body" id="phoneBody"></div>
      <nav class="app-tabbar" aria-label="Điều hướng app" id="tabbar"></nav>
    </div>
  </div>
  <script>
const SITE_TYPES = [
  { id: "landing", name: "Landing Page", short: "Landing", blurb: "1 trang, chạy ads, thu lead, bán 1 sản phẩm." },
  { id: "company", name: "Website công ty", short: "Công ty", blurb: "Giới thiệu doanh nghiệp, dịch vụ, đội ngũ, liên hệ." },
  { id: "saas", name: "Website Startup / SaaS", short: "SaaS", blurb: "Giới thiệu sản phẩm, bảng giá, đăng ký dùng thử." },
  { id: "ecommerce", name: "Web bán hàng / E-commerce", short: "Bán hàng", blurb: "Danh mục, sản phẩm, giỏ hàng, đặt hàng COD." }
];
const TYPE_TEMPLATE = { landing: "aura", company: "nova", saas: "pulse", ecommerce: "green" };
const TEMPLATES = [
  { id: "aura", type: "landing", name: "AURA Glow", use: "Mỹ phẩm / skincare", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80" },
  { id: "event", type: "landing", name: "Open Day", use: "Sự kiện / workshop", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80" },
  { id: "nova", type: "company", name: "Nova Legal", use: "Văn phòng / dịch vụ", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80" },
  { id: "build", type: "company", name: "KienBuild", use: "Xây dựng / nội thất", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
  { id: "pulse", type: "saas", name: "Pulse Analytics", use: "SaaS dashboard", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" },
  { id: "flow", type: "saas", name: "Flow CRM", use: "Startup B2B", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" },
  { id: "green", type: "ecommerce", name: "Green Store", use: "Tạp hóa / organic", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" },
  { id: "mode", type: "ecommerce", name: "Mode Apparel", use: "Thời trang", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80" }
];
const CHECKS = {
  landing: [
    { id: "hero", label: "Tiêu đề & giá Hero" },
    { id: "phone", label: "Số điện thoại / Zalo" },
    { id: "lead", label: "Mô tả ngắn" },
    { id: "cta", label: "Nút đặt hàng (CTA)" }
  ],
  company: [
    { id: "hero", label: "Tên công ty" },
    { id: "lead", label: "Giới thiệu" },
    { id: "phone", label: "Liên hệ" },
    { id: "cta", label: "Nút liên hệ" }
  ],
  saas: [
    { id: "hero", label: "Tên sản phẩm" },
    { id: "lead", label: "Lợi ích" },
    { id: "phone", label: "Email / Zalo" },
    { id: "cta", label: "Nút dùng thử" }
  ],
  ecommerce: [
    { id: "shop_home", label: "Trang chủ shop" },
    { id: "products", label: "Thông tin sản phẩm" },
    { id: "cart", label: "Giỏ hàng" },
    { id: "payment", label: "Thanh toán" }
  ]
};
function svg(inner) {
  return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + inner + "</svg>";
}
const ICONS = {
  home: svg('<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"/>'),
  mau: svg('<rect x="4" y="4" width="7" height="7" rx="1.2"/><rect x="13" y="4" width="7" height="7" rx="1.2"/><rect x="4" y="13" width="7" height="7" rx="1.2"/><rect x="13" y="13" width="7" height="7" rx="1.2"/>'),
  soan: svg('<path d="M12 20h8"/><path d="M16.4 3.8a2 2 0 0 1 2.8 2.8L8 18l-4 1 1-4Z"/>'),
  chat: svg('<path d="M5 6.5h10.5A2.5 2.5 0 0 1 18 9v5.5A2.5 2.5 0 0 1 15.5 17H11l-3.5 3v-3H5A2 2 0 0 1 3 15V8.5A2 2 0 0 1 5 6.5z"/><path d="M8 11h6M8 8.8h4"/>'),
  xem: svg('<ellipse cx="12" cy="12" rx="9" ry="6.5"/><circle cx="12" cy="12" r="2.5"/>'),
  toi: svg('<circle cx="12" cy="8" r="3.2"/><path d="M5 19.5c1.2-3.2 3.6-4.8 7-4.8s5.8 1.6 7 4.8"/>')
};
const TYPE_ICONS = {
  landing: svg('<rect x="6" y="3.5" width="12" height="17" rx="1.5"/><path d="M9 8h6M9 12h6M9 16h4"/>'),
  company: svg('<path d="M5 21V5.5A1.5 1.5 0 0 1 6.5 4h7A1.5 1.5 0 0 1 15 5.5V21"/><path d="M15 10h3.5A1.5 1.5 0 0 1 20 11.5V21"/><path d="M9 8h2M9 12h2M9 16h2M5 21h14"/>'),
  saas: svg('<path d="M12 3c3 2 5.5 6 5.5 10.5 0 1.5-.3 2.8-.8 3.9L12 21l-4.7-3.6A9 9 0 0 1 6.5 13.5C6.5 9 9 5 12 3z"/><circle cx="12" cy="11" r="1.6"/>'),
  ecommerce: svg('<path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6.5A3 3 0 0 1 12 3.5 3 3 0 0 1 15 6.5V8"/>')
};
const MENU_ICONS = {
  "ho-so": ICONS.toi,
  "giao-dien": svg('<path d="M12 4a8 8 0 1 0 0 16h1.2a2.2 2.2 0 0 0 2-3.1 2.2 2.2 0 0 1 2-3.2H18A8 8 0 0 0 12 4z"/>'),
  "quyen-rieng-tu": svg('<path d="M12 3.5 19 6.5v5.2c0 4.2-2.8 7.4-7 8.8-4.2-1.4-7-4.6-7-8.8V6.5z"/><path d="m9 12 2 2 4-4"/>'),
  "tai-khoan": svg('<path d="M7 11V8a5 5 0 0 1 10 0v3"/><rect x="5" y="11" width="14" height="9" rx="2"/>'),
  "nha-phat-trien": svg('<path d="M8 4.5h3.2V6a1.6 1.6 0 1 0 3.2 0V4.5H17A1.5 1.5 0 0 1 18.5 6v3.2H17a1.6 1.6 0 1 0 0 3.2h1.5V16A1.5 1.5 0 0 1 17 17.5h-2.6V16a1.6 1.6 0 1 0-3.2 0v1.5H8A1.5 1.5 0 0 1 6.5 16v-3.2H8a1.6 1.6 0 1 0 0-3.2H6.5V6A1.5 1.5 0 0 1 8 4.5z"/>'),
  "gioi-thieu": svg('<circle cx="12" cy="12" r="8"/><path d="M12 10v5M12 7.5v.5"/>'),
  "tai-apk": svg('<path d="M12 4v10M8 10l4 4 4-4M5 18h14"/>')
};
const LOGOUT = svg('<path d="M10 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H10"/><path d="M10 12h9M16 8.5 19.5 12 16 15.5"/>');
function makeCode() {
  return Math.random().toString(16).slice(2, 8).toUpperCase();
}
function formatVN(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n) => String(n).padStart(2, "0");
  return p(d.getHours()) + ":" + p(d.getMinutes()) + " " + p(d.getDate()) + "/" + p(d.getMonth() + 1) + "/" + d.getFullYear();
}
const KEY = "ws_github_app_khach";
const TABS = [
  { id: "home", label: "Trang chủ" },
  { id: "mau", label: "Mẫu" },
  { id: "soan", label: "Soạn" },
  { id: "chat", label: "Chat" },
  { id: "xem", label: "Xem" },
  { id: "toi", label: "Tôi" }
];

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    return {
      typeId: raw.typeId || "landing",
      templateId: raw.templateId || "aura",
      name: raw.name || "",
      headline: raw.headline || "",
      lead: raw.lead || "",
      price: raw.price || "",
      cta: raw.cta || "",
      phone: raw.phone || "",
      theme: raw.theme === "dark" ? "dark" : "light",
      userName: raw.userName || "Khách",
      birthday: raw.birthday || "",
      myCode: raw.myCode || makeCode(),
      inviteCode: raw.inviteCode || makeCode(),
      lastLogin: raw.lastLogin || new Date().toISOString(),
      groups: Array.isArray(raw.groups) ? raw.groups : [],
      savedTypes: raw.savedTypes && typeof raw.savedTypes === "object" ? raw.savedTypes : {},
      messages: Array.isArray(raw.messages) ? raw.messages : [
        { who: "bot", text: "Chào bạn. App khách đang chạy trên GitHub Pages — soạn nội dung và xem ngay trên điện thoại." }
      ]
    };
  } catch {
    return {
      typeId: "landing",
      templateId: "aura",
      name: "",
      headline: "",
      lead: "",
      price: "",
      cta: "",
      phone: "",
      theme: "light",
      userName: "Khách",
      messages: [{ who: "bot", text: "Chào bạn. App khách đang chạy trên GitHub Pages." }]
    };
  }
}
function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
let state = load();
save(state);

function tpl() {
  return TEMPLATES.find((t) => t.id === state.templateId) || TEMPLATES[0];
}
function typeInfo() {
  return SITE_TYPES.find((t) => t.id === state.typeId) || SITE_TYPES[0];
}
function checks() {
  return (CHECKS[state.typeId] || CHECKS.landing).map((c) => ({
    ...c,
    done: Boolean(state[c.id === "hero" ? "headline" : c.id])
  }));
}
function progress() {
  const list = checks();
  return list.length ? Math.round((list.filter((c) => c.done).length / list.length) * 100) : 0;
}
const SEED = {
  landing: { headline: "Da hết mụn, sáng mịn 14 ngày — cho da dầu, không kích ứng.", lead: "AURA Glow Essence 30ml: niacinamide 5% + peptide.", price: "449.000đ", cta: "Mua ngay", phone: "0900000000", b1: "COD — trả khi nhận", b2: "Freeship toàn quốc", b3: "Đổi trả 7 ngày", quote: "Dùng 10 ngày mụn ẩn giảm rõ, không khô da.", author: "Minh Anh, 26 tuổi" },
  company: { headline: "Nova Legal", lead: "Tư vấn pháp lý cho doanh nghiệp vừa và nhỏ.", price: "", cta: "Nhận tư vấn", phone: "0900000000", b1: "Tư vấn hợp đồng", b2: "Lao động — nhân sự", b3: "Tranh chấp dân sự", quote: "Đội ngũ luật sư đồng hành cùng SME.", author: "Thành lập 2018" },
  saas: { headline: "Hiểu khách hàng chỉ trong 1 bảng.", lead: "Pulse Analytics — dashboard realtime cho startup.", price: "199.000đ/tháng", cta: "Dùng thử", phone: "0900000000", b1: "Báo cáo tự động", b2: "Tích hợp Slack", b3: "Không cần SQL", quote: "Setup 10 phút, team sales dùng ngay.", author: "Lan, Growth" },
  ecommerce: { headline: "Green Store", lead: "Rau củ hữu cơ, giao trong ngày.", price: "Từ 35.000đ", cta: "Đặt hàng COD", phone: "0900000000", b1: "Tươi trong ngày", b2: "COD toàn quốc", b3: "Đổi trả 24h", quote: "Rau ngon, đóng gói sạch.", author: "Hương, Q.7" }
};
const CHEV = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>';
const SUB_TAB = { "soan-noidung": "soan", "xem-preview": "xem", "chat-thread": "chat", "ho-so": "toi", "giao-dien": "toi", "quyen-rieng-tu": "toi", "tai-khoan": "toi", "nha-phat-trien": "toi", "gioi-thieu": "toi", "tai-apk": "toi" };
function route() {
  const id = (location.hash || "#home").slice(1).split("?")[0] || "home";
  if (TABS.some((t) => t.id === id)) return { view: id, tab: id };
  return { view: SUB_TAB[id] ? id : "home", tab: SUB_TAB[id] || "home" };
}
function page() { return route().view; }
function seed() { return SEED[state.typeId] || SEED.landing; }
function val(key) { return state[key] || seed()[key] || ""; }
function go(id) {
  location.hash = id;
}
function esc(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function resolveApkUrl() {
  let path = location.pathname || "/";
  const last = path.split("/").pop() || "";
  if (!path.endsWith("/") && !/\\.[a-z0-9]+$/i.test(last)) path += "/";
  if (!path.endsWith("/")) path = path.replace(/[^/]+$/, "");
  return path + "WebStudio.apk";
}

function renderHome() {
  const type = typeInfo();
  const t = tpl();
  const list = checks();
  const pct = progress();
  return \`
    <header class="app-home-top">
      <div>
        <h1>Tạo website của bạn</h1>
        <p>Chọn loại site — soạn trên điện thoại, xuất bản ngay</p>
      </div>
      <button type="button" class="app-avatar" data-go="toi">\${esc(state.userName.slice(0,1).toUpperCase())}</button>
    </header>
    <div class="app-section-label">Các loại website</div>
    <div class="app-type-grid">
      \${SITE_TYPES.map((item, i) => \`
        <button type="button" class="app-type-card\${state.typeId === item.id ? " is-on" : ""}" data-type="\${item.id}">
          <span class="app-type-icon">\${TYPE_ICONS[item.id]}</span>
          <span class="app-type-num">0\${i + 1}</span>
          <strong>\${esc(item.name)}</strong>
          <span>\${esc(item.blurb)}</span>
        </button>\`).join("")}
    </div>
    <div class="app-section-label">Đang soạn</div>
    <article class="app-site-card">
      <div class="app-site-card-head">
        <div class="app-site-thumb"><img src="\${t.image}" alt="" /></div>
        <div>
          <h2>\${esc(state.name || type.name)}</h2>
          <p class="app-meta">\${esc(type.name)} · \${esc(t.name)}</p>
        </div>
      </div>
      <div class="app-progress-row"><span>Hoàn thiện nội dung</span><span>\${pct}%</span></div>
      <div class="app-progress-track" aria-hidden><div class="app-progress-fill" style="width:\${pct}%"></div></div>
      <div class="app-site-actions">
        <button type="button" class="app-btn app-btn-ghost" data-go="xem-preview">Xem trang</button>
        <button type="button" class="app-btn app-btn-primary" data-go="soan-noidung">Tiếp tục soạn</button>
      </div>
    </article>
    <div class="app-checks">
      \${list.map((item) => \`
        <div class="app-check">
          <span class="app-check-icon\${item.done ? " on" : ""}">\${TYPE_ICONS[state.typeId] || TYPE_ICONS.landing}</span>
          <span class="app-check-label">\${esc(item.label)}</span>
          <small>\${item.done ? "Xong" : "Thiếu"}</small>
        </div>\`).join("")}
    </div>\`;
}

function renderMau() {
  const list = TEMPLATES.filter((t) => !state.filterType || t.type === state.filterType);
  return \`
    <header class="app-home-top"><div><h1>Mẫu website</h1><p>Chọn mẫu theo loại — rồi chỉ sửa chữ và ảnh</p></div></header>
    <div class="app-chips">
      <button type="button" class="app-chip\${!state.filterType ? " is-on" : ""}" data-filter="">Tất cả</button>
      \${SITE_TYPES.map((t) => \`<button type="button" class="app-chip\${state.filterType === t.id ? " is-on" : ""}" data-filter="\${t.id}">\${esc(t.short)}</button>\`).join("")}
    </div>
    <div class="app-tpl-grid">
      \${list.map((t) => \`
        <button type="button" class="app-tpl" data-mau="\${t.id}">
          <div class="app-tpl-img"><img src="\${t.image}" alt="" /></div>
          <strong>\${esc(t.name)}</strong>
          <span>\${esc(SITE_TYPES.find((x) => x.id === t.type)?.short || "")} · \${esc(t.use)}</span>
        </button>\`).join("")}
    </div>\`;
}

function renderSoan() {
  const hints = {
    landing: "1 trang bán sản phẩm, thu lead",
    company: "Giới thiệu doanh nghiệp và dịch vụ",
    saas: "Sản phẩm, bảng giá, đăng ký dùng thử",
    ecommerce: "Danh mục, sản phẩm, đặt hàng COD"
  };
  return \`
    <header class="app-home-top"><div><h1>Soạn thông tin website</h1><p>Chọn loại website để bắt đầu — mỗi loại lưu riêng</p></div></header>
    <ol class="app-soan-list">
      \${SITE_TYPES.map((type, i) => \`
        <li>
          <button type="button" class="app-soan-item" data-soan-type="\${type.id}">
            <span class="app-soan-idx">\${i + 1}</span>
            <div>
              <strong>\${esc(type.name)}</strong>
              <p>\${esc(hints[type.id] || type.blurb)}</p>
            </div>
          </button>
        </li>\`).join("")}
    </ol>\`;
}

function renderSoanNoidung() {
  const type = typeInfo();
  return \`
    <button type="button" class="app-back" data-go="soan">← Tất cả loại website</button>
    <header class="app-home-top"><div><h1>Soạn \${esc(type.short)}</h1><p>Điền chữ, giá, SĐT rồi lưu</p></div></header>
    <div class="app-compose-field"><label>Tên website</label><input id="f-name" value="\${esc(state.name)}" placeholder="\${esc(seed().headline)}" /></div>
    <div class="app-compose-field"><label>Tiêu đề</label><textarea id="f-headline" placeholder="\${esc(seed().headline)}">\${esc(state.headline)}</textarea></div>
    <div class="app-compose-field"><label>Mô tả</label><textarea id="f-lead" placeholder="\${esc(seed().lead)}">\${esc(state.lead)}</textarea></div>
    <div class="app-compose-field"><label>Giá</label><input id="f-price" value="\${esc(state.price)}" placeholder="\${esc(seed().price)}" /></div>
    <div class="app-compose-field"><label>Nút CTA</label><input id="f-cta" value="\${esc(state.cta)}" placeholder="\${esc(seed().cta)}" /></div>
    <div class="app-compose-field"><label>Số điện thoại / Zalo</label><input id="f-phone" value="\${esc(state.phone)}" placeholder="\${esc(seed().phone)}" /></div>
    <button type="button" class="app-btn app-btn-primary" id="saveDraft">Lưu thông tin</button>\`;
}

function renderChat() {
  const siteName = state.name || typeInfo().name;
  const groups = state.groups || [];
  return \`
    <div class="app-chat-screen">
      <header class="app-home-top"><div><h1>Chat</h1><p>Chia sẻ mã của bạn hoặc nhập mã để kết nối</p></div></header>
      <section class="app-chat-code-card">
        <div><small>Mã của bạn</small><strong>\${esc(state.myCode)}</strong></div>
        <button type="button" class="app-btn app-btn-primary" id="copyCode">Sao chép</button>
      </section>
      <form class="app-chat-join" id="joinForm">
        <input id="joinCode" maxlength="8" placeholder="Nhập mã kết nối" autocapitalize="characters" />
        <button type="submit" class="app-btn app-btn-primary">Kết nối</button>
      </form>
      <button type="button" class="app-chat-create" id="createGroup">Tạo nhóm và lấy mã chia sẻ</button>
      <div class="app-chat-inbox">
        <button type="button" class="app-chat-inbox-item" data-chat="site">
          <span class="app-chat-inbox-avatar is-letter">S</span>
          <span class="app-chat-inbox-copy">
            <span class="app-chat-inbox-row"><strong>\${esc(siteName)}</strong><span>Nhóm site</span></span>
            <span class="app-chat-inbox-preview">Chat cùng người soạn website này</span>
          </span>
        </button>
        \${groups.map((g) => \`
          <button type="button" class="app-chat-inbox-item" data-chat="\${esc(g.code)}">
            <span class="app-chat-inbox-avatar is-letter">\${esc((g.title || "N").slice(0,1).toUpperCase())}</span>
            <span class="app-chat-inbox-copy">
              <span class="app-chat-inbox-row"><strong>\${esc(g.title)}</strong><span>\${esc(g.code)}</span></span>
              <span class="app-chat-inbox-preview">\${esc(g.last || "Chưa có tin")}</span>
            </span>
          </button>\`).join("")}
      </div>
    </div>\`;
}

function renderChatThread() {
  const title = state.activeChat === "site" ? (state.name || typeInfo().name) : ("Nhóm " + (state.activeChat || ""));
  return \`
    <button type="button" class="app-back" data-go="chat">← Chat</button>
    <header class="app-home-top"><div><h1>\${esc(title)}</h1><p>Tin nhắn lưu trên thiết bị</p></div></header>
    <div class="app-chat-list" id="chatList">
      \${state.messages.map((m) => \`<div class="app-chat-bubble \${m.who}">\${esc(m.text)}</div>\`).join("")}
    </div>
    <form class="app-chat-form" id="chatForm">
      <input id="chatInput" placeholder="Nhắn tin..." autocomplete="off" />
      <button class="app-btn app-btn-primary" type="submit">Gửi</button>
    </form>\`;
}

function renderXem() {
  return \`
    <header class="app-home-top"><div><h1>Xem trang</h1><p>Mỗi loại website là một trang riêng — hiện sau khi lưu thông tin</p></div></header>
    <ol class="app-soan-list">
      \${SITE_TYPES.map((type, i) => {
        const saved = state.savedTypes && state.savedTypes[type.id];
        return \`
        <li>
          <button type="button" class="app-soan-item\${saved ? "" : " is-locked"}" data-xem-type="\${type.id}">
            <span class="app-soan-idx">\${i + 1}</span>
            <div>
              <strong>\${esc(type.name)}</strong>
              <p>\${saved ? esc(saved) : "Chưa lưu — soạn rồi bấm Lưu thông tin"}</p>
            </div>
          </button>
        </li>\`;
      }).join("")}
    </ol>\`;
}

function renderXemPreview() {
  const type = typeInfo();
  const t = tpl();
  const s = seed();
  const phone = val("phone");
  return \`
    <button type="button" class="app-back" data-go="xem">← Tất cả loại website</button>
    <header class="app-home-top"><div><h1>Xem trước</h1><p>\${esc(type.name)} · \${esc(state.name || t.name)}</p></div></header>
    <div class="app-preview">
      <div class="app-preview-bar"><span></span><span></span><span></span></div>
      <div class="app-preview-hero">
        <small>\${esc(type.name)}</small>
        <h2>\${esc(val("headline") || t.name)}</h2>
        <p>\${esc(val("lead"))}</p>
        \${val("price") ? '<strong class="app-preview-price">' + esc(val("price")) + "</strong>" : ""}
        <span class="app-preview-cta">\${esc(val("cta"))}</span>
      </div>
      <ul class="app-preview-benefits">
        <li>\${esc(s.b1)}</li>
        <li>\${esc(s.b2)}</li>
        <li>\${esc(s.b3)}</li>
      </ul>
      <blockquote class="app-preview-review">
        <p>★★★★★ \${esc(s.quote)}</p>
        <cite>\${esc(s.author)}</cite>
      </blockquote>
      <div class="app-preview-cta-row">
        <span>SĐT \${esc(phone)}</span>
        <span>Zalo \${esc(phone)}</span>
      </div>
    </div>
    <div class="app-site-actions is-center" style="margin-top:16px">
      <button type="button" class="app-btn app-btn-dark" data-go="soan-noidung">Sửa thông tin</button>
    </div>\`;
}

function renderToi() {
  const letter = state.userName.slice(0, 1).toUpperCase();
  const rows = [
    ["ho-so", "Hồ sơ"],
    ["giao-dien", "Giao diện"],
    ["quyen-rieng-tu", "Quyền riêng tư"],
    ["tai-khoan", "Tài khoản và bảo mật"],
    ["nha-phat-trien", "Nhà phát triển"],
    ["gioi-thieu", "Giới thiệu"]
  ];
  return \`
    <div class="app-settings">
      <header class="app-settings-head">
        <button type="button" class="app-settings-head-link" data-go="ho-so">
          <div class="app-settings-avatar">\${esc(letter)}</div>
          <div class="app-settings-who">
            <strong>\${esc(state.userName)}</strong>
            <span>\${esc(state.name || typeInfo().name)} · \${esc(state.inviteCode)}</span>
            <span>Đăng nhập: \${esc(formatVN(state.lastLogin))} (GMT+7)</span>
          </div>
        </button>
        <button type="button" class="app-settings-logout" id="logoutBtn" aria-label="Đăng xuất">\${LOGOUT}</button>
      </header>
      <div class="app-settings-list">
        \${rows.map(([id, label]) => \`
          <button type="button" class="app-settings-row" data-go="\${id}">
            <span class="app-settings-ico">\${MENU_ICONS[id]}</span>
            <span>\${esc(label)}</span>
            \${CHEV}
          </button>\`).join("")}
      </div>
    </div>\`;
}

function renderGiaoDien() {
  return \`
    <button type="button" class="app-back" data-go="toi">← Cài đặt</button>
    <header class="app-home-top"><div><h1>Giao diện</h1><p>Sáng hoặc tối</p></div></header>
    <div class="app-theme-picks">
      <button type="button" class="app-theme-pick\${state.theme === "light" ? " is-on" : ""}" data-theme="light">Sáng</button>
      <button type="button" class="app-theme-pick\${state.theme === "dark" ? " is-on" : ""}" data-theme="dark">Tối</button>
    </div>\`;
}

function renderHoSo() {
  return \`
    <button type="button" class="app-back" data-go="toi">← Cài đặt</button>
    <header class="app-home-top"><div><h1>Hồ sơ</h1><p>Biệt danh và tên hiển thị</p></div></header>
    <div class="app-compose-field"><label>Tên hiển thị</label><input id="f-user" value="\${esc(state.userName)}" /></div>
    <div class="app-compose-field"><label>Ngày sinh</label><input id="f-birthday" type="date" value="\${esc(state.birthday || "")}" /></div>
    <button type="button" class="app-btn app-btn-primary" id="saveProfile">Lưu hồ sơ</button>
    <p class="app-note" id="profileMsg"></p>\`;
}

function renderQuyen() {
  return \`
    <button type="button" class="app-back" data-go="toi">← Cài đặt</button>
    <header class="app-home-top"><div><h1>Quyền riêng tư</h1><p>Dữ liệu lưu trên trình duyệt của bạn</p></div></header>
    <div class="app-info-card"><strong>GitHub Pages</strong><p>Bản nháp, chat và hồ sơ được lưu localStorage trên máy/điện thoại. Không gửi lên máy chủ.</p></div>
    <div class="app-nav-row is-in-card" data-go="ho-so"><span>Hồ sơ</span>\${CHEV}</div>
    <div class="app-nav-row is-in-card" data-go="tai-khoan"><span>Tài khoản</span>\${CHEV}</div>\`;
}

function renderTaiKhoan() {
  return \`
    <button type="button" class="app-back" data-go="toi">← Cài đặt</button>
    <header class="app-home-top"><div><h1>Tài khoản và bảo mật</h1><p>Bản GitHub không có đăng nhập máy chủ</p></div></header>
    <div class="app-info-card"><p>Để dùng tài khoản, mật khẩu, email đầy đủ như bản trên máy, cần máy chủ Next.js. Bản GitHub chỉ lưu hồ sơ trên thiết bị.</p></div>
    <div class="app-nav-row is-in-card" data-go="ho-so"><span>Thông tin hồ sơ</span>\${CHEV}</div>\`;
}

function renderDev() {
  return \`
    <button type="button" class="app-back" data-go="toi">← Cài đặt</button>
    <header class="app-home-top"><div><h1>Nhà phát triển</h1><p>WebStudio App khách</p></div></header>
    <div class="app-info-card"><strong>Phiên bản GitHub Pages</strong><p>App tĩnh 24/7. Soạn / xem / chat lưu trên trình duyệt.</p></div>\`;
}

function renderAbout() {
  return \`
    <button type="button" class="app-back" data-go="toi">← Cài đặt</button>
    <header class="app-home-top"><div><h1>Giới thiệu</h1><p>WebStudio — tạo website trên điện thoại</p></div></header>
    <div class="app-info-card"><strong>WebStudio App</strong><p>Ứng dụng giúp bạn tự soạn Landing Page, website công ty, SaaS và web bán hàng ngay trên điện thoại.</p></div>
    <p class="app-sec-label">Bạn làm được gì</p>
    <ul class="app-info-list">
      <li><strong>4 loại website</strong><span>Landing, công ty, SaaS, bán hàng</span></li>
      <li><strong>Soạn theo khối</strong><span>Điền chữ, giá, SĐT/Zalo rồi lưu</span></li>
      <li><strong>Xem trước</strong><span>Tab Xem hiện đúng loại bạn đã soạn</span></li>
      <li><strong>Chat</strong><span>Tin nhắn lưu trên thiết bị</span></li>
    </ul>
    <p class="app-info-foot">Phiên bản 1.0 · © 2026 WebStudio</p>\`;
}

function renderTaiApk() {
  return \`
    <button type="button" class="app-back" data-go="toi">← Cài đặt</button>
    <header class="app-home-top"><div><h1>Tải ứng dụng</h1><p>Cài WebStudio trên Android</p></div></header>
    <a class="app-btn app-btn-primary" id="dlApk" href="WebStudio.apk" download="WebStudio.apk">Tải ứng dụng Android</a>
    <p class="app-note" id="dlHint" style="margin-top:12px">File WebStudio.apk phải nằm cùng thư mục với index.html trên GitHub.</p>\`;
}

function bind() {
  document.querySelectorAll("[data-go]").forEach((el) => el.addEventListener("click", () => go(el.dataset.go)));
  document.querySelectorAll("[data-type]").forEach((el) => el.addEventListener("click", () => {
    state.typeId = el.dataset.type;
    state.templateId = TYPE_TEMPLATE[state.typeId];
    save(state); render();
  }));
  document.querySelectorAll("[data-filter]").forEach((el) => {
    el.addEventListener("click", () => { state.filterType = el.dataset.filter || ""; render(); });
  });
  document.querySelectorAll("[data-mau]").forEach((el) => el.addEventListener("click", () => {
    const found = TEMPLATES.find((t) => t.id === el.dataset.mau);
    if (!found) return;
    state.templateId = found.id;
    state.typeId = found.type;
    save(state); go("soan-noidung");
  }));
  document.querySelectorAll("[data-soan-type]").forEach((el) => el.addEventListener("click", () => {
    state.typeId = el.dataset.soanType;
    state.templateId = TYPE_TEMPLATE[state.typeId];
    save(state); go("soan-noidung");
  }));
  document.querySelectorAll("[data-xem-type]").forEach((el) => el.addEventListener("click", () => {
    state.typeId = el.dataset.xemType;
    state.templateId = TYPE_TEMPLATE[state.typeId];
    save(state); go("xem-preview");
  }));
  document.querySelectorAll("[data-theme]").forEach((el) => el.addEventListener("click", () => {
    state.theme = el.dataset.theme;
    save(state); render();
  }));
  const saveBtn = document.getElementById("saveDraft");
  if (saveBtn) saveBtn.onclick = () => {
    state.name = document.getElementById("f-name").value.trim();
    state.headline = document.getElementById("f-headline").value.trim();
    state.lead = document.getElementById("f-lead").value.trim();
    state.price = document.getElementById("f-price").value.trim();
    state.cta = document.getElementById("f-cta").value.trim();
    state.phone = document.getElementById("f-phone").value.trim();
    state.savedTypes = state.savedTypes || {};
    state.savedTypes[state.typeId] = state.name || typeInfo().name;
    save(state);
    go("xem-preview");
  };
  const saveProfile = document.getElementById("saveProfile");
  if (saveProfile) saveProfile.onclick = () => {
    state.userName = document.getElementById("f-user").value.trim() || "Khách";
    state.birthday = document.getElementById("f-birthday").value;
    save(state);
    const msg = document.getElementById("profileMsg");
    if (msg) msg.textContent = "Đã lưu hồ sơ.";
  };
  const chatForm = document.getElementById("chatForm");
  if (chatForm) chatForm.onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById("chatInput");
    const text = input.value.trim();
    if (!text) return;
    state.messages.push({ who: "me", text });
    save(state); render();
  };
  const copyCode = document.getElementById("copyCode");
  if (copyCode) copyCode.onclick = () => {
    navigator.clipboard.writeText(state.myCode || "").then(() => {
      copyCode.textContent = "Đã copy";
      setTimeout(() => { copyCode.textContent = "Sao chép"; }, 1400);
    }).catch(() => {});
  };
  const joinForm = document.getElementById("joinForm");
  if (joinForm) joinForm.onsubmit = (e) => {
    e.preventDefault();
    const code = (document.getElementById("joinCode").value || "").trim().toUpperCase();
    if (!code) return;
    state.groups = state.groups || [];
    if (!state.groups.some((g) => g.code === code)) {
      state.groups.unshift({ code, title: "Nhóm " + code, last: "Chưa có tin" });
    }
    save(state); render();
  };
  const createGroup = document.getElementById("createGroup");
  if (createGroup) createGroup.onclick = () => {
    const code = makeCode();
    state.groups = state.groups || [];
    state.groups.unshift({ code, title: "Nhóm " + code, last: "Chưa có tin" });
    save(state); render();
  };
  document.querySelectorAll("[data-chat]").forEach((el) => {
    el.addEventListener("click", () => {
      state.activeChat = el.dataset.chat;
      save(state); go("chat-thread");
    });
  });
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.onclick = () => go("home");
  const apk = document.getElementById("dlApk");
  if (apk) {
    const url = resolveApkUrl();
    apk.href = url;
    apk.onclick = (e) => {
      e.preventDefault();
      fetch(url).then((r) => { if (!r.ok) throw new Error("missing"); return r.blob(); })
        .then((blob) => {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "WebStudio.apk";
          a.click();
        })
        .catch(() => {
          const hint = document.getElementById("dlHint");
          if (hint) hint.textContent = "Chưa có WebStudio.apk trên GitHub. Hãy tải file APK lên cùng thư mục với index.html.";
        });
    };
  }
}

function renderTabs(active) {
  document.getElementById("tabbar").innerHTML = TABS.map((tab) => \`
    <button type="button" class="app-tab\${tab.id === active ? " is-on" : ""}" data-go="\${tab.id}">
      <span class="app-tab-icon">\${ICONS[tab.id]}</span>\${tab.label}
    </button>\`).join("");
}

function render() {
  const { view, tab } = route();
  document.getElementById("phone").dataset.theme = state.theme;
  document.getElementById("phoneBody").className = "app-phone-body" + (view === "chat" ? " is-chat" : "");
  const views = {
    home: renderHome, mau: renderMau, soan: renderSoan, "soan-noidung": renderSoanNoidung,
    chat: renderChat, "chat-thread": renderChatThread, xem: renderXem, "xem-preview": renderXemPreview,
    toi: renderToi, "ho-so": renderHoSo, "giao-dien": renderGiaoDien,
    "quyen-rieng-tu": renderQuyen, "tai-khoan": renderTaiKhoan,
    "nha-phat-trien": renderDev, "gioi-thieu": renderAbout, "tai-apk": renderTaiApk
  };
  document.getElementById("phoneBody").innerHTML = (views[view] || renderHome)();
  renderTabs(tab);
  bind();
}

window.addEventListener("hashchange", render);
render();
  </script>
</body>
</html>
`;

const docs = path.join(root, "docs");
fs.mkdirSync(path.join(docs, "public", "icons"), { recursive: true });
fs.writeFileSync(path.join(docs, "index.html"), html);
fs.writeFileSync(path.join(docs, "404.html"), `<!DOCTYPE html><meta charset="utf-8"><script>location.replace("./index.html"+location.hash)</script>`);
fs.writeFileSync(path.join(docs, ".nojekyll"), "");
const apk = path.join(root, "WebStudio.apk");
if (fs.existsSync(apk)) fs.copyFileSync(apk, path.join(docs, "WebStudio.apk"));
for (const name of ["app-khach-192.png", "app-khach-512.png"]) {
  const src = path.join(root, "public", "icons", name);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(docs, "public", "icons", name));
}
console.log("Da tao docs/index.html (app khach GitHub Pages)");
