import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { getDb, type UserRow } from "./db";
import { vietnamNowSql } from "./vietnam-time";

const COOKIE = "ws_session";
const ADMIN_COOKIE = "ws_admin";

export function hashPin(pin: string, salt: string) {
  return createHash("sha256").update(`${salt}:${pin}`).digest("hex");
}

export function newSalt() {
  return randomBytes(8).toString("hex");
}

export function pinsMatch(pin: string, salt: string, expected: string) {
  const got = hashPin(pin, salt);
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function createSession(userId: number) {
  const token = randomBytes(24).toString("hex");
  const now = vietnamNowSql();
  const expiresDate = new Date(
    now.replace(" ", "T") + "+07:00",
  );
  expiresDate.setDate(expiresDate.getDate() + 30);
  const expires = vietnamParts(expiresDate);
  getDb()
    .prepare(
      "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
    )
    .run(token, userId, expires);
  return token;
}

function vietnamParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

export function markLogin(userId: number) {
  getDb()
    .prepare("UPDATE users SET last_login_at = ? WHERE id = ?")
    .run(`${vietnamNowSql()}+07:00`, userId);
}

export function cookieOptions() {
  const publicOrigin = process.env.PUBLIC_ORIGIN ?? "";
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
    secure: publicOrigin.startsWith("https://") || process.env.COOKIE_SECURE === "1",
  };
}

async function readToken(cookieName: string) {
  const jar = await cookies();
  const fromCookie = jar.get(cookieName)?.value;
  if (fromCookie) return fromCookie;
  const h = await headers();
  const auth = h.get("authorization") || h.get("Authorization") || "";
  if (auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return h.get("x-ws-token")?.trim() || "";
}

export async function getSessionUser(): Promise<UserRow | null> {
  const token = await readToken(COOKIE);
  if (!token) return null;
  const row = getDb()
    .prepare(
      `SELECT u.id, u.name, u.current_site_id, u.phone, u.pin_last2,
              u.nickname, u.birthday, u.avatar_url, u.gender, u.email,
              COALESCE(u.role, 'customer') AS role, u.last_login_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > ?`,
    )
    .get(token, vietnamNowSql()) as UserRow | undefined;
  return row ?? null;
}

export async function getAdminUser(): Promise<UserRow | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const row = getDb()
    .prepare(
      `SELECT u.id, u.name, u.current_site_id, u.phone, u.pin_last2,
              u.nickname, u.birthday, u.avatar_url, u.gender, u.email,
              COALESCE(u.role, 'customer') AS role, u.last_login_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > ?
         AND COALESCE(u.role, 'customer') = 'admin'`,
    )
    .get(token, vietnamNowSql()) as UserRow | undefined;
  return row ?? null;
}

export function getUserById(id: number): UserRow | null {
  const row = getDb()
    .prepare(
      `SELECT id, name, current_site_id, phone, pin_last2,
              nickname, birthday, avatar_url, gender, email,
              COALESCE(role, 'customer') AS role, last_login_at
       FROM users WHERE id = ?`,
    )
    .get(id) as UserRow | undefined;
  return row ?? null;
}

export function findUserByName(name: string) {
  return getDb()
    .prepare(
      "SELECT id, name, pin_salt, pin_hash, COALESCE(role, 'customer') AS role FROM users WHERE lower(name) = lower(?)",
    )
    .get(name.trim()) as
    | {
        id: number;
        name: string;
        pin_salt: string;
        pin_hash: string;
        role: string;
      }
    | undefined;
}

export function findUserByLogin(login: string) {
  const key = login.trim();
  return getDb()
    .prepare(
      `SELECT id, name, pin_salt, pin_hash, COALESCE(role, 'customer') AS role
       FROM users
       WHERE lower(name) = lower(?) OR lower(COALESCE(email, '')) = lower(?)`,
    )
    .get(key, key) as
    | {
        id: number;
        name: string;
        pin_salt: string;
        pin_hash: string;
        role: string;
      }
    | undefined;
}

export function createUser(
  name: string,
  password: string,
  extra?: {
    nickname?: string;
    birthday?: string;
    phone?: string;
    role?: "customer" | "admin";
  },
) {
  const salt = newSalt();
  const phone = (extra?.phone || "").trim() || "0900000000";
  const nickname = (extra?.nickname || name).trim().slice(0, 24);
  const birthday = extra?.birthday || "";
  const role = extra?.role === "admin" ? "admin" : "customer";
  const info = getDb()
    .prepare(
      `INSERT INTO users (name, pin_salt, pin_hash, phone, pin_last2, nickname, birthday, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      name.trim(),
      salt,
      hashPin(password, salt),
      phone,
      password.slice(-2),
      nickname,
      birthday,
      role,
    );
  return Number(info.lastInsertRowid);
}

export function savePinHint(userId: number, pin: string) {
  getDb()
    .prepare("UPDATE users SET pin_last2 = ? WHERE id = ?")
    .run(pin.slice(-2), userId);
}

export function updateProfile(
  userId: number,
  fields: {
    nickname?: string;
    birthday?: string;
    avatar_url?: string;
    gender?: string;
    email?: string;
    phone?: string;
  },
) {
  const db = getDb();
  if (fields.nickname !== undefined) {
    db.prepare("UPDATE users SET nickname = ? WHERE id = ?").run(
      fields.nickname.trim().slice(0, 24),
      userId,
    );
  }
  if (fields.birthday !== undefined) {
    db.prepare("UPDATE users SET birthday = ? WHERE id = ?").run(
      fields.birthday,
      userId,
    );
  }
  if (fields.avatar_url !== undefined) {
    db.prepare("UPDATE users SET avatar_url = ? WHERE id = ?").run(
      fields.avatar_url,
      userId,
    );
  }
  if (fields.gender !== undefined) {
    db.prepare("UPDATE users SET gender = ? WHERE id = ?").run(
      fields.gender,
      userId,
    );
  }
  if (fields.email !== undefined) {
    db.prepare("UPDATE users SET email = ? WHERE id = ?").run(
      fields.email.trim().toLowerCase(),
      userId,
    );
  }
  if (fields.phone !== undefined) {
    db.prepare("UPDATE users SET phone = ? WHERE id = ?").run(
      fields.phone,
      userId,
    );
  }
}

export function updateLoginName(userId: number, name: string) {
  getDb().prepare("UPDATE users SET name = ? WHERE id = ?").run(name, userId);
}

export function verifyPassword(userId: number, password: string) {
  const row = getDb()
    .prepare("SELECT pin_salt, pin_hash FROM users WHERE id = ?")
    .get(userId) as { pin_salt: string; pin_hash: string } | undefined;
  if (!row) return false;
  return pinsMatch(password, row.pin_salt, row.pin_hash);
}

export function updatePassword(userId: number, password: string) {
  const salt = newSalt();
  getDb()
    .prepare(
      "UPDATE users SET pin_salt = ?, pin_hash = ?, pin_last2 = ? WHERE id = ?",
    )
    .run(salt, hashPin(password, salt), password.slice(-2), userId);
}

export { COOKIE, ADMIN_COOKIE };
