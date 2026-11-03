import type { Metadata, Viewport } from "next";
import { isAppKhachServer } from "@/lib/appKhachServer";
import "./globals.css";
import "@/styles/webstudio.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#5b4bdd",
};

export const metadata: Metadata = {
  title: "WebStudio - Thiết kế Website chuyên nghiệp",
  description:
    "Thiết kế Landing Page, Website công ty, Web bán hàng E-commerce và Website Startup SaaS chuyên nghiệp.",
  appleWebApp: {
    capable: true,
    title: "WebStudio",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/app-khach-192.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const native = isAppKhachServer() ? " app-native" : "";
  return (
    <html lang="vi" className={native} style={{ ["--font-inter" as string]: "Inter, system-ui, sans-serif" }}>
      <body>{children}</body>
    </html>
  );
}
