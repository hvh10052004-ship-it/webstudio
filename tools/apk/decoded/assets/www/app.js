(function () {
  var TYPES = [
    { id: "landing", name: "Landing Page", blurb: "1 trang, chạy ads, thu lead, bán 1 sản phẩm." },
    { id: "company", name: "Website công ty", blurb: "Giới thiệu doanh nghiệp, dịch vụ, đội ngũ, liên hệ." },
    { id: "saas", name: "Website Startup / SaaS", blurb: "Giới thiệu sản phẩm, bảng giá, đăng ký dùng thử." },
    { id: "ecommerce", name: "Web bán hàng / E-commerce", blurb: "Danh mục, sản phẩm, giỏ hàng, đặt hàng COD." },
  ];
  var MAU = [
    { id: "aura", type: "landing", name: "AURA Glow", use: "Mỹ phẩm / skincare" },
    { id: "event", type: "landing", name: "Open Day", use: "Sự kiện / workshop" },
    { id: "nova", type: "company", name: "Nova Legal", use: "Văn phòng / dịch vụ" },
    { id: "build", type: "company", name: "KienBuild", use: "Xây dựng / nội thất" },
    { id: "pulse", type: "saas", name: "Pulse Analytics", use: "SaaS dashboard" },
    { id: "flow", type: "saas", name: "Flow CRM", use: "Startup B2B" },
    { id: "green", type: "ecommerce", name: "Green Store", use: "Tạp hóa / organic" },
    { id: "mode", type: "ecommerce", name: "Mode Apparel", use: "Thời trang" },
  ];
  var TABS = [
    { id: "home", href: "home.html", label: "Trang chủ", svg: '<path d="M3 10l7-7 7 7"/><path d="M5 9v8h10V9"/>' },
    { id: "mau", href: "mau.html", label: "Mẫu", svg: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="11" y="3" width="6" height="6" rx="1"/><rect x="3" y="11" width="6" height="6" rx="1"/><rect x="11" y="11" width="6" height="6" rx="1"/>' },
    { id: "soan", href: "soan.html", label: "Soạn", svg: '<path d="M4 16l9-9 3 3-9 9H4v-3z"/>' },
    { id: "chat", href: "chat.html", label: "Chat", svg: '<path d="M4 5h12v8H8l-4 3V5z"/>' },
    { id: "xem", href: "xem.html", label: "Xem", svg: '<path d="M3 10s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"/><circle cx="10" cy="10" r="2"/>' },
    { id: "toi", href: "toi.html", label: "Tôi", svg: '<circle cx="10" cy="7" r="3"/><path d="M4 17c1.5-3 10.5-3 12 0"/>' },
  ];

  function get(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return fallback;
  }
  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }
  function typeId() {
    return get("ws_home_type", "landing");
  }
  function typeOf(id) {
    for (var i = 0; i < TYPES.length; i++) if (TYPES[i].id === id) return TYPES[i];
    return TYPES[0];
  }
  function param(name) {
    var q = location.search.replace(/^\?/, "").split("&");
    for (var i = 0; i < q.length; i++) {
      var p = q[i].split("=");
      if (decodeURIComponent(p[0] || "") === name) return decodeURIComponent(p[1] || "");
    }
    return "";
  }

  function tabbar() {
    var on = document.body.getAttribute("data-tab") || "home";
    var phone = document.querySelector(".app-phone");
    if (!phone) return;
    var nav = document.createElement("nav");
    nav.className = "app-tabbar";
    nav.setAttribute("aria-label", "Điều hướng app");
    var html = "";
    for (var i = 0; i < TABS.length; i++) {
      var t = TABS[i];
      html +=
        '<a class="app-tab' +
        (t.id === on ? " is-on" : "") +
        '" href="' +
        t.href +
        '"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">' +
        t.svg +
        "</svg>" +
        t.label +
        "</a>";
    }
    nav.innerHTML = html;
    phone.appendChild(nav);
  }

  function initHome() {
    var grid = document.getElementById("typeGrid");
    if (!grid) return;
    var picked = typeId();
    var cards = grid.querySelectorAll("[data-type]");
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var id = card.getAttribute("data-type");
      if (id === picked) card.classList.add("is-on");
      card.addEventListener("click", function (ev) {
        ev.preventDefault();
        var next = this.getAttribute("data-type");
        set("ws_home_type", next);
        location.href = "mau.html?loai=" + encodeURIComponent(next);
      });
    }
    var t = typeOf(picked);
    var nameEl = document.getElementById("draftName");
    var metaEl = document.getElementById("draftMeta");
    if (nameEl) nameEl.textContent = t.name;
    if (metaEl) metaEl.textContent = t.name + " · soạn trên điện thoại";
  }

  function initMau() {
    var loai = param("loai") || typeId();
    set("ws_home_type", loai);
    var chips = document.getElementById("chips");
    var grid = document.getElementById("mauGrid");
    if (!chips || !grid) return;
    var chipHtml =
      '<a class="app-chip' +
      (!param("loai") ? " is-on" : "") +
      '" href="mau.html">Tất cả</a>';
    for (var i = 0; i < TYPES.length; i++) {
      var t = TYPES[i];
      chipHtml +=
        '<a class="app-chip' +
        (loai === t.id && param("loai") ? " is-on" : "") +
        '" href="mau.html?loai=' +
        t.id +
        '">' +
        t.name.replace("Website ", "").replace("Web ", "") +
        "</a>";
    }
    chips.innerHTML = chipHtml;
    var filter = param("loai");
    var html = "";
    for (var j = 0; j < MAU.length; j++) {
      var m = MAU[j];
      if (filter && m.type !== filter) continue;
      html +=
        '<a class="app-mau-card" href="soan.html?loai=' +
        m.type +
        "&mau=" +
        m.id +
        '"><span class="app-mau-thumb t-' +
        m.type +
        '"></span><strong>' +
        m.name +
        "</strong><span>" +
        m.use +
        "</span></a>";
    }
    grid.innerHTML = html;
  }

  function initSoan() {
    var loai = param("loai") || typeId();
    set("ws_home_type", loai);
    if (param("mau")) set("ws_mau", param("mau"));
    var t = typeOf(loai);
    var title = document.getElementById("soanTitle");
    if (title) title.textContent = "Soạn " + t.name;
    var draft = get("ws_draft", {});
    var form = document.getElementById("soanForm");
    if (!form) return;
    ["name", "phone", "desc", "cta"].forEach(function (k) {
      if (form[k] && draft[k]) form[k].value = draft[k];
    });
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      set("ws_draft", {
        type: loai,
        name: form.name.value.trim() || t.name,
        phone: form.phone.value.trim(),
        desc: form.desc.value.trim(),
        cta: form.cta.value.trim() || "Liên hệ ngay",
      });
      location.href = "xem.html";
    });
  }

  function initXem() {
    var draft = get("ws_draft", {});
    var t = typeOf(draft.type || typeId());
    var name = draft.name || t.name;
    var desc =
      draft.desc ||
      "Nội dung mẫu — điền form Soạn để thay tiêu đề, mô tả và nút liên hệ.";
    var phone = draft.phone || "0938 002 776";
    var cta = draft.cta || "Liên hệ ngay";
    var mount = document.getElementById("preview");
    if (!mount) return;
    mount.innerHTML =
      '<p class="pv-kicker">' +
      t.name +
      "</p><h2>" +
      name +
      "</h2><p class='pv-desc'>" +
      desc +
      '</p><a class="app-btn app-btn-primary" href="tel:' +
      phone.replace(/\s/g, "") +
      '">' +
      cta +
      "</a><p class='app-note'>Đây là bản xem trước trên điện thoại. Bấm Soạn để sửa nội dung.</p>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    tabbar();
    var page = document.body.getAttribute("data-tab") || "home";
    if (page === "home") initHome();
    if (page === "mau") initMau();
    if (page === "soan") initSoan();
    if (page === "xem") initXem();
  });
})();
