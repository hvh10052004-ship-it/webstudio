import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  pin_salt TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  current_site_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS sites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  template_id TEXT NOT NULL,
  type_id TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE,
  blocks_json TEXT NOT NULL DEFAULT '{}',
  enabled_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by INTEGER,
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS site_members (
  site_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  last_seen TEXT,
  PRIMARY KEY (site_id, user_id),
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_activities_site ON activities(site_id, id DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_messages_site ON messages(site_id, id DESC);
`;

let cached: DatabaseSync | null = null;

export function dbPath() {
  const raw = process.env.DATABASE_PATH || "./data/webstudio.db";
  return path.resolve(process.cwd(), raw);
}

export function getDb() {
  if (cached) {
    migrateUserColumns(cached);
    migrateSiteColumns(cached);
    migrateChatTables(cached);
    seedDemoCustomers(cached);
    return cached;
  }
  const file = dbPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA busy_timeout = 4000");
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(SCHEMA);
  migrateUserColumns(db);
  migrateMessageColumns(db);
  migrateSiteColumns(db);
  migrateChatTables(db);
  cached = db;
  return db;
}

function migrateUserColumns(db: DatabaseSync) {
  const cols = db
    .prepare("PRAGMA table_info(users)")
    .all() as { name: string }[];
  const names = new Set(cols.map((c) => c.name));
  if (!names.has("phone")) {
    db.exec("ALTER TABLE users ADD COLUMN phone TEXT");
  }
  if (!names.has("pin_last2")) {
    db.exec("ALTER TABLE users ADD COLUMN pin_last2 TEXT");
  }
  if (!names.has("nickname")) {
    db.exec("ALTER TABLE users ADD COLUMN nickname TEXT");
  }
  if (!names.has("birthday")) {
    db.exec("ALTER TABLE users ADD COLUMN birthday TEXT");
  }
  if (!names.has("avatar_url")) {
    db.exec("ALTER TABLE users ADD COLUMN avatar_url TEXT");
  }
  if (!names.has("gender")) {
    db.exec("ALTER TABLE users ADD COLUMN gender TEXT");
  }
  if (!names.has("email")) {
    db.exec("ALTER TABLE users ADD COLUMN email TEXT");
  }
  if (!names.has("last_login_at")) {
    db.exec("ALTER TABLE users ADD COLUMN last_login_at TEXT");
  }
  if (!names.has("role")) {
    db.exec(
      "ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'customer'",
    );
  }
  db.exec(`
    UPDATE users SET phone = '0900000000' WHERE phone IS NULL OR phone = '';
    UPDATE users SET pin_last2 = '34' WHERE pin_last2 IS NULL OR pin_last2 = '';
    UPDATE users SET role = 'customer' WHERE role IS NULL OR role = '';
  `);
  seedAdmin(db);
  seedDemoCustomers(db);
}

function migrateMessageColumns(db: DatabaseSync) {
  const cols = db
    .prepare("PRAGMA table_info(messages)")
    .all() as { name: string }[];
  const names = new Set(cols.map((c) => c.name));
  if (!names.has("image_url")) {
    db.exec("ALTER TABLE messages ADD COLUMN image_url TEXT");
  }
  if (!names.has("pinned")) {
    db.exec("ALTER TABLE messages ADD COLUMN pinned INTEGER NOT NULL DEFAULT 0");
  }
  if (!names.has("reply_to")) {
    db.exec("ALTER TABLE messages ADD COLUMN reply_to INTEGER");
  }
}

function migrateSiteColumns(db: DatabaseSync) {
  const cols = db
    .prepare("PRAGMA table_info(sites)")
    .all() as { name: string }[];
  const names = new Set(cols.map((c) => c.name));
  if (!names.has("content_locked")) {
    db.exec(
      "ALTER TABLE sites ADD COLUMN content_locked INTEGER NOT NULL DEFAULT 0",
    );
  }
}

function migrateChatTables(db: DatabaseSync) {
  const userCols = db
    .prepare("PRAGMA table_info(users)")
    .all() as { name: string }[];
  if (!userCols.some((c) => c.name === "chat_code")) {
    db.exec("ALTER TABLE users ADD COLUMN chat_code TEXT");
  }
  db.exec(`
    CREATE TABLE IF NOT EXISTS chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      kind TEXT NOT NULL DEFAULT 'direct',
      created_by INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS chat_members (
      chat_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      PRIMARY KEY (chat_id, user_id),
      FOREIGN KEY (chat_id) REFERENCES chats(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      body TEXT NOT NULL DEFAULT '',
      image_url TEXT,
      reply_to INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (chat_id) REFERENCES chats(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS idx_chat_messages ON chat_messages(chat_id, id DESC);
  `);
}

function seedAdmin(db: DatabaseSync) {
  const salt = randomBytes(8).toString("hex");
  const hash = createHash("sha256").update(`${salt}:1234`).digest("hex");
  const existing = db
    .prepare("SELECT id FROM users WHERE name = ?")
    .get("Admin") as { id: number } | undefined;
  if (existing) {
    db.prepare(
      "UPDATE users SET role = 'admin', pin_salt = ?, pin_hash = ?, pin_last2 = '34' WHERE id = ?",
    ).run(salt, hash, existing.id);
    return;
  }
  db.prepare(
    `INSERT INTO users (name, pin_salt, pin_hash, phone, pin_last2, nickname, role)
     VALUES (?, ?, ?, ?, ?, ?, 'admin')`,
  ).run("Admin", salt, hash, "0900000000", "34", "Admin");
}

function seedDemoCustomers(db: DatabaseSync) {
  const names = ["Huong", "Minh", "Lan"] as const;
  for (const name of names) {
    const existing = db
      .prepare("SELECT id FROM users WHERE lower(name) = lower(?)")
      .get(name) as { id: number } | undefined;
    if (existing) continue;
    const salt = randomBytes(8).toString("hex");
    const hash = createHash("sha256").update(`${salt}:1234`).digest("hex");
    db.prepare(
      `INSERT INTO users (name, pin_salt, pin_hash, phone, pin_last2, nickname, role)
       VALUES (?, ?, ?, ?, ?, ?, 'customer')`,
    ).run(name, salt, hash, "0900000000", "34", name);
  }
}

export type UserRow = {
  id: number;
  name: string;
  current_site_id: number | null;
  phone: string | null;
  pin_last2: string | null;
  nickname: string | null;
  birthday: string | null;
  avatar_url: string | null;
  gender: string | null;
  email: string | null;
  role: "customer" | "admin";
  last_login_at?: string | null;
};

export type SiteRow = {
  id: number;
  name: string;
  template_id: string;
  type_id: string;
  invite_code: string;
  blocks_json: string;
  enabled_json: string;
  content_locked?: number;
  updated_at: string;
  updated_by: number | null;
};
