import { getDb } from "./db";
import { inviteCode } from "./sites";

function uniqueCode() {
  const db = getDb();
  for (let i = 0; i < 20; i++) {
    const code = inviteCode();
    const user = db
      .prepare("SELECT 1 AS ok FROM users WHERE chat_code = ?")
      .get(code) as { ok: number } | undefined;
    const chat = db
      .prepare("SELECT 1 AS ok FROM chats WHERE code = ?")
      .get(code) as { ok: number } | undefined;
    if (!user && !chat) return code;
  }
  return `${inviteCode()}${inviteCode()}`.slice(0, 6);
}

export function ensureChatCode(userId: number) {
  const db = getDb();
  const row = db
    .prepare("SELECT chat_code FROM users WHERE id = ?")
    .get(userId) as { chat_code: string | null } | undefined;
  if (row?.chat_code) return row.chat_code;
  const code = uniqueCode();
  db.prepare("UPDATE users SET chat_code = ? WHERE id = ?").run(code, userId);
  return code;
}

function displayName(userId: number) {
  const row = getDb()
    .prepare(
      "SELECT name, COALESCE(nickname, name) AS nickname FROM users WHERE id = ?",
    )
    .get(userId) as { name: string; nickname: string } | undefined;
  return row?.nickname || row?.name || "Khách";
}

function addMember(chatId: number, userId: number) {
  getDb()
    .prepare("INSERT OR IGNORE INTO chat_members (chat_id, user_id) VALUES (?, ?)")
    .run(chatId, userId);
}

export function isChatMember(chatId: number, userId: number) {
  const row = getDb()
    .prepare("SELECT 1 AS ok FROM chat_members WHERE chat_id = ? AND user_id = ?")
    .get(chatId, userId) as { ok: number } | undefined;
  return Boolean(row);
}

function findDirectChat(userA: number, userB: number) {
  return getDb()
    .prepare(
      `SELECT c.id
       FROM chats c
       JOIN chat_members a ON a.chat_id = c.id AND a.user_id = ?
       JOIN chat_members b ON b.chat_id = c.id AND b.user_id = ?
       WHERE c.kind = 'direct'
         AND (SELECT COUNT(*) FROM chat_members m WHERE m.chat_id = c.id) = 2`,
    )
    .get(userA, userB) as { id: number } | undefined;
}

function createChat(kind: "direct" | "group", createdBy: number, members: number[]) {
  const db = getDb();
  const info = db
    .prepare("INSERT INTO chats (code, kind, created_by) VALUES (?, ?, ?)")
    .run(uniqueCode(), kind, createdBy);
  const id = Number(info.lastInsertRowid);
  for (const member of members) addMember(id, member);
  return id;
}

export function createGroupChat(userId: number) {
  return createChat("group", userId, [userId]);
}

export function connectByCode(userId: number, raw: string) {
  const code = raw.trim().toUpperCase();
  if (!code) return { error: "Nhập mã kết nối", status: 400 as const };
  const myCode = ensureChatCode(userId);
  if (code === myCode) {
    return { error: "Đó là mã của bạn. Hãy gửi mã này cho người khác.", status: 400 as const };
  }

  const other = getDb()
    .prepare(
      `SELECT id FROM users
       WHERE chat_code = ? AND COALESCE(role, 'customer') = 'customer'`,
    )
    .get(code) as { id: number } | undefined;
  if (other) {
    const existing = findDirectChat(userId, other.id);
    const chatId = existing?.id ?? createChat("direct", userId, [userId, other.id]);
    return { chatId };
  }

  const room = getDb()
    .prepare("SELECT id FROM chats WHERE code = ?")
    .get(code) as { id: number } | undefined;
  if (!room) return { error: "Không tìm thấy mã này", status: 404 as const };
  addMember(room.id, userId);
  return { chatId: room.id };
}

function chatTitle(chatId: number, meId: number, kind: string, code: string) {
  if (kind !== "direct") return `Nhóm ${code}`;
  const other = getDb()
    .prepare(
      `SELECT u.id, u.name, COALESCE(u.nickname, u.name) AS nickname,
              COALESCE(u.avatar_url, '') AS avatar_url
       FROM chat_members m
       JOIN users u ON u.id = m.user_id
       WHERE m.chat_id = ? AND m.user_id != ?
       LIMIT 1`,
    )
    .get(chatId, meId) as
    | { id: number; name: string; nickname: string; avatar_url: string }
    | undefined;
  return other?.nickname || other?.name || "Trò chuyện";
}

function chatAvatar(chatId: number, meId: number, kind: string) {
  if (kind !== "direct") return "";
  const other = getDb()
    .prepare(
      `SELECT COALESCE(u.avatar_url, '') AS avatar_url
       FROM chat_members m
       JOIN users u ON u.id = m.user_id
       WHERE m.chat_id = ? AND m.user_id != ?
       LIMIT 1`,
    )
    .get(chatId, meId) as { avatar_url: string } | undefined;
  return other?.avatar_url || "";
}

export function listMyChats(userId: number) {
  const rows = getDb()
    .prepare(
      `SELECT c.id, c.code, c.kind,
              COALESCE(lm.body, '') AS last_body,
              COALESCE(lm.image_url, '') AS last_image,
              COALESCE(lm.created_at, '') AS last_at,
              COALESCE(lm.id, 0) AS last_id
       FROM chats c
       JOIN chat_members m ON m.chat_id = c.id AND m.user_id = ?
       LEFT JOIN chat_messages lm ON lm.id = (
         SELECT MAX(x.id) FROM chat_messages x WHERE x.chat_id = c.id
       )
       ORDER BY COALESCE(lm.id, c.id) DESC`,
    )
    .all(userId) as {
    id: number;
    code: string;
    kind: string;
    last_body: string;
    last_image: string;
    last_at: string;
    last_id: number;
  }[];
  return rows.map((row) => ({
    id: row.id,
    code: row.code,
    kind: row.kind,
    title: chatTitle(row.id, userId, row.kind, row.code),
    avatar_url: chatAvatar(row.id, userId, row.kind),
    last_body: row.last_body,
    last_image: row.last_image,
    last_at: row.last_at,
  }));
}

export function getChatForUser(chatId: number, userId: number) {
  if (!isChatMember(chatId, userId)) return null;
  const row = getDb()
    .prepare("SELECT id, code, kind FROM chats WHERE id = ?")
    .get(chatId) as { id: number; code: string; kind: string } | undefined;
  if (!row) return null;
  return {
    id: row.id,
    code: row.code,
    kind: row.kind,
    title: chatTitle(row.id, userId, row.kind, row.code),
  };
}

export function listChatMessages(chatId: number, limit = 80) {
  const rows = getDb()
    .prepare(
      `SELECT m.id, m.body, m.created_at, m.user_id, u.name,
              COALESCE(u.nickname, u.name) AS nickname,
              COALESCE(m.image_url, '') AS image_url,
              COALESCE(m.reply_to, 0) AS reply_to,
              COALESCE(r.body, '') AS reply_body,
              COALESCE(ru.name, '') AS reply_name,
              COALESCE(r.image_url, '') AS reply_image
       FROM chat_messages m
       JOIN users u ON u.id = m.user_id
       LEFT JOIN chat_messages r ON r.id = m.reply_to
       LEFT JOIN users ru ON ru.id = r.user_id
       WHERE m.chat_id = ?
       ORDER BY m.id DESC
       LIMIT ?`,
    )
    .all(chatId, limit) as {
    id: number;
    body: string;
    created_at: string;
    user_id: number;
    name: string;
    nickname: string;
    image_url: string;
    reply_to: number;
    reply_body: string;
    reply_name: string;
    reply_image: string;
  }[];
  return rows.reverse();
}

export function addChatMessage(
  chatId: number,
  userId: number,
  body: string,
  imageUrl = "",
  replyTo = 0,
) {
  const text = body.trim().slice(0, 2000);
  if (!text && !imageUrl) return null;
  let replyId: number | null = null;
  if (replyTo) {
    const found = getDb()
      .prepare("SELECT id FROM chat_messages WHERE id = ? AND chat_id = ?")
      .get(replyTo, chatId) as { id: number } | undefined;
    if (found) replyId = found.id;
  }
  const info = getDb()
    .prepare(
      "INSERT INTO chat_messages (chat_id, user_id, body, image_url, reply_to) VALUES (?, ?, ?, ?, ?)",
    )
    .run(chatId, userId, text, imageUrl || null, replyId);
  return Number(info.lastInsertRowid);
}

export function memberCount(chatId: number) {
  const row = getDb()
    .prepare("SELECT COUNT(*) AS n FROM chat_members WHERE chat_id = ?")
    .get(chatId) as { n: number };
  return row.n;
}

export { displayName };
