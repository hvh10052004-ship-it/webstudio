import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const pages = [
  { file: "index.html", id: "home", title: "WebStudio - Thiết kế Website chuyên nghiệp" },
  { file: "about.html", id: "about", title: "Về chúng tôi — WebStudio" },
  { file: "landing.html", id: "landing", title: "Landing Page — WebStudio" },
  { file: "company.html", id: "company", title: "Website công ty — WebStudio" },
  { file: "saas.html", id: "saas", title: "Website Startup / SaaS — WebStudio" },
  { file: "ecommerce.html", id: "ecommerce", title: "Web bán hàng — WebStudio" },
  { file: "collection.html", id: "collection", title: "Dự án — WebStudio" },
  { file: "product.html", id: "product", title: "Gói dịch vụ — WebStudio" },
  { file: "cart.html", id: "cart", title: "Giỏ yêu cầu — WebStudio" },
  { file: "contact.html", id: "lien-he", title: "Liên hệ — WebStudio" },
  { file: "search.html", id: "search", title: "Tìm kiếm — WebStudio" },
  { file: "sitemap.html", id: "sitemap", title: "Sitemap — WebStudio" },
  { file: "privacy.html", id: "privacy", title: "Chính sách bảo mật — WebStudio" },
  { file: "terms.html", id: "terms", title: "Điều khoản — WebStudio" },
  { file: "tai-ung-dung.html", id: "tai-ung-dung", title: "Tải ứng dụng — WebStudio" },
];

const titles = Object.fromEntries(pages.map((p) => [p.id, p.title]));

function rewriteLinks(html) {
  return html
    .replace(/href="index\.html#([^"]+)"/g, 'href="#$1"')
    .replace(/href="index\.html"/g, 'href="#home"')
    .replace(/href="about\.html"/g, 'href="#about"')
    .replace(/href="landing\.html"/g, 'href="#landing"')
    .replace(/href="company\.html"/g, 'href="#company"')
    .replace(/href="saas\.html"/g, 'href="#saas"')
    .replace(/href="ecommerce\.html"/g, 'href="#ecommerce"')
    .replace(/href="collection\.html"/g, 'href="#collection"')
    .replace(/href="product\.html"/g, 'href="#product"')
    .replace(/href="cart\.html"/g, 'href="#cart"')
    .replace(/href="contact\.html"/g, 'href="#lien-he"')
    .replace(/href="search\.html"/g, 'href="#search"')
    .replace(/href="sitemap\.html"/g, 'href="#sitemap"')
    .replace(/href="privacy\.html"/g, 'href="#privacy"')
    .replace(/href="terms\.html"/g, 'href="#terms"')
    .replace(/href="tai-ung-dung\.html"/g, 'href="#tai-ung-dung"');
}

function extractInner(html, file) {
  if (file === "tai-ung-dung.html") {
    const match = html.match(/<div class="dl-page">[\s\S]*?<\/main>\s*<\/div>/);
    if (!match) throw new Error("Không lấy được nội dung tai-ung-dung.html");
    return match[0];
  }
  const match = html.match(/<main[\s\S]*?<\/main>/);
  if (!match) throw new Error(`Không lấy được <main> của ${file}`);
  return match[0];
}

function uniqueIds(html, pageId) {
  if (pageId === "home") return html;
  return html
    .replace(/id="contactForm"/g, 'id="contactFormPage"')
    .replace(/id="searchForm"/g, 'id="searchFormPage"')
    .replace(/id="name"/g, `id="name-${pageId}"`)
    .replace(/for="name"/g, `for="name-${pageId}"`)
    .replace(/id="phone"/g, `id="phone-${pageId}"`)
    .replace(/for="phone"/g, `for="phone-${pageId}"`)
    .replace(/id="email"/g, `id="email-${pageId}"`)
    .replace(/for="email"/g, `for="email-${pageId}"`)
    .replace(/id="message"/g, `id="message-${pageId}"`)
    .replace(/for="message"/g, `for="message-${pageId}"`);
}

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (home.includes('id="sitePages"')) {
  console.log("index.html da duoc gop, bo qua.");
  process.exit(0);
}

const headerMatch = home.match(/<header class="site-header"[\s\S]*?<\/header>/);
const footerMatch = home.match(/<footer[\s\S]*?<\/footer>/);
if (!headerMatch || !footerMatch) throw new Error("Không tách được header/footer");

const header = rewriteLinks(headerMatch[0]);
const footer = rewriteLinks(footerMatch[0]);

const views = pages
  .map((page) => {
    const raw = fs.readFileSync(path.join(root, page.file), "utf8");
    const inner = uniqueIds(rewriteLinks(extractInner(raw, page.file)), page.id);
    const on = page.id === "home";
    return `      <div class="site-page${on ? " is-on" : ""}" data-page="${page.id}"${on ? "" : " hidden"}>\n        ${inner}\n      </div>`;
  })
  .join("\n");

const css = [
  fs.readFileSync(path.join(root, "styles.css"), "utf8"),
  fs.readFileSync(path.join(root, "download-app.css"), "utf8").replace(
    "body:has(.dl-page)",
    "body.page-tai-ung-dung",
  ),
  `
.site-page { display: none; }
.site-page.is-on { display: block; }
.site-page[hidden="true"] { display: none !important; }
.site-page[hidden="false"] { display: block; }
`,
].join("\n");

let js = fs.readFileSync(path.join(root, "main.js"), "utf8");
js = rewriteLinks(js).replace(
  /if \(contactForm\) \{[\s\S]*?\}\n\n/,
  `function bindContactForm(form) {
  if (!form || form.dataset.bound === "1") return;
  form.dataset.bound = "1";
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Cảm ơn bạn! Yêu cầu của bạn đã được gửi.");
    this.reset();
  });
}
bindContactForm(contactForm);
bindContactForm(document.getElementById("contactFormPage"));

`,
);

const router = `
const PAGE_TITLES = ${JSON.stringify(titles, null, 2)};
const PAGE_IDS = new Set(Object.keys(PAGE_TITLES));
const HOME_SECTIONS = new Set(["services", "pricing", "process", "contact", "top"]);

function resolveHash() {
  const raw = (location.hash || "#home").slice(1);
  const id = raw || "home";
  if (PAGE_IDS.has(id)) return { page: id, scroll: null };
  if (HOME_SECTIONS.has(id)) return { page: "home", scroll: id };
  return { page: "home", scroll: null };
}

function showPage() {
  const { page, scroll } = resolveHash();
  document.querySelectorAll(".site-page").forEach((el) => {
    const on = el.dataset.page === page;
    el.classList.toggle("is-on", on);
    el.hidden = !on;
  });
  document.body.className = document.body.className
    .split(/\\s+/)
    .filter((c) => c && !c.startsWith("page-"))
    .concat("page-" + page)
    .join(" ");
  document.title = PAGE_TITLES[page] || PAGE_TITLES.home;
  bindContactForm(document.getElementById("contactForm"));
  bindContactForm(document.getElementById("contactFormPage"));
  if (page === "tai-ung-dung") initDownloadPage();
  window.requestAnimationFrame(() => {
    if (scroll) {
      const target = document.getElementById(scroll);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  });
}

function resolveApkUrl() {
  if (location.port === "3000") return "/api/download/apk";
  let path = location.pathname || "/";
  const last = path.split("/").pop() || "";
  if (!path.endsWith("/") && !/\.[a-z0-9]+$/i.test(last)) path += "/";
  if (!path.endsWith("/")) path = path.replace(/[^/]+$/, "");
  return path + "WebStudio.apk";
}

function triggerApkDownload(url) {
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", "WebStudio.apk");
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function initDownloadPage() {
  const bar = document.getElementById("dlBar");
  const dialog = document.getElementById("dlDialog");
  const main = document.getElementById("dlMain");
  const skip = document.getElementById("dlSkip");
  const apkLink = document.getElementById("dlApk");
  const hint = document.getElementById("dlHint");
  if (!bar || !dialog || !main || !apkLink || dialog.dataset.ready === "1") return;
  dialog.dataset.ready = "1";
  let p = 8;
  function done() {
    dialog.style.display = "none";
    main.classList.add("is-on");
  }
  if (skip) skip.onclick = done;
  const t = setInterval(function () {
    p = Math.min(100, p + 8);
    bar.style.width = p + "%";
    if (p >= 100) {
      clearInterval(t);
      setTimeout(done, 200);
    }
  }, 160);
  const apk = resolveApkUrl();
  apkLink.href = apk;
  apkLink.setAttribute("download", "WebStudio.apk");
  apkLink.onclick = function (e) {
    e.preventDefault();
    startApkDownload(apk, apkLink, hint);
  };
  setTimeout(function () {
    startApkDownload(apk, apkLink, hint);
  }, 2800);
}

function startApkDownload(url, apkLink, hint) {
  fetch(url)
    .then(function (res) {
      if (!res.ok) throw new Error(String(res.status));
      return res.blob();
    })
    .then(function (blob) {
      if (blob.size < 1000 || /text\/html/i.test(blob.type)) {
        throw new Error("html");
      }
      const objectUrl = URL.createObjectURL(blob);
      apkLink.href = objectUrl;
      triggerApkDownload(objectUrl);
    })
    .catch(function () {
      apkLink.href = url;
      triggerApkDownload(url);
      if (hint) {
        hint.textContent =
          "Không tải được vì GitHub không có API tạo APK. Hãy tải file WebStudio.apk lên cùng thư mục với index.html, rồi bấm lại nút Tải tệp cài đặt.";
      }
    });
}

window.addEventListener("hashchange", showPage);
showPage();
`;

const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WebStudio - Thiết kế Website chuyên nghiệp</title>
  <meta
    name="description"
    content="Thiết kế Landing Page, Website công ty, Web bán hàng E-commerce và Website Startup SaaS chuyên nghiệp."
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
  <meta name="theme-color" content="#8f7cff" />
  <script>
    (function () {
      try {
        if (localStorage.getItem("webstudio-theme") === "light") {
          document.documentElement.classList.add("theme-light-pending");
        }
      } catch (e) {}
    })();
  </script>
  <style>
${css}
  </style>
</head>
<body>
  <script>
    if (document.documentElement.classList.contains("theme-light-pending")) {
      document.body.classList.add("theme-light");
      document.documentElement.classList.remove("theme-light-pending");
    }
  </script>
  <div id="top">
    ${header}

    <div id="sitePages">
${views}
    </div>

    ${footer}
  </div>

  <script>
${js}

${router}
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, "index.html"), html);

for (const page of pages) {
  if (page.file === "index.html") continue;
  fs.writeFileSync(
    path.join(root, page.file),
    `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0;url=index.html#${page.id}" />
  <title>${page.title}</title>
  <script>location.replace("index.html#${page.id}");</script>
</head>
<body>
  <p><a href="index.html#${page.id}">Chuyển tới trang…</a></p>
</body>
</html>
`,
  );
}

console.log("Da gop tat ca trang vao index.html");
