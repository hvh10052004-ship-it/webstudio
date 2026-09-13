"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, ReactNode } from "react";
import {
  IconChat,
  IconHome,
  IconPage,
  IconUser,
  IconWrench,
} from "@/components/app-khach/AppIcons";
import { AdminPhone } from "./AdminPhone";

const NAV: {
  href: string;
  label: string;
  Icon: ComponentType<{ size?: number }>;
}[] = [
  { href: "/admin", label: "Tổng quan", Icon: IconHome },
  { href: "/admin/khach", label: "Khách", Icon: IconUser },
  { href: "/admin/sites", label: "Site", Icon: IconPage },
  { href: "/admin/chat", label: "Chat", Icon: IconChat },
  { href: "/admin/cai-dat", label: "Cài đặt", Icon: IconWrench },
];

export function AdminShell({
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  const path = usePathname();
  const chat = path === "/admin/chat";

  function tabOn(href: string) {
    if (href === "/admin") return path === "/admin";
    return path === href || path.startsWith(`${href}/`);
  }

  return (
    <AdminPhone
      chat={chat}
      footer={
        <nav className="admin-tabbar" aria-label="Điều hướng admin">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-tab${tabOn(item.href) ? " is-on" : ""}`}
            >
              <span className="admin-tab-icon">
                <item.Icon size={18} />
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      }
    >
      <div className="admin-main">{children}</div>
    </AdminPhone>
  );
}
