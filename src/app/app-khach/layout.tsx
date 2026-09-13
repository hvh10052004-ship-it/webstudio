import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppKhachProviders } from "@/components/app-khach/AppKhachProviders";
import "@/styles/app-khach.css";

export const metadata: Metadata = {
  title: "App WebStudio — Tạo website trên điện thoại",
  description:
    "Tự tạo Landing Page, website công ty, SaaS và web bán hàng. Nhiều người cùng soạn, lưu SQLite.",
  appleWebApp: {
    capable: true,
    title: "WebStudio",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/app-khach-192.png",
    icon: [
      { url: "/icons/app-khach-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/app-khach-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function AppKhachLayout({ children }: { children: ReactNode }) {
  return <AppKhachProviders>{children}</AppKhachProviders>;
}
