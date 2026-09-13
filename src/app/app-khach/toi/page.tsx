"use client";

import { useState, type ComponentType } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-khach/AppShell";
import { AuthGate } from "@/components/app-khach/AuthGate";
import { useCollab } from "@/components/app-khach/CollabProvider";
import { useTheme } from "@/components/app-khach/ThemeProvider";
import { formatVietnam } from "@/lib/vietnam-time";
import {
  IconChevron,
  IconInfo,
  IconKey,
  IconLogout,
  IconPalette,
  IconShield,
  IconUser,
  IconWrench,
} from "@/components/app-khach/AppIcons";

type MenuId =
  | "profile"
  | "appearance"
  | "privacy"
  | "account"
  | "developer"
  | "about";

const MENU: {
  id: MenuId;
  label: string;
  Icon: ComponentType<{ size?: number }>;
}[] = [
  { id: "profile", label: "Hồ sơ", Icon: IconUser },
  { id: "appearance", label: "Giao diện", Icon: IconPalette },
  { id: "privacy", label: "Quyền riêng tư", Icon: IconShield },
  { id: "account", label: "Tài khoản và bảo mật", Icon: IconKey },
  { id: "developer", label: "Nhà phát triển", Icon: IconWrench },
  { id: "about", label: "Giới thiệu", Icon: IconInfo },
];

export function AccountPanel() {
  const { data, logout } = useCollab();
  const { theme, setThemeAt } = useTheme();
  const [open, setOpen] = useState<"appearance" | null>(null);

  if (!data) return null;

  const letter = (data.user.nickname || data.user.name)
    .slice(0, 1)
    .toUpperCase();

  return (
    <div className="app-settings">
      <header className="app-settings-head">
        <Link href="/app-khach/toi/ho-so" className="app-settings-head-link">
          {data.user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="app-settings-avatar-img"
              src={data.user.avatarUrl}
              alt=""
            />
          ) : (
            <div className="app-settings-avatar">{letter}</div>
          )}
          <div className="app-settings-who">
            <strong>{data.user.nickname || data.user.name}</strong>
            <span>
              {data.site.name} · {data.site.inviteCode}
            </span>
            {data.user.lastLoginAt ? (
              <span>
                Đăng nhập: {formatVietnam(data.user.lastLoginAt)} (GMT+7)
              </span>
            ) : null}
          </div>
        </Link>
        <button
          type="button"
          className="app-settings-logout"
          aria-label="Đăng xuất"
          onClick={() => void logout()}
        >
          <IconLogout size={18} />
        </button>
      </header>

      <div className="app-settings-list">
        {MENU.map((item) =>
          item.id === "account" ||
          item.id === "profile" ||
          item.id === "privacy" ||
          item.id === "developer" ||
          item.id === "about" ? (
            <Link
              key={item.id}
              href={
                item.id === "account"
                  ? "/app-khach/toi/tai-khoan"
                  : item.id === "privacy"
                    ? "/app-khach/toi/quyen-rieng-tu"
                    : item.id === "developer"
                      ? "/app-khach/toi/nha-phat-trien"
                      : item.id === "about"
                        ? "/app-khach/toi/gioi-thieu"
                        : "/app-khach/toi/ho-so"
              }
              className="app-settings-row"
            >
              <span className="app-settings-ico">
                <item.Icon size={18} />
              </span>
              <span>{item.label}</span>
              <IconChevron size={16} />
            </Link>
          ) : (
            <div key={item.id}>
              <button
                type="button"
                className="app-settings-row"
                onClick={() =>
                  setOpen(open === "appearance" ? null : "appearance")
                }
              >
                <span className="app-settings-ico">
                  <item.Icon size={18} />
                </span>
                <span>{item.label}</span>
                <IconChevron size={16} />
              </button>
              {open === item.id && item.id === "appearance" ? (
                <div className="app-theme-picks">
                  <button
                    type="button"
                    className={`app-theme-pick${theme === "light" ? " is-on" : ""}`}
                    onClick={(e) => setThemeAt("light", e)}
                  >
                    Sáng
                  </button>
                  <button
                    type="button"
                    className={`app-theme-pick${theme === "dark" ? " is-on" : ""}`}
                    onClick={(e) => setThemeAt("dark", e)}
                  >
                    Tối
                  </button>
                </div>
              ) : null}
              {open === item.id && item.id !== "appearance" ? (
                <p className="app-settings-soon">Sẽ mở trong bản sau.</p>
              ) : null}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default function ToiPage() {
  return (
    <AppShell active="toi">
      <AuthGate>
        <AccountPanel />
      </AuthGate>
    </AppShell>
  );
}
