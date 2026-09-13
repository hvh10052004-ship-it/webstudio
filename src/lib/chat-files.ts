import fs from "node:fs";
import path from "node:path";

const MAX = 2_000_000;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function saveChatImage(file: File) {
  if (file.size < 20) return { error: "Chưa có ảnh", status: 400 as const };
  if (file.size > MAX) return { error: "Ảnh tối đa 2MB", status: 400 as const };
  if (!ALLOWED.has(file.type)) {
    return { error: "Chỉ nhận JPG, PNG, WEBP hoặc GIF", status: 400 as const };
  }
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";
  const dir = path.join(process.cwd(), "public", "chat");
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  fs.writeFileSync(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return { url: `/chat/${filename}` };
}
