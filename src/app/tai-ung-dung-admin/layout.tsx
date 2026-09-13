import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/tai-ung-dung.css";

export const metadata: Metadata = {
  title: "Tải WebStudio Admin — App quản trị",
  description: "Tải ứng dụng quản trị WebStudio về điện thoại Android.",
};

export default function DownloadAdminLayout({ children }: { children: ReactNode }) {
  return children;
}
