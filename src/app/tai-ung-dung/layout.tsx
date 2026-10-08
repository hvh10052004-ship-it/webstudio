import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Tải App khách Studio — WebStudio",
  description:
    "Tải ứng dụng khách WebStudio về Android để soạn website, xem trước và chat hỗ trợ.",
};

export default function DownloadLayout({ children }: { children: ReactNode }) {
  return children;
}
