"use client";

import type { ReactNode } from "react";
import { AppTabBar, type AppTab } from "./AppTabBar";
import { useTheme } from "./ThemeProvider";

export function AppShell({
  active,
  children,
}: {
  active: AppTab;
  children: ReactNode;
}) {
  const { theme, registerPhone } = useTheme();
  return (
    <div className="app-stage">
      <p className="app-stage-hint">App khách</p>
      <div
        className="app-phone"
        data-theme={theme}
        ref={registerPhone}
      >
        <div
          className={`app-phone-body${active === "chat" ? " is-chat" : ""}`}
        >
          {children}
        </div>
        <AppTabBar active={active} />
      </div>
    </div>
  );
}
