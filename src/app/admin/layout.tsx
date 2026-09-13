import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: "Admin WebStudio",
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
