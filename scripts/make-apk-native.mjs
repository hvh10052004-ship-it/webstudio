import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

function u16(n) {
  const b = Buffer.alloc(2);
  b.writeUInt16LE(n);
  return b;
}
function u32(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(n >>> 0);
  return b;
}
function u64(n) {
  const b = Buffer.alloc(8);
  b.writeUInt32LE(n >>> 0, 0);
  b.writeUInt32LE(0, 4);
  return b;
}

function elf32(machine, code) {
  const ident = Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const ehSize = 52;
  const phSize = 32;
  const phNum = 2;
  const codeOff = ehSize + phSize * phNum;
  const fileSize = codeOff + code.length;
  const header = Buffer.concat([
    ident,
    u16(3),
    u16(machine),
    u32(1),
    u32(codeOff),
    u32(ehSize),
    u32(0),
    u32(0x5000000),
    u16(ehSize),
    u16(phSize),
    u16(phNum),
    u16(0),
    u16(0),
    u16(0),
  ]);
  const load = Buffer.concat([
    u32(1),
    u32(0),
    u32(0),
    u32(0),
    u32(fileSize),
    u32(fileSize),
    u32(5),
    u32(0x1000),
  ]);
  const stack = Buffer.concat([
    u32(0x6474e551),
    u32(0),
    u32(0),
    u32(0),
    u32(0),
    u32(0),
    u32(6),
    u32(0x10),
  ]);
  return Buffer.concat([header, load, stack, code]);
}

function elf64(machine, code) {
  const ident = Buffer.from([0x7f, 0x45, 0x4c, 0x46, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const ehSize = 64;
  const phSize = 56;
  const phNum = 2;
  const codeOff = ehSize + phSize * phNum;
  const fileSize = codeOff + code.length;
  const header = Buffer.concat([
    ident,
    u16(3),
    u16(machine),
    u32(1),
    u64(codeOff),
    u64(ehSize),
    u64(0),
    u32(0),
    u16(ehSize),
    u16(phSize),
    u16(phNum),
    u16(0),
    u16(0),
    u16(0),
  ]);
  const load = Buffer.concat([
    u32(1),
    u32(5),
    u64(0),
    u64(0),
    u64(0),
    u64(fileSize),
    u64(fileSize),
    u64(0x1000),
  ]);
  const stack = Buffer.concat([
    u32(0x6474e551),
    u32(6),
    u64(0),
    u64(0),
    u64(0),
    u64(0),
    u64(0),
    u64(0x10),
  ]);
  return Buffer.concat([header, load, stack, code]);
}

const root = path.join(process.cwd(), "tools", "apk", "decoded", "lib");
const files = {
  "armeabi-v7a": elf32(40, Buffer.from([0x1e, 0xff, 0x2f, 0xe1])),
  "arm64-v8a": elf64(183, Buffer.from([0xc0, 0x03, 0x5f, 0xd6])),
  "x86_64": elf64(62, Buffer.from([0xc3])),
};
for (const [abi, buf] of Object.entries(files)) {
  const dir = path.join(root, abi);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "libwsstub.so"), buf);
}
console.log("native stubs written");
