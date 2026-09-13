"use client";

import Link from "next/link";
import {
  IconChat,
  IconEdit,
  IconEye,
  IconGrid,
  IconHome,
  IconUser,
} from "./AppIcons";
import { saveLastTab } from "./session-client";

export type AppTab = "home" | "mau" | "soan" | "chat" | "xem" | "toi";

const TABS = [
  { id: "home" as const, href: "/app-khach", label: "Trang chủ", Icon: IconHome },
  { id: "mau" as const, href: "/app-khach/mau", label: "Mẫu", Icon: IconGrid },
  { id: "soan" as const, href: "/app-khach/soan", label: "Soạn", Icon: IconEdit },
  { id: "chat" as const, href: "/app-khach/chat", label: "Chat", Icon: IconChat },
  { id: "xem" as const, href: "/app-khach/xem", label: "Xem", Icon: IconEye },
  { id: "toi" as const, href: "/app-khach/toi", label: "Tôi", Icon: IconUser },
];

export function AppTabBar({ active }: { active: AppTab }) {
  return (
    <nav className="app-tabbar" aria-label="Điều hướng app">
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={`app-tab${active === tab.id ? " is-on" : ""}`}
          onClick={() => saveLastTab(tab.href)}
        >
          <span className="app-tab-icon">
            <tab.Icon size={20} />
          </span>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
