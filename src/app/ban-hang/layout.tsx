import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/sales-landing.css";

export const metadata: Metadata = {
  title: "AURA Glow Essence — Da sáng mịn 14 ngày",
  description:
    "Tinh chất dưỡng đêm cho da dầu mụn. Giá ưu đãi 449.000đ, COD freeship toàn quốc, đổi trả 7 ngày.",
};

export default function SalesLayout({ children }: { children: ReactNode }) {
  return children;
}
