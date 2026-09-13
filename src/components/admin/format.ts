import { SITE_TYPES, TEMPLATES } from "@/data/app-khach";
import { formatVietnam, parseStamp } from "@/lib/vietnam-time";

export function typeLabel(id: string) {
  return SITE_TYPES.find((t) => t.id === id)?.name ?? id;
}

export function templateLabel(id: string) {
  return TEMPLATES.find((t) => t.id === id)?.name ?? id;
}

export function formatAgo(raw: string) {
  if (!raw) return "";
  const d = parseStamp(raw);
  if (!d) return raw;
  const diff = Date.now() - d.getTime();
  if (diff < 60_000) return "Vừa xong";
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins} phút`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày`;
  return formatWhen(raw);
}

export function formatWhen(raw: string) {
  return formatVietnam(raw);
}

export function clip(text: string, n = 90) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n)}…` : t;
}
