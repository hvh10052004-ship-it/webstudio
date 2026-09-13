import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(size, paint) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    const row = y * (size * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = paint(x, y, size);
      const i = row + 1 + x * 4;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
      raw[i + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function inW(x, y, s) {
  const n = x / s;
  const m = y / s;
  if (m < 0.22 || m > 0.8) return false;
  const left = n > 0.22 && n < 0.34;
  const right = n > 0.66 && n < 0.78;
  const diag = Math.abs(m - n) < 0.08 && n > 0.28 && n < 0.72;
  return left || right || diag;
}

function paintIcon(x, y, s) {
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.46;
  if ((x - cx) ** 2 + (y - cy) ** 2 > r * r) return [0, 0, 0, 0];
  if (inW(x, y, s)) return [255, 255, 255, 255];
  return [91, 75, 221, 255];
}

const root = process.cwd();
const drawable = path.join(root, "tools", "apk", "decoded", "res", "drawable");
const icons = path.join(root, "public", "icons");
mkdirSync(drawable, { recursive: true });
mkdirSync(icons, { recursive: true });
writeFileSync(path.join(drawable, "ic_launcher.png"), encodePng(192, paintIcon));
const mipmaps = [
  ["mipmap-mdpi", 48],
  ["mipmap-hdpi", 72],
  ["mipmap-xhdpi", 96],
  ["mipmap-xxhdpi", 144],
  ["mipmap-xxxhdpi", 192],
];
for (const [folder, size] of mipmaps) {
  const dir = path.join(root, "tools", "apk", "decoded", "res", folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "ic_launcher.png"), encodePng(size, paintIcon));
}
writeFileSync(path.join(icons, "app-khach-192.png"), encodePng(192, paintIcon));
writeFileSync(path.join(icons, "app-khach-512.png"), encodePng(512, paintIcon));
console.log("icons written");
