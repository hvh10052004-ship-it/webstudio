"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCollab } from "./CollabProvider";
import { loadLastTab, saveLastTab } from "./session-client";

export function AppSync() {
  const router = useRouter();
  const pathname = usePathname();
  const { syncKey } = useCollab();

  useEffect(() => {
    if (!pathname?.startsWith("/app-khach")) return;
    const href = pathname + window.location.search;
    saveLastTab(href);
  }, [pathname]);

  useEffect(() => {
    const last = loadLastTab();
    if (!last.startsWith("/app-khach")) return;
    try {
      if (sessionStorage.getItem("ws_tab_restored")) return;
      sessionStorage.setItem("ws_tab_restored", "1");
    } catch {
      return;
    }
    const here = window.location.pathname + window.location.search;
    if (window.location.pathname === "/app-khach" && last !== here) {
      router.replace(last);
    }
  }, [router]);

  useEffect(() => {
    if (syncKey > 0) router.refresh();
  }, [syncKey, router]);

  return null;
}
