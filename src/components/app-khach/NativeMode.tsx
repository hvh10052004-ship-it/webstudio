"use client";

import { useEffect } from "react";

export function NativeMode() {
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const capacitor =
      typeof window !== "undefined" &&
      Boolean(
        (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } })
          .Capacitor?.isNativePlatform?.(),
      );
    const dedicated = process.env.NEXT_PUBLIC_APP_KHACH_SERVER === "1";
    const native =
      dedicated ||
      capacitor ||
      /WebStudioKhach/i.test(ua) ||
      /; wv\)/i.test(ua) ||
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(max-width: 480px)").matches;
    document.documentElement.classList.toggle("app-native", native);
  }, []);
  return null;
}
