import { SITE_TYPES, TYPE_TEMPLATE, type SiteTypeId } from "./app-khach";

export type FieldType = "text" | "textarea" | "tel" | "url" | "select";

export type BlockField = {
  key: string;
  label: string;
  type: FieldType;
  max: number;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
};

export type BlockDef = {
  id: string;
  title: string;
  hint: string;
  fields: BlockField[];
};

export const COMPOSE_BLOCKS: BlockDef[] = [
  {
    id: "site_type",
    title: "Loại website",
    hint: "Landing, công ty, SaaS hoặc bán hàng",
    fields: [
      {
        key: "typeId",
        label: "Loại website",
        type: "select",
        max: 20,
        required: true,
        options: SITE_TYPES.map((t) => ({ value: t.id, label: t.name })),
      },
    ],
  },
  {
    id: "hero",
    title: "Hero + giá",
    hint: "Tiêu đề, mô tả, giá, nút mua",
    fields: [
      {
        key: "headline",
        label: "Tiêu đề",
        type: "textarea",
        max: 90,
        required: true,
        placeholder: "Da hết mụn, sáng mịn 14 ngày",
      },
      {
        key: "lead",
        label: "Mô tả",
        type: "textarea",
        max: 160,
        required: true,
        placeholder: "Tinh chất dưỡng đêm, thấm nhanh...",
      },
      {
        key: "price",
        label: "Giá",
        type: "text",
        max: 20,
        required: true,
        placeholder: "449.000đ",
      },
      {
        key: "cta",
        label: "Nút mua",
        type: "text",
        max: 24,
        required: true,
        placeholder: "Mua ngay",
      },
    ],
  },
  {
    id: "products",
    title: "Thông tin sản phẩm",
    hint: "Thêm từng sản phẩm: tên, mô tả, giá, nút mua",
    fields: [
      {
        key: "items",
        label: "Danh sách sản phẩm",
        type: "text",
        max: 8000,
      },
    ],
  },
  {
    id: "benefits",
    title: "Lợi ích",
    hint: "3 ý khách nhớ được",
    fields: [
      {
        key: "b1",
        label: "Lợi ích 1",
        type: "text",
        max: 60,
        required: true,
        placeholder: "Không kích ứng",
      },
      {
        key: "b2",
        label: "Lợi ích 2",
        type: "text",
        max: 60,
        placeholder: "Thấm nhanh, không bết",
      },
      {
        key: "b3",
        label: "Lợi ích 3",
        type: "text",
        max: 60,
        placeholder: "Freeship COD",
      },
    ],
  },
  {
    id: "reviews",
    title: "Đánh giá",
    hint: "1 review điển hình",
    fields: [
      {
        key: "quote",
        label: "Nội dung đánh giá",
        type: "textarea",
        max: 180,
        required: true,
        placeholder: "Dùng 1 tuần da dịu hẳn...",
      },
      {
        key: "author",
        label: "Tên khách",
        type: "text",
        max: 40,
        required: true,
        placeholder: "Lan, 28 tuổi",
      },
      {
        key: "rating",
        label: "Số sao (1–5)",
        type: "text",
        max: 1,
        placeholder: "5",
      },
    ],
  },
  {
    id: "cta_form",
    title: "Form / CTA",
    hint: "SĐT và Zalo — bắt buộc",
    fields: [
      {
        key: "phone",
        label: "Số điện thoại",
        type: "tel",
        max: 12,
        required: true,
        placeholder: "0900000000",
      },
      {
        key: "zalo",
        label: "Zalo",
        type: "tel",
        max: 12,
        required: true,
        placeholder: "0900000000",
      },
    ],
  },
];

export const COMPANY_BLOCKS: BlockDef[] = [
  {
    id: "home",
    title: "Trang chủ",
    hint: "Tên công ty, slogan, nút liên hệ",
    fields: [
      {
        key: "name",
        label: "Tên công ty",
        type: "text",
        max: 60,
        required: true,
        placeholder: "Nova Legal",
      },
      {
        key: "tagline",
        label: "Câu giới thiệu",
        type: "textarea",
        max: 140,
        required: true,
        placeholder: "Tư vấn pháp lý cho doanh nghiệp",
      },
      {
        key: "cta",
        label: "Nút liên hệ",
        type: "text",
        max: 24,
        required: true,
        placeholder: "Nhận tư vấn",
      },
    ],
  },
  {
    id: "services",
    title: "Dịch vụ",
    hint: "3 dịch vụ chính",
    fields: [
      {
        key: "s1",
        label: "Dịch vụ 1",
        type: "text",
        max: 60,
        required: true,
        placeholder: "Tư vấn hợp đồng",
      },
      {
        key: "s2",
        label: "Dịch vụ 2",
        type: "text",
        max: 60,
        placeholder: "Lao động — nhân sự",
      },
      {
        key: "s3",
        label: "Dịch vụ 3",
        type: "text",
        max: 60,
        placeholder: "Tranh chấp dân sự",
      },
    ],
  },
  {
    id: "about",
    title: "Về chúng tôi",
    hint: "Giới thiệu ngắn và năm thành lập",
    fields: [
      {
        key: "story",
        label: "Giới thiệu",
        type: "textarea",
        max: 280,
        required: true,
        placeholder: "Đội ngũ luật sư đồng hành cùng SME...",
      },
      {
        key: "year",
        label: "Năm thành lập",
        type: "text",
        max: 4,
        placeholder: "2018",
      },
    ],
  },
  {
    id: "contact",
    title: "Liên hệ",
    hint: "SĐT và Zalo — bắt buộc",
    fields: [
      {
        key: "address",
        label: "Địa chỉ",
        type: "text",
        max: 80,
        required: true,
        placeholder: "Quận 1, TP.HCM",
      },
      {
        key: "phone",
        label: "Số điện thoại",
        type: "tel",
        max: 12,
        required: true,
        placeholder: "0900000000",
      },
      {
        key: "zalo",
        label: "Zalo",
        type: "tel",
        max: 12,
        required: true,
        placeholder: "0900000000",
      },
      {
        key: "email",
        label: "Email",
        type: "text",
        max: 60,
        placeholder: "hello@congty.vn",
      },
      {
        key: "hours",
        label: "Giờ làm việc",
        type: "text",
        max: 40,
        placeholder: "T2–T6, 8:30–17:30",
      },
    ],
  },
];

export const SAAS_BLOCKS: BlockDef[] = [
  {
    id: "saas_hero",
    title: "Hero sản phẩm",
    hint: "Tên sản phẩm, tiêu đề, nút dùng thử",
    fields: [
      {
        key: "product",
        label: "Tên sản phẩm",
        type: "text",
        max: 40,
        required: true,
        placeholder: "Pulse Analytics",
      },
      {
        key: "headline",
        label: "Tiêu đề",
        type: "textarea",
        max: 90,
        required: true,
        placeholder: "Xem số liệu bán hàng trên một màn hình",
      },
      {
        key: "cta",
        label: "Nút dùng thử",
        type: "text",
        max: 24,
        required: true,
        placeholder: "Dùng thử 14 ngày",
      },
    ],
  },
  {
    id: "features",
    title: "Tính năng",
    hint: "3 tính năng bán hàng",
    fields: [
      {
        key: "f1",
        label: "Tính năng 1",
        type: "text",
        max: 60,
        required: true,
      },
      { key: "f2", label: "Tính năng 2", type: "text", max: 60 },
      { key: "f3", label: "Tính năng 3", type: "text", max: 60 },
    ],
  },
  {
    id: "pricing",
    title: "Bảng giá",
    hint: "1 gói nổi bật",
    fields: [
      {
        key: "plan",
        label: "Tên gói",
        type: "text",
        max: 30,
        required: true,
        placeholder: "Pro",
      },
      {
        key: "price",
        label: "Giá / tháng",
        type: "text",
        max: 20,
        required: true,
        placeholder: "299.000đ",
      },
      {
        key: "note",
        label: "Ghi chú",
        type: "text",
        max: 50,
        placeholder: "Hủy bất cứ lúc nào",
      },
    ],
  },
  {
    id: "signup",
    title: "Đăng ký",
    hint: "SĐT và Zalo — bắt buộc",
    fields: [
      {
        key: "placeholder",
        label: "Gợi ý ô email",
        type: "text",
        max: 40,
        placeholder: "you@congty.vn",
      },
      {
        key: "button",
        label: "Chữ nút",
        type: "text",
        max: 24,
        required: true,
        placeholder: "Tạo tài khoản",
      },
      {
        key: "phone",
        label: "Số điện thoại",
        type: "tel",
        max: 12,
        required: true,
        placeholder: "0900000000",
      },
      {
        key: "zalo",
        label: "Zalo",
        type: "tel",
        max: 12,
        required: true,
        placeholder: "0900000000",
      },
    ],
  },
];

export const SHOP_BLOCKS: BlockDef[] = [
  {
    id: "shop_home",
    title: "Trang chủ shop",
    hint: "Tên cửa hàng và dòng khuyến mãi",
    fields: [
      {
        key: "name",
        label: "Tên cửa hàng",
        type: "text",
        max: 40,
        required: true,
        placeholder: "Green Store",
      },
      {
        key: "promo",
        label: "Dòng khuyến mãi",
        type: "text",
        max: 60,
        placeholder: "Freeship đơn từ 199k",
      },
    ],
  },
  {
    id: "products",
    title: "Thông tin sản phẩm",
    hint: "Thêm từng sản phẩm: tên, mô tả, giá, nút mua",
    fields: [
      {
        key: "items",
        label: "Danh sách sản phẩm",
        type: "text",
        max: 8000,
      },
    ],
  },
  {
    id: "cart",
    title: "Giỏ hàng",
    hint: "Chữ khi giỏ trống và nút đặt hàng",
    fields: [
      {
        key: "empty",
        label: "Khi giỏ trống",
        type: "text",
        max: 50,
        placeholder: "Chưa có sản phẩm",
      },
      {
        key: "checkout",
        label: "Nút thanh toán",
        type: "text",
        max: 24,
        required: true,
        placeholder: "Đặt hàng",
      },
    ],
  },
  {
    id: "payment",
    title: "Thanh toán",
    hint: "SĐT và Zalo — bắt buộc",
    fields: [
      {
        key: "cod",
        label: "Bật COD?",
        type: "text",
        max: 8,
        placeholder: "Có",
      },
      {
        key: "bank",
        label: "STK / ngân hàng",
        type: "text",
        max: 80,
      },
      {
        key: "phone",
        label: "Số điện thoại",
        type: "tel",
        max: 12,
        required: true,
        placeholder: "0900000000",
      },
      {
        key: "zalo",
        label: "Zalo",
        type: "tel",
        max: 12,
        required: true,
        placeholder: "0900000000",
      },
    ],
  },
];

export const BLOCKS: Record<SiteTypeId, BlockDef[]> = {
  landing: COMPOSE_BLOCKS,
  company: COMPANY_BLOCKS,
  saas: SAAS_BLOCKS,
  ecommerce: SHOP_BLOCKS,
};

const AURA_SEED = {
  site_type: { typeId: "landing" },
  hero: {
    headline: "Da hết mụn, sáng mịn 14 ngày — cho da dầu, không kích ứng.",
    lead: "AURA Glow Essence 30ml: niacinamide 5% + peptide.",
    price: "449.000đ",
    cta: "Mua ngay",
  },
  products: {
    items: JSON.stringify([
      {
        name: "AURA Glow Essence 30ml",
        desc: "Niacinamide 5% + peptide, thấm nhanh, không kích ứng.",
        price: "449.000đ",
        cta: "Mua ngay",
      },
    ]),
  },
  benefits: {
    b1: "COD — trả khi nhận",
    b2: "Freeship toàn quốc",
    b3: "Đổi trả 7 ngày",
  },
  reviews: {
    quote: "Dùng 10 ngày mụn ẩn giảm rõ, không khô da.",
    author: "Minh Anh, 26 tuổi",
    rating: "5",
  },
  cta_form: {
    phone: "0900000000",
    zalo: "0900000000",
  },
};

export const DEFAULT_VALUES: Record<
  string,
  Record<string, Record<string, string>>
> = {
  aura: AURA_SEED,
  event: {
    site_type: { typeId: "landing" },
    hero: {
      headline: "Open Day — mở cửa miễn phí cuối tuần này.",
      lead: "Workshop thực hành, gặp mentor, nhận tài liệu.",
      price: "0đ",
      cta: "Đăng ký chỗ",
    },
    benefits: {
      b1: "Miễn phí tham dự",
      b2: "Quà tặng tại chỗ",
      b3: "Giữ chỗ trước 24h",
    },
    reviews: {
      quote: "Buổi trước rất đáng, mình đăng ký lại ngay.",
      author: "Hà, 24 tuổi",
      rating: "5",
    },
    cta_form: { phone: "0900000000", zalo: "0900000000" },
  },
  nova: {
    site_type: { typeId: "company" },
    home: {
      name: "Nova Legal",
      tagline: "Tư vấn pháp lý cho doanh nghiệp vừa và nhỏ.",
      cta: "Nhận tư vấn",
    },
    services: {
      s1: "Tư vấn hợp đồng",
      s2: "Lao động — nhân sự",
      s3: "Tranh chấp dân sự",
    },
    about: {
      story: "Đội ngũ luật sư đồng hành cùng SME, nói chuyện dễ hiểu, báo giá trước khi làm.",
      year: "2018",
    },
    contact: {
      address: "Quận 1, TP.HCM",
      phone: "0900000000",
      zalo: "0900000000",
      email: "hello@novalegal.vn",
      hours: "T2–T6, 8:30–17:30",
    },
  },
  build: {
    site_type: { typeId: "company" },
    home: {
      name: "KienBuild",
      tagline: "Thiết kế — thi công nhà phố và nội thất.",
      cta: "Nhận báo giá",
    },
    services: {
      s1: "Thiết kế kiến trúc",
      s2: "Thi công trọn gói",
      s3: "Nội thất",
    },
    about: {
      story: "Bàn giao đúng tiến độ, bảo hành 24 tháng, khảo sát miễn phí.",
      year: "2015",
    },
    contact: {
      address: "Thủ Đức, TP.HCM",
      phone: "0900000000",
      zalo: "0900000000",
      hours: "T2–T7, 8:00–17:00",
    },
  },
  pulse: {
    site_type: { typeId: "saas" },
    saas_hero: {
      product: "Pulse Analytics",
      headline: "Xem số liệu bán hàng trên một màn hình.",
      cta: "Dùng thử",
    },
    features: {
      f1: "Gắn Google & Facebook",
      f2: "Báo cáo mỗi sáng",
      f3: "Hủy bất cứ lúc nào",
    },
    pricing: {
      plan: "Pro",
      price: "299.000đ/tháng",
      note: "Hủy bất cứ lúc nào",
    },
    signup: {
      placeholder: "you@congty.vn",
      button: "Tạo tài khoản",
      phone: "0900000000",
      zalo: "0900000000",
    },
  },
  flow: {
    site_type: { typeId: "saas" },
    saas_hero: {
      product: "Flow CRM",
      headline: "CRM đơn giản cho đội bán hàng nhỏ.",
      cta: "Dùng thử 14 ngày",
    },
    features: {
      f1: "Không cần đào tạo lâu",
      f2: "Nhắc follow-up tự động",
      f3: "Xuất Excel 1 chạm",
    },
    pricing: {
      plan: "Starter",
      price: "199.000đ/tháng",
      note: "Dùng thử 14 ngày",
    },
    signup: {
      placeholder: "you@congty.vn",
      button: "Tạo tài khoản",
      phone: "0900000000",
      zalo: "0900000000",
    },
  },
  green: {
    site_type: { typeId: "ecommerce" },
    shop_home: {
      name: "Green Store",
      promo: "Rau củ organic, giao trong ngày.",
    },
    products: {
      items: JSON.stringify([
        {
          name: "Rau củ theo mùa",
          desc: "Tươi mỗi sáng, đóng gói lạnh.",
          price: "89.000đ",
          cta: "Mua ngay",
        },
      ]),
    },
    cart: { empty: "Chưa có sản phẩm", checkout: "Đặt hàng" },
    payment: {
      cod: "Có",
      bank: "",
      phone: "0900000000",
      zalo: "0900000000",
    },
  },
  mode: {
    site_type: { typeId: "ecommerce" },
    shop_home: {
      name: "Mode Apparel",
      promo: "Đồ basic mặc mỗi ngày — đổi size 7 ngày.",
    },
    products: {
      items: JSON.stringify([
        {
          name: "Áo thun basic",
          desc: "Vải mát, form chuẩn Á.",
          price: "249.000đ",
          cta: "Mua ngay",
        },
      ]),
    },
    cart: { empty: "Chưa có sản phẩm", checkout: "Đặt hàng" },
    payment: {
      cod: "Có",
      phone: "0900000000",
      zalo: "0900000000",
    },
  },
};

export function blocksForType(typeId?: SiteTypeId) {
  if (typeId === "company") return COMPANY_BLOCKS;
  if (typeId === "saas") return SAAS_BLOCKS;
  if (typeId === "ecommerce") return SHOP_BLOCKS;
  return COMPOSE_BLOCKS;
}

export function contentBlocksForType(typeId?: SiteTypeId) {
  return blocksForType(typeId).filter((b) => b.id !== "site_type");
}

function filledVsSeed(value: string | undefined, seed?: string) {
  const v = (value ?? "").trim();
  if (!v) return false;
  if (seed && v === seed.trim()) return false;
  return true;
}

/** Giá trị thật; chữ mẫu chỉ dùng làm placeholder, không điền sẵn vào ô. */
export function editableValue(value: string | undefined, seed?: string) {
  if (!filledVsSeed(value, seed)) return "";
  return value ?? "";
}

export function editableProductsJson(raw: string | undefined, seedRaw?: string) {
  if (!raw?.trim() || (seedRaw && raw.trim() === seedRaw.trim())) {
    return JSON.stringify([emptyProduct()]);
  }
  const items = parseProducts(raw);
  if (!items.some((p) => p.name.trim() || p.price.trim() || p.desc.trim())) {
    return JSON.stringify([emptyProduct()]);
  }
  return raw;
}

export function draftChecksForType(
  typeId: SiteTypeId,
  blocks: Record<string, Record<string, string>>,
  templateId?: string,
) {
  const tplId = templateId || TYPE_TEMPLATE[typeId];
  const seed = DEFAULT_VALUES[tplId] ?? {};
  return contentBlocksForType(typeId).map((block) => {
    let done = false;
    if (block.id === "products") {
      const raw = blocks.products?.items;
      const seedRaw = seed.products?.items;
      const items = parseProducts(raw);
      done =
        items.some((p) => p.name.trim() && p.price.trim()) &&
        (raw || "").trim() !== (seedRaw || "").trim();
    } else {
      const keys = block.fields.filter((f) => f.required);
      const check = keys.length ? keys : block.fields.slice(0, 1);
      done = check.every((field) =>
        filledVsSeed(
          blocks[block.id]?.[field.key],
          seed[block.id]?.[field.key],
        ),
      );
    }
    return { id: block.id, label: block.title, done };
  });
}

export function findBlock(typeId: SiteTypeId | undefined, khoi: string) {
  return (
    blocksForType(typeId).find((b) => b.id === khoi) ??
    COMPOSE_BLOCKS.find((b) => b.id === khoi) ??
    COMPANY_BLOCKS.find((b) => b.id === khoi) ??
    SAAS_BLOCKS.find((b) => b.id === khoi) ??
    SHOP_BLOCKS.find((b) => b.id === khoi)
  );
}

export type ProductItem = {
  name: string;
  desc: string;
  price: string;
  cta: string;
};

export function emptyProduct(): ProductItem {
  return { name: "", desc: "", price: "", cta: "" };
}

export function parseProducts(raw: string | undefined): ProductItem[] {
  if (!raw?.trim()) return [emptyProduct()];
  try {
    const data = JSON.parse(raw) as ProductItem[];
    if (!Array.isArray(data) || data.length === 0) return [emptyProduct()];
    return data.map((item) => ({
      name: item.name ?? "",
      desc: item.desc ?? "",
      price: item.price ?? "",
      cta: item.cta ?? "Mua ngay",
    }));
  } catch {
    return [emptyProduct()];
  }
}
