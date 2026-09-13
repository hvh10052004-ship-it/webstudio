"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-khach/AppShell";
import { useCollab } from "@/components/app-khach/CollabProvider";

const TYPE_LABELS = [
  {
    id: "landing" as const,
    title: "Landing Page",
    hint: "1 trang bán sản phẩm, thu lead",
  },
  {
    id: "company" as const,
    title: "Website công ty",
    hint: "Giới thiệu doanh nghiệp và dịch vụ",
  },
  {
    id: "saas" as const,
    title: "Website Startup / SaaS",
    hint: "Sản phẩm, bảng giá, đăng ký dùng thử",
  },
  {
    id: "ecommerce" as const,
    title: "Web bán hàng / E-commerce",
    hint: "Danh mục, sản phẩm, đặt hàng COD",
  },
];

export function SoanList() {
  return (
    <AppShell active="soan">
      <header className="app-home-top">
        <div>
          <h1>Soạn thông tin website</h1>
          <p>Chọn loại website để bắt đầu — mỗi loại lưu riêng</p>
        </div>
      </header>

      <ol className="app-soan-list">
        {TYPE_LABELS.map((type, i) => (
          <li key={type.id}>
            <Link
              href={`/app-khach/soan/noi-dung?loai=${type.id}`}
              className="app-soan-item"
            >
              <span className="app-soan-idx">{i + 1}</span>
              <div>
                <strong>{type.title}</strong>
                <p>{type.hint}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </AppShell>
  );
}
