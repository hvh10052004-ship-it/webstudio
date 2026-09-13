import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/tai-ung-dung.css";

export const metadata: Metadata = {
  title: "Tải WebStudio — App khách",
  description: "Tải ứng dụng khách WebStudio về điện thoại để chạy thử.",
};

export default function DownloadLayout({ children }: { children: ReactNode }) {
  return children;
}
