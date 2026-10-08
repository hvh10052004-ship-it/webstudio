import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WebStudio — App khách",
    short_name: "WebStudio",
    description:
      "Tạo Landing Page, website công ty, SaaS và web bán hàng trên điện thoại.",
    start_url: process.env.NEXT_PUBLIC_APP_KHACH_SERVER === "1" ? "/" : "/app-khach",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4f1ec",
    theme_color: "#5b4bdd",
    lang: "vi",
    icons: [
      {
        src: "/icons/app-khach-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/app-khach-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/app-khach-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
