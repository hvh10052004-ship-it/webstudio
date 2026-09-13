export const VN_TZ = "Asia/Ho_Chi_Minh";

/** Giờ hiện tại Việt Nam, dạng `YYYY-MM-DD HH:mm:ss`. */
export function vietnamNowSql() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: VN_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

export function parseStamp(raw: string) {
  const text = raw.trim();
  if (!text) return null;
  if (/Z|[+-]\d{2}:\d{2}$/.test(text)) {
    const d = new Date(text.replace(" ", "T"));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const utc = new Date(text.replace(" ", "T") + "Z");
  return Number.isNaN(utc.getTime()) ? null : utc;
}

/** Hiển thị thời gian theo múi giờ Việt Nam. */
export function formatVietnam(raw: string) {
  const d = parseStamp(raw);
  if (!d) return raw || "";
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: VN_TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}
