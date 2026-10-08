"use client";

import { useEffect } from "react";

export function CapacitorInit() {
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform() || cancelled) return;
        document.documentElement.classList.add("app-native");
        try {
          const { StatusBar, Style } = await import("@capacitor/status-bar");
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: "#f4f1ec" });
        } catch {
          /* plugin chưa có trên web */
        }
        try {
          const { SplashScreen } = await import("@capacitor/splash-screen");
          await SplashScreen.hide();
        } catch {
          /* splash tùy chọn */
        }
      } catch {
        /* chạy trên trình duyệt */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
