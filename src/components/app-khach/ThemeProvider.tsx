"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

export type AppTheme = "light" | "dark";

type Ctx = {
  theme: AppTheme;
  setThemeAt: (next: AppTheme, event?: MouseEvent<HTMLElement>) => void;
  registerPhone: (el: HTMLElement | null) => void;
};

const ThemeContext = createContext<Ctx | null>(null);
const KEY = "ws-app-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem(KEY);
    return saved === "dark" ? "dark" : "light";
  });
  const phoneRef = useRef<HTMLElement | null>(null);

  const registerPhone = useCallback((el: HTMLElement | null) => {
    phoneRef.current = el;
  }, []);

  const setThemeAt = useCallback(
    (next: AppTheme, event?: MouseEvent<HTMLElement>) => {
      if (next === theme) return;
      const phone = phoneRef.current;
      const apply = () => {
        setTheme(next);
        localStorage.setItem(KEY, next);
      };

      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!phone || reduce) {
        apply();
        return;
      }

      const rect = phone.getBoundingClientRect();
      const x = event ? event.clientX - rect.left : rect.width / 2;
      const y = event ? event.clientY - rect.top : rect.height / 2;
      const rr = Math.hypot(
        Math.max(x, rect.width - x),
        Math.max(y, rect.height - y),
      );
      const rx = `${x}px`;
      const ry = `${y}px`;
      const rrs = `${Math.ceil(rr)}px`;
      document.documentElement.style.setProperty("--app-rx", rx);
      document.documentElement.style.setProperty("--app-ry", ry);
      document.documentElement.style.setProperty("--app-rr", rrs);
      phone.style.setProperty("--app-rx", rx);
      phone.style.setProperty("--app-ry", ry);
      phone.style.setProperty("--app-rr", rrs);
      phone.style.setProperty(
        "--wave-fill",
        next === "dark" ? "#14121a" : "#f4f1ec",
      );
      phone.classList.add("is-waving");
      document.documentElement.dataset.themeDir = next;

      const done = () => phone.classList.remove("is-waving", "is-waving-fill");
      const vt = document.startViewTransition?.bind(document);

      if (!vt) {
        phone.classList.add("is-waving-fill");
        window.setTimeout(() => {
          apply();
          done();
        }, 720);
        return;
      }

      const run = vt(() => {
        apply();
      });
      void run.finished.then(done).catch(done);
    },
    [theme],
  );

  const value = useMemo(
    () => ({ theme, setThemeAt, registerPhone }),
    [theme, setThemeAt, registerPhone],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme outside provider");
  return ctx;
}
