import fs from "node:fs";
import path from "node:path";
import { createHash, randomBytes } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

const root = process.cwd();
const dataDir = path.join(root, "data");
const dbFile = path.join(dataDir, "webstudio.db");
const envFile = path.join(root, ".env");

function hashPin(pin, salt) {
  return createHash("sha256").update(`${salt}:${pin}`).digest("hex");
}

fs.mkdirSync(dataDir, { recursive: true });

if (!fs.existsSync(envFile)) {
  fs.writeFileSync(
    envFile,
    `DATABASE_PATH=./data/webstudio.db\nSESSION_SECRET=${randomBytes(16).toString("hex")}\n`,
  );
  console.log("Da tao file .env");
}

const db = new DatabaseSync(dbFile);
db.exec("PRAGMA journal_mode = WAL");
db.exec(`
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
  expires_at TEXT NOT NULL
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
  updated_by INTEGER
);
CREATE TABLE IF NOT EXISTS site_members (
  site_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  last_seen TEXT,
  PRIMARY KEY (site_id, user_id)
);
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

try {
  db.exec("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'customer'");
} catch {
  /* da co cot role */
}

const count = db.prepare("SELECT COUNT(*) AS n FROM users").get().n;
if (count === 0) {
  const insert = db.prepare(
    "INSERT INTO users (name, pin_salt, pin_hash, role) VALUES (?, ?, ?, 'customer')",
  );
  for (const name of ["Huong", "Minh", "Lan"]) {
    const salt = randomBytes(8).toString("hex");
    insert.run(name, salt, hashPin("1234", salt));
  }
  console.log("Tai khoan mau: Huong / Minh / Lan — PIN 1234");
}

const admin = db.prepare("SELECT id FROM users WHERE name = ?").get("Admin");
if (!admin) {
  const salt = randomBytes(8).toString("hex");
  db.prepare(
    "INSERT INTO users (name, pin_salt, pin_hash, role) VALUES (?, ?, ?, 'admin')",
  ).run("Admin", salt, hashPin("1234", salt));
  console.log("Tai khoan admin: Admin — mat khau 1234");
} else {
  db.prepare("UPDATE users SET role = 'admin' WHERE name = ?").run("Admin");
}

db.close();
console.log("");
console.log("Cai dat xong.");
console.log("1) npm install");
console.log("2) npm run setup");
console.log("3) npm run dev");
console.log("Mo http://localhost:3000/app-khach");
console.log("May khac trong LAN: npm run dev -- --hostname 0.0.0.0");
console.log("Roi vao http://<IP-may-nay>:3000/app-khach");
console.log("CSDL: " + dbFile);
