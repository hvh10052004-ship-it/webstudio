const TOKEN_KEY = "ws_session_token";
const SESSION_KEY = "ws_session_data";
const LOGIN_KEY = "ws_login_saved";
const LAST_TAB_KEY = "ws_last_tab";

export function getSessionToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setSessionToken(token: string) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function clearSessionToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function saveSessionData(data: unknown) {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function loadSessionData<T>() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function authHeaders(): Record<string, string> {
  const token = getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function saveLoginInfo(name: string, password: string) {
  try {
    window.localStorage.setItem(
      LOGIN_KEY,
      JSON.stringify({ name, password }),
    );
  } catch {
    /* ignore */
  }
}

export function loadLoginInfo() {
  try {
    const raw = window.localStorage.getItem(LOGIN_KEY);
    if (!raw) return { name: "", password: "" };
    const json = JSON.parse(raw) as { name?: string; password?: string };
    return {
      name: json.name || "",
      password: json.password || "",
    };
  } catch {
    return { name: "", password: "" };
  }
}

export function saveLastTab(href: string) {
  try {
    if (href.startsWith("/app-khach")) {
      window.localStorage.setItem(LAST_TAB_KEY, href);
    }
  } catch {
    /* ignore */
  }
}

export function loadLastTab() {
  try {
    return window.localStorage.getItem(LAST_TAB_KEY) || "";
  } catch {
    return "";
  }
}
