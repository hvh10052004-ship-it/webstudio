import { randomBytes } from "node:crypto";
import { getDb, type SiteRow } from "./db";
import { DEFAULT_VALUES, contentBlocksForType, draftChecksForType } from "@/data/app-blocks";
import { SITE_TYPES, TEMPLATES, type SiteTypeId } from "@/data/app-khach";

export function inviteCode() {
  return randomBytes(3).toString("hex").toUpperCase().slice(0, 6);
}

export function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function publicSite(site: SiteRow) {
  return {
    id: site.id,
    name: site.name,
    templateId: site.template_id,
    typeId: site.type_id,
    inviteCode: site.invite_code,
    blocks: parseJson<Record<string, Record<string, string>>>(
      site.blocks_json,
      {},
    ),
    enabled: parseJson<Record<string, boolean>>(site.enabled_json, {}),
    locked: Boolean(site.content_locked),
    updatedAt: site.updated_at,
  };
}

export function getSite(id: number) {
  return getDb()
    .prepare("SELECT * FROM sites WHERE id = ?")
    .get(id) as SiteRow | undefined;
}

export function getSiteByInvite(code: string) {
  return getDb()
    .prepare("SELECT * FROM sites WHERE invite_code = ?")
    .get(code.trim().toUpperCase()) as SiteRow | undefined;
}

export function userSites(userId: number) {
  return getDb()
    .prepare(
      `SELECT s.* FROM sites s
       JOIN site_members m ON m.site_id = s.id
       WHERE m.user_id = ?
       ORDER BY s.updated_at DESC`,
    )
    .all(userId) as SiteRow[];
}

export function isMember(siteId: number, userId: number) {
  const row = getDb()
    .prepare(
      "SELECT 1 AS ok FROM site_members WHERE site_id = ? AND user_id = ?",
    )
    .get(siteId, userId) as { ok: number } | undefined;
  return Boolean(row);
}

export function addMember(siteId: number, userId: number, role = "editor") {
  getDb()
    .prepare(
      `INSERT OR IGNORE INTO site_members (site_id, user_id, role, last_seen)
       VALUES (?, ?, ?, datetime('now'))`,
    )
    .run(siteId, userId, role);
}

export function touchPresence(siteId: number, userId: number) {
  getDb()
    .prepare(
      `UPDATE site_members SET last_seen = datetime('now')
       WHERE site_id = ? AND user_id = ?`,
    )
    .run(siteId, userId);
}

export function createSite(
  userId: number,
  templateId: string,
  name?: string,
) {
  const tpl = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
  const blocks = DEFAULT_VALUES[tpl.id] ?? {};
  const db = getDb();
  const info = db
    .prepare(
      `INSERT INTO sites (name, template_id, type_id, invite_code, blocks_json, enabled_json, updated_by)
       VALUES (?, ?, ?, ?, ?, '{}', ?)`,
    )
    .run(
      name || tpl.name,
      tpl.id,
      tpl.type,
      inviteCode(),
      JSON.stringify(blocks),
      userId,
    );
  const id = Number(info.lastInsertRowid);
  addMember(id, userId, "owner");
  logActivity(id, userId, "create", `Tạo site từ mẫu ${tpl.name}`);
  setCurrentSite(userId, id);
  return getSite(id)!;
}

export function userTypeSites(userId: number) {
  return userSites(userId).map((site) => ({
    id: site.id,
    typeId: site.type_id,
    name: site.name,
    locked: Boolean(site.content_locked),
  }));
}

export function siteForType(userId: number, typeId: string) {
  return userSites(userId).find((s) => s.type_id === typeId);
}

export function ensureSiteForType(userId: number, typeId: SiteTypeId) {
  const existing = siteForType(userId, typeId);
  if (existing) {
    setCurrentSite(userId, existing.id);
    return existing;
  }
  const tplId =
    typeId === "company"
      ? "nova"
      : typeId === "saas"
        ? "pulse"
        : typeId === "ecommerce"
          ? "green"
          : "aura";
  const type = SITE_TYPES.find((t) => t.id === typeId);
  return createSite(userId, tplId, type?.name);
}

export function ensureDefaultSite(userId: number) {
  const existing = userSites(userId)[0];
  if (existing) {
    setCurrentSite(userId, existing.id);
    return existing;
  }
  return createSite(userId, "aura", "AURA Glow Essence");
}

export function setCurrentSite(userId: number, siteId: number) {
  getDb()
    .prepare("UPDATE users SET current_site_id = ? WHERE id = ?")
    .run(siteId, userId);
}

function asPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function customerSession(user: {
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
  last_login_at?: string | null;
}) {
  const site = currentSiteFor(user.id, user.current_site_id);
  touchPresence(site.id, user.id);
  return asPlain({
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone || "0900000000",
      pinLast2: user.pin_last2 || "34",
      nickname: user.nickname || user.name,
      birthday: user.birthday || "",
      avatarUrl: user.avatar_url || "",
      gender: user.gender || "",
      email: user.email || "",
      lastLoginAt: user.last_login_at || "",
    },
    site: publicSite(site),
    typeSites: userTypeSites(user.id),
    members: siteMembers(site.id),
    activities: siteActivities(site.id),
  });
}

export function currentSiteFor(userId: number, currentSiteId: number | null) {
  if (currentSiteId && isMember(currentSiteId, userId)) {
    const site = getSite(currentSiteId);
    if (site) return site;
  }
  return ensureDefaultSite(userId);
}

export function applyTemplate(
  siteId: number,
  userId: number,
  templateId: string,
) {
  const tpl = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
  const site = getSite(siteId);
  if (!site) return undefined;
  const existing = parseJson<Record<string, Record<string, string>>>(
    site.blocks_json,
    {},
  );
  const seed = DEFAULT_VALUES[tpl.id] ?? {};
  const blocks = { ...seed };
  for (const [id, row] of Object.entries(existing)) {
    if (Object.values(row).some((v) => String(v).trim())) {
      blocks[id] = row;
    }
  }
  if (!blocks.site_type?.typeId) {
    blocks.site_type = { typeId: tpl.type };
  }
  getDb()
    .prepare(
      `UPDATE sites
       SET template_id = ?, type_id = ?, name = ?, blocks_json = ?,
           updated_at = datetime('now'), updated_by = ?
       WHERE id = ?`,
    )
    .run(tpl.id, tpl.type, tpl.name, JSON.stringify(blocks), userId, siteId);
  logActivity(siteId, userId, "edit", `Chọn mẫu ${tpl.name}`);
  return getSite(siteId);
}

export function updateSiteType(siteId: number, userId: number, typeId: string) {
  if (!SITE_TYPES.some((t) => t.id === typeId)) return;
  getDb()
    .prepare(
      `UPDATE sites SET type_id = ?, updated_at = datetime('now'), updated_by = ?
       WHERE id = ?`,
    )
    .run(typeId, userId, siteId);
}

export function saveSiteBlocks(
  siteId: number,
  userId: number,
  blocks: Record<string, Record<string, string>>,
  enabled: Record<string, boolean>,
  detail: string,
) {
  getDb()
    .prepare(
      `UPDATE sites
       SET blocks_json = ?, enabled_json = ?, updated_at = datetime('now'), updated_by = ?
       WHERE id = ?`,
    )
    .run(JSON.stringify(blocks), JSON.stringify(enabled), userId, siteId);
  logActivity(siteId, userId, "edit", detail);
}

export function setSiteLocked(siteId: number, userId: number, locked: boolean) {
  getDb()
    .prepare(
      `UPDATE sites
       SET content_locked = ?, updated_at = datetime('now'), updated_by = ?
       WHERE id = ?`,
    )
    .run(locked ? 1 : 0, userId, siteId);
  logActivity(
    siteId,
    userId,
    "edit",
    locked ? "Khóa thông tin sau khi lưu" : "Mở sửa thông tin",
  );
}

export function logActivity(
  siteId: number,
  userId: number,
  action: string,
  detail: string,
) {
  getDb()
    .prepare(
      "INSERT INTO activities (site_id, user_id, action, detail) VALUES (?, ?, ?, ?)",
    )
    .run(siteId, userId, action, detail);
}

export function siteMembers(siteId: number) {
  return getDb()
    .prepare(
      `SELECT u.id, u.name, m.role, m.last_seen,
        CASE WHEN m.last_seen IS NOT NULL
          AND m.last_seen > datetime('now', '-25 seconds')
        THEN 1 ELSE 0 END AS online
       FROM site_members m
       JOIN users u ON u.id = m.user_id
       WHERE m.site_id = ?
       ORDER BY online DESC, u.name`,
    )
    .all(siteId) as {
    id: number;
    name: string;
    role: string;
    last_seen: string | null;
    online: number;
  }[];
}

export function siteActivities(siteId: number, limit = 12) {
  return getDb()
    .prepare(
      `SELECT a.id, a.action, a.detail, a.created_at, u.name
       FROM activities a
       JOIN users u ON u.id = a.user_id
       WHERE a.site_id = ?
       ORDER BY a.id DESC
       LIMIT ?`,
    )
    .all(siteId, limit) as {
    id: number;
    action: string;
    detail: string;
    created_at: string;
    name: string;
  }[];
}

export function listMessages(siteId: number, limit = 80) {
  const rows = getDb()
    .prepare(
      `SELECT m.id, m.body, m.created_at, m.user_id, u.name,
              COALESCE(m.image_url, '') AS image_url,
              COALESCE(m.pinned, 0) AS pinned,
              COALESCE(m.reply_to, 0) AS reply_to,
              COALESCE(r.body, '') AS reply_body,
              COALESCE(ru.name, '') AS reply_name,
              COALESCE(r.image_url, '') AS reply_image
       FROM messages m
       JOIN users u ON u.id = m.user_id
       LEFT JOIN messages r ON r.id = m.reply_to
       LEFT JOIN users ru ON ru.id = r.user_id
       WHERE m.site_id = ?
       ORDER BY m.id DESC
       LIMIT ?`,
    )
    .all(siteId, limit) as {
    id: number;
    body: string;
    created_at: string;
    user_id: number;
    name: string;
    image_url: string;
    pinned: number;
    reply_to: number;
    reply_body: string;
    reply_name: string;
    reply_image: string;
  }[];
  return rows.reverse();
}

export function addMessage(
  siteId: number,
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
      .prepare("SELECT id FROM messages WHERE id = ? AND site_id = ?")
      .get(replyTo, siteId) as { id: number } | undefined;
    if (found) replyId = found.id;
  }
  const info = getDb()
    .prepare(
      "INSERT INTO messages (site_id, user_id, body, image_url, reply_to) VALUES (?, ?, ?, ?, ?)",
    )
    .run(siteId, userId, text, imageUrl || null, replyId);
  return Number(info.lastInsertRowid);
}

export function setMessagePinned(
  siteId: number,
  messageId: number,
  pinned: boolean,
) {
  const info = getDb()
    .prepare(
      "UPDATE messages SET pinned = ? WHERE id = ? AND site_id = ?",
    )
    .run(pinned ? 1 : 0, messageId, siteId);
  return Number(info.changes) > 0;
}

export function ownerSiteIds(userId: number) {
  return (
    getDb()
      .prepare(
        `SELECT s.id
         FROM sites s
         JOIN site_members m ON m.site_id = s.id
         WHERE m.user_id = ? AND m.role = 'owner'
         ORDER BY s.id`,
      )
      .all(userId) as { id: number }[]
  ).map((r) => r.id);
}

export function listCustomerChatThreads() {
  return getDb()
    .prepare(
      `SELECT u.id, u.name,
              COALESCE(u.nickname, u.name) AS nickname,
              COALESCE(u.avatar_url, '') AS avatar_url,
              COALESCE(lm.body, '') AS last_body,
              COALESCE(lm.image_url, '') AS last_image,
              COALESCE(lm.created_at, '') AS last_at,
              COALESCE(lm.user_id, 0) AS last_user_id,
              COALESCE(lu.name, '') AS last_name
       FROM users u
       JOIN site_members m ON m.user_id = u.id AND m.role = 'owner'
       JOIN sites s ON s.id = m.site_id
       LEFT JOIN messages lm ON lm.id = (
         SELECT MAX(x.id) FROM messages x
         JOIN site_members mx ON mx.site_id = x.site_id
         WHERE mx.user_id = u.id AND mx.role = 'owner'
       )
       LEFT JOIN users lu ON lu.id = lm.user_id
       WHERE COALESCE(u.role, 'customer') = 'customer'
       GROUP BY u.id
       ORDER BY COALESCE(lm.id, 0) DESC, u.id DESC`,
    )
    .all() as {
    id: number;
    name: string;
    nickname: string;
    avatar_url: string;
    last_body: string;
    last_image: string;
    last_at: string;
    last_user_id: number;
    last_name: string;
  }[];
}

export function listMessagesForOwner(userId: number, limit = 120) {
  const ids = ownerSiteIds(userId);
  if (!ids.length) return [];
  const placeholders = ids.map(() => "?").join(",");
  const rows = getDb()
    .prepare(
      `SELECT m.id, m.site_id, m.body, m.created_at, m.user_id, u.name,
              s.name AS site_name,
              COALESCE(m.image_url, '') AS image_url,
              COALESCE(m.pinned, 0) AS pinned,
              COALESCE(m.reply_to, 0) AS reply_to,
              COALESCE(r.body, '') AS reply_body,
              COALESCE(ru.name, '') AS reply_name,
              COALESCE(r.image_url, '') AS reply_image
       FROM messages m
       JOIN users u ON u.id = m.user_id
       JOIN sites s ON s.id = m.site_id
       LEFT JOIN messages r ON r.id = m.reply_to
       LEFT JOIN users ru ON ru.id = r.user_id
       WHERE m.site_id IN (${placeholders})
       ORDER BY m.id DESC
       LIMIT ?`,
    )
    .all(...ids, limit) as {
    id: number;
    site_id: number;
    body: string;
    created_at: string;
    user_id: number;
    name: string;
    site_name: string;
    image_url: string;
    pinned: number;
    reply_to: number;
    reply_body: string;
    reply_name: string;
    reply_image: string;
  }[];
  return rows.reverse();
}

export function replySiteForOwner(userId: number) {
  const ids = ownerSiteIds(userId);
  if (!ids.length) return 0;
  const last = getDb()
    .prepare(
      `SELECT site_id FROM messages
       WHERE site_id IN (${ids.map(() => "?").join(",")})
       ORDER BY id DESC LIMIT 1`,
    )
    .get(...ids) as { site_id: number } | undefined;
  if (last && ids.includes(last.site_id)) return last.site_id;
  const user = getDb()
    .prepare("SELECT current_site_id FROM users WHERE id = ?")
    .get(userId) as { current_site_id: number | null } | undefined;
  if (user?.current_site_id && ids.includes(user.current_site_id)) {
    return user.current_site_id;
  }
  return ids[0];
}

export function messageSiteId(messageId: number) {
  const row = getDb()
    .prepare("SELECT site_id FROM messages WHERE id = ?")
    .get(messageId) as { site_id: number } | undefined;
  return row?.site_id ?? 0;
}

export function siteContentComplete(site: SiteRow) {
  const blocks = parseJson<Record<string, Record<string, string>>>(
    site.blocks_json,
    {},
  );
  const typeId = (blocks.site_type?.typeId || site.type_id) as SiteTypeId;
  const checks = draftChecksForType(typeId, blocks, site.template_id);
  return checks.length > 0 && checks.every((item) => item.done);
}

export function savedSiteChatMessage(site: SiteRow) {
  const blocks = parseJson<Record<string, Record<string, string>>>(
    site.blocks_json,
    {},
  );
  const typeId = (blocks.site_type?.typeId || site.type_id) as SiteTypeId;
  const typeName =
    SITE_TYPES.find((t) => t.id === typeId)?.name || "website";
  const lines = [`Đã lưu thông tin ${typeName}`];
  for (const block of contentBlocksForType(typeId as SiteTypeId)) {
    const row = blocks[block.id];
    if (!row) continue;
    const bits: string[] = [];
    for (const field of block.fields) {
      const raw = String(row[field.key] ?? "").trim();
      if (!raw) continue;
      if (field.key === "items") {
        try {
          const items = JSON.parse(raw) as { name?: string; price?: string }[];
          const names = items
            .filter((p) => p.name)
            .map((p) => (p.price ? `${p.name} (${p.price})` : p.name));
          if (names.length) bits.push(names.join(", "));
        } catch {
          bits.push(raw.slice(0, 80));
        }
        continue;
      }
      bits.push(`${field.label}: ${raw}`);
    }
    if (!bits.length) continue;
    lines.push(`• ${block.title}`);
    lines.push(...bits);
  }
  return lines.join("\n").slice(0, 2000);
}
