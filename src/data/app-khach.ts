export const SITE_TYPES = [
  {
    id: "landing",
    name: "Landing Page",
    short: "Landing",
    blurb: "1 trang, chạy ads, thu lead, bán 1 sản phẩm.",
    pages: "1 trang",
    sections: ["Hero + giá", "Lợi ích", "Đánh giá", "Form / CTA"],
  },
  {
    id: "company",
    name: "Website công ty",
    short: "Công ty",
    blurb: "Giới thiệu doanh nghiệp, dịch vụ, đội ngũ, liên hệ.",
    pages: "5–8 trang",
    sections: ["Trang chủ", "Dịch vụ", "Về chúng tôi", "Liên hệ"],
  },
  {
    id: "saas",
    name: "Website Startup / SaaS",
    short: "SaaS",
    blurb: "Giới thiệu sản phẩm, bảng giá, đăng ký dùng thử.",
    pages: "Marketing + app",
    sections: ["Hero sản phẩm", "Tính năng", "Pricing", "Đăng ký"],
  },
  {
    id: "ecommerce",
    name: "Web bán hàng / E-commerce",
    short: "Bán hàng",
    blurb: "Danh mục, sản phẩm, giỏ hàng, đặt hàng COD.",
    pages: "Shop",
    sections: ["Trang chủ shop", "Sản phẩm", "Giỏ hàng", "Thanh toán"],
  },
] as const;

export type SiteTypeId = (typeof SITE_TYPES)[number]["id"];

export const TYPE_TEMPLATE: Record<SiteTypeId, string> = {
  landing: "aura",
  company: "nova",
  saas: "pulse",
  ecommerce: "green",
};

export const TEMPLATES = [
  {
    id: "aura",
    type: "landing" as SiteTypeId,
    name: "AURA Glow",
    use: "Mỹ phẩm / skincare",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "event",
    type: "landing" as SiteTypeId,
    name: "Open Day",
    use: "Sự kiện / workshop",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "nova",
    type: "company" as SiteTypeId,
    name: "Nova Legal",
    use: "Văn phòng / dịch vụ",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "build",
    type: "company" as SiteTypeId,
    name: "KienBuild",
    use: "Xây dựng / nội thất",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pulse",
    type: "saas" as SiteTypeId,
    name: "Pulse Analytics",
    use: "SaaS dashboard",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "flow",
    type: "saas" as SiteTypeId,
    name: "Flow CRM",
    use: "Startup B2B",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "green",
    type: "ecommerce" as SiteTypeId,
    name: "Green Store",
    use: "Tạp hóa / organic",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "mode",
    type: "ecommerce" as SiteTypeId,
    name: "Mode Apparel",
    use: "Thời trang",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
  },
] as const;

export const DRAFT_SITE = {
  name: "AURA Glow Essence",
  typeId: "landing" as SiteTypeId,
  domain: "aura.webstudio.vn",
  progress: 62,
  image: TEMPLATES[0].image,
  checks: [
    { id: "hero", label: "Tiêu đề & giá Hero", done: true },
    { id: "phone", label: "Số điện thoại / Zalo", done: true },
    { id: "gallery", label: "Ảnh gallery", done: false },
    { id: "cta", label: "Nút đặt hàng (CTA)", done: false },
  ],
};
