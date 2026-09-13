"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CollabState } from "./collab-types";
import {
  authHeaders,
  clearSessionToken,
  loadSessionData,
  saveLoginInfo,
  saveSessionData,
  setSessionToken,
} from "./session-client";

type Ctx = {
  ready: boolean;
  loggedIn: boolean;
  data: CollabState | null;
  error: string;
  syncKey: number;
  refresh: () => Promise<boolean>;
  login: (name: string, password: string) => Promise<boolean>;
  register: (payload: {
    name: string;
    password: string;
    nickname: string;
    birthday: string;
    phone: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  saveBlocks: (
    blocks: Record<string, Record<string, string>>,
    enabled: Record<string, boolean>,
    detail: string,
    extra?: { typeId?: string; locked?: boolean },
  ) => Promise<boolean>;
  applyTemplate: (templateId: string) => Promise<boolean>;
  join: (code: string) => Promise<string | null>;
  setContentLocked: (locked: boolean) => Promise<boolean>;
  switchType: (typeId: string) => Promise<boolean>;
};

const CollabContext = createContext<Ctx | null>(null);

export function CollabProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState<CollabState | null>(null);
  const [error, setError] = useState("");
  const [syncKey, setSyncKey] = useState(0);

  const applySession = useCallback((json: CollabState) => {
    setData(json);
    setLoggedIn(true);
    setError("");
    setReady(true);
    saveSessionData({
      user: json.user,
      site: json.site,
      typeSites: json.typeSites,
      members: json.members,
      activities: json.activities,
    });
  }, []);

  const refresh = useCallback(async () => {
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch("/api/me", {
        credentials: "include",
        signal: ctrl.signal,
        cache: "no-store",
        headers: authHeaders(),
      });
      if (res.status === 401) {
        return false;
      }
      if (!res.ok) {
        setError("Không tải được dữ liệu. Thử lại hoặc đăng nhập.");
        return false;
      }
      applySession((await res.json()) as CollabState);
      return true;
    } catch {
      return false;
    } finally {
      window.clearTimeout(timer);
      setReady(true);
    }
  }, [applySession]);

  useEffect(() => {
    const cached = loadSessionData<CollabState>();
    if (cached?.user && cached?.site) applySession(cached);
    void refresh();
  }, [applySession, refresh]);

  useEffect(() => {
    let booted = false;
    const boot = window.setTimeout(() => {
      booted = true;
    }, 600);
    let last = 0;
    const syncAll = () => {
      if (!booted) return;
      if (document.visibilityState === "hidden") return;
      const now = Date.now();
      if (now - last < 600) return;
      last = now;
      void refresh();
      setSyncKey((n) => n + 1);
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") syncAll();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", syncAll);
    window.addEventListener("focus", syncAll);
    window.addEventListener("online", syncAll);
    return () => {
      window.clearTimeout(boot);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", syncAll);
      window.removeEventListener("focus", syncAll);
      window.removeEventListener("online", syncAll);
    };
  }, [refresh]);

  useEffect(() => {
    if (!loggedIn) return;
    const t = setInterval(() => void refresh(), 8000);
    return () => clearInterval(t);
  }, [loggedIn, refresh]);

  const login = useCallback(
    async (name: string, password: string) => {
      setError("");
      const ctrl = new AbortController();
      const timer = window.setTimeout(() => ctrl.abort(), 12000);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, password }),
          signal: ctrl.signal,
          redirect: "manual",
        });
        if (
          res.status === 0 ||
          res.type === "opaqueredirect" ||
          res.status === 303 ||
          !(res.headers.get("content-type") || "").includes("json")
        ) {
          const ok = await refresh();
          if (!ok) {
            setError("Đăng nhập chưa vào được hồ sơ. Tải lại trang rồi thử lại.");
          }
          return ok;
        }
        const json = (await res.json()) as CollabState & {
          error?: string;
          token?: string;
        };
        if (!res.ok) {
          setError(json.error || "Lỗi đăng nhập");
          return false;
        }
        if (json.token) setSessionToken(json.token);
        if (json.user && json.site) {
          saveLoginInfo(name, password);
          applySession(json);
          return true;
        }
        await refresh();
        return true;
      } catch {
        setError("Không có mạng hoặc máy chủ không phản hồi.");
        return false;
      } finally {
        window.clearTimeout(timer);
      }
    },
    [applySession, refresh],
  );

  const register = useCallback(
    async (payload: {
      name: string;
      password: string;
      nickname: string;
      birthday: string;
      phone: string;
    }) => {
      setError("");
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const json = (await res.json()) as CollabState & {
          error?: string;
          token?: string;
        };
        if (!res.ok) {
          setError(json.error || "Lỗi đăng ký");
          return false;
        }
        if (json.token) setSessionToken(json.token);
        if (json.user && json.site) {
          saveLoginInfo(payload.name, payload.password);
          applySession(json);
          return true;
        }
        await refresh();
        return true;
      } catch {
        setError("Không có mạng hoặc máy chủ không phản hồi.");
        return false;
      }
    },
    [applySession, refresh],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: authHeaders(),
    });
    clearSessionToken();
    setLoggedIn(false);
    setData(null);
  }, []);

  const saveBlocks = useCallback(
    async (
      blocks: Record<string, Record<string, string>>,
      enabled: Record<string, boolean>,
      detail: string,
      extra?: { typeId?: string; locked?: boolean },
    ) => {
      if (!data) return false;
      const res = await fetch(`/api/sites/${data.site.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        credentials: "include",
        body: JSON.stringify({
          blocks,
          enabled,
          detail,
          ...extra,
        }),
      });
      if (!res.ok) return false;
      const json = (await res.json()) as {
        site: CollabState["site"];
        members: CollabState["members"];
        activities: CollabState["activities"];
      };
      setData((prev) =>
        prev
          ? {
              ...prev,
              site: json.site,
              members: json.members,
              activities: json.activities,
            }
          : prev,
      );
      if (extra?.locked) await refresh();
      return true;
    },
    [data, refresh],
  );

  const setContentLocked = useCallback(
    async (locked: boolean) => {
      if (!data) return false;
      const res = await fetch(`/api/sites/${data.site.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        credentials: "include",
        body: JSON.stringify({ locked }),
      });
      if (!res.ok) return false;
      const json = (await res.json()) as { site: CollabState["site"] };
      setData((prev) => (prev ? { ...prev, site: json.site } : prev));
      return true;
    },
    [data],
  );

  const applyTemplate = useCallback(
    async (templateId: string) => {
      if (!data) return false;
      const res = await fetch(`/api/sites/${data.site.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        credentials: "include",
        body: JSON.stringify({ templateId }),
      });
      if (!res.ok) return false;
      await refresh();
      return true;
    },
    [data, refresh],
  );

  const join = useCallback(
    async (code: string) => {
      const res = await fetch("/api/sites/join", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        credentials: "include",
        body: JSON.stringify({ code }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) return json.error || "Không vào được";
      await refresh();
      return null;
    },
    [refresh],
  );

  const switchType = useCallback(
    async (typeId: string) => {
      const res = await fetch("/api/sites/type", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        credentials: "include",
        body: JSON.stringify({ typeId }),
      });
      if (!res.ok) return false;
      const json = (await res.json()) as Pick<
        CollabState,
        "site" | "typeSites" | "members" | "activities"
      >;
      setData((prev) =>
        prev
          ? {
              ...prev,
              site: json.site,
              typeSites: json.typeSites,
              members: json.members,
              activities: json.activities,
            }
          : prev,
      );
      return true;
    },
    [],
  );

  const value = useMemo(
    () => ({
      ready,
      loggedIn,
      data,
      error,
      syncKey,
      refresh,
      login,
      register,
      logout,
      saveBlocks,
      applyTemplate,
      join,
      setContentLocked,
      switchType,
    }),
    [
      ready,
      loggedIn,
      data,
      error,
      syncKey,
      refresh,
      login,
      register,
      logout,
      saveBlocks,
      applyTemplate,
      join,
      setContentLocked,
      switchType,
    ],
  );

  return (
    <CollabContext.Provider value={value}>{children}</CollabContext.Provider>
  );
}

export function useCollab() {
  const ctx = useContext(CollabContext);
  if (!ctx) throw new Error("useCollab outside provider");
  return ctx;
}
