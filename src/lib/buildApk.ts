import { spawnSync } from "node:child_process";
import { createHash, createPublicKey, createSign, generateKeyPairSync } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";

const URL_PAD = 128;
const URL_MARK = "_".repeat(URL_PAD);

const ANDROID_NS = "http://schemas.android.com/apk/res/android";

const ATTR = {
  versionCode: 0x0101021b,
  versionName: 0x0101021c,
  minSdkVersion: 0x0101020c,
  targetSdkVersion: 0x01010270,
  name: 0x01010003,
  label: 0x01010001,
  debuggable: 0x0101000f,
  usesCleartextTraffic: 0x010104ec,
  exported: 0x01010010,
} as const;

function toolsDir() {
  return path.join(process.cwd(), "tools", "apk");
}

function u8(n: number) {
  return Buffer.from([n & 255]);
}
function u16(n: number) {
  const b = Buffer.alloc(2);
  b.writeUInt16LE(n, 0);
  return b;
}
function u32(n: number) {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(n >>> 0, 0);
  return b;
}

function tlv(tag: number, content: Buffer) {
  const len = content.length;
  let lenBuf: Buffer;
  if (len < 128) lenBuf = u8(len);
  else if (len < 256) lenBuf = Buffer.from([0x81, len]);
  else if (len < 65536) lenBuf = Buffer.from([0x82, (len >> 8) & 255, len & 255]);
  else {
    lenBuf = Buffer.from([0x83, (len >> 16) & 255, (len >> 8) & 255, len & 255]);
  }
  return Buffer.concat([u8(tag), lenBuf, content]);
}

function derInt(value: Buffer | number) {
  let bytes =
    typeof value === "number"
      ? Buffer.from([value])
      : Buffer.from(value);
  while (bytes.length > 1 && bytes[0] === 0) bytes = bytes.subarray(1);
  if (bytes[0] & 0x80) bytes = Buffer.concat([Buffer.from([0]), bytes]);
  return tlv(0x02, bytes);
}

function derOid(dotted: string) {
  const p = dotted.split(".").map(Number);
  const out = [40 * p[0] + p[1]];
  for (let i = 2; i < p.length; i++) {
    let v = p[i];
    const stack = [v & 127];
    v >>= 7;
    while (v) {
      stack.push((v & 127) | 128);
      v >>= 7;
    }
    for (let j = stack.length - 1; j >= 0; j--) out.push(stack[j]);
  }
  return tlv(0x06, Buffer.from(out));
}

function derNull() {
  return Buffer.from([0x05, 0x00]);
}

function derSeq(...parts: Buffer[]) {
  return tlv(0x30, Buffer.concat(parts));
}
function derSet(...parts: Buffer[]) {
  return tlv(0x31, Buffer.concat(parts));
}
function derBitString(data: Buffer) {
  return tlv(0x03, Buffer.concat([Buffer.from([0]), data]));
}
function derOctet(data: Buffer) {
  return tlv(0x04, data);
}
function derUtf8(s: string) {
  return tlv(0x0c, Buffer.from(s, "utf8"));
}
function derUtc(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yy = pad(d.getUTCFullYear() % 100);
  const body = `${yy}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  return tlv(0x17, Buffer.from(body, "ascii"));
}

function rsaPublicKeyInfo(publicKeyPem: string) {
  return createPublicKey(publicKeyPem).export({ type: "spki", format: "der" }) as Buffer;
}

function ensureDebugKey() {
  const dir = toolsDir();
  mkdirSync(dir, { recursive: true });
  const keyPath = path.join(dir, "debug-key.pem");
  const certPath = path.join(dir, "debug-cert.der");
  if (existsSync(keyPath) && existsSync(certPath)) {
    return {
      privateKey: readFileSync(keyPath, "utf8"),
      cert: readFileSync(certPath),
    };
  }
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  const now = new Date();
  const until = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3650);
  const cn = derSet(
    derSeq(derSeq(derOid("2.5.4.3"), derUtf8("WebStudio Debug"))),
  );
  const algo = derSeq(derOid("1.2.840.113549.1.1.5"), derNull());
  const spki = rsaPublicKeyInfo(publicKey);
  const tbs = derSeq(
    tlv(0xa0, derInt(2)),
    derInt(1),
    algo,
    cn,
    derSeq(derUtc(now), derUtc(until)),
    cn,
    spki,
  );
  const signer = createSign("SHA1");
  signer.update(tbs);
  const signature = signer.sign(privateKey);
  const cert = derSeq(tbs, algo, derBitString(signature));
  writeFileSync(keyPath, privateKey);
  writeFileSync(certPath, cert);
  return { privateKey, cert };
}

function patchDex(dex: Buffer, appUrl: string) {
  const mark = Buffer.from(URL_MARK, "utf8");
  const idx = dex.indexOf(mark);
  if (idx < 0) throw new Error("Không tìm thấy chỗ gắn URL trong APK.");
  const padded = Buffer.from(appUrl.slice(0, URL_PAD).padEnd(URL_PAD, " "), "utf8");
  if (padded.length !== URL_PAD) throw new Error("URL ứng dụng không hợp lệ.");
  const out = Buffer.from(dex);
  padded.copy(out, idx);
  return out;
}

type Pool = { strings: string[]; index: Map<string, number> };

function pool(): Pool {
  return { strings: [], index: new Map() };
}
function addStr(p: Pool, s: string) {
  const hit = p.index.get(s);
  if (hit !== undefined) return hit;
  const i = p.strings.length;
  p.strings.push(s);
  p.index.set(s, i);
  return i;
}

function utf16String(s: string) {
  const chars = Buffer.alloc(s.length * 2);
  for (let i = 0; i < s.length; i++) chars.writeUInt16LE(s.charCodeAt(i), i * 2);
  return Buffer.concat([u16(s.length), chars, u16(0)]);
}

function align4(buf: Buffer) {
  const pad = (4 - (buf.length % 4)) % 4;
  return pad ? Buffer.concat([buf, Buffer.alloc(pad)]) : buf;
}

function stringPool(strings: string[]) {
  const offsets: number[] = [];
  const chunks: Buffer[] = [];
  let off = 0;
  for (const s of strings) {
    offsets.push(off);
    const encoded = utf16String(s);
    chunks.push(encoded);
    off += encoded.length;
  }
  const data = align4(Buffer.concat(chunks));
  const headerSize = 0x1c;
  const stringsStart = headerSize + strings.length * 4;
  const size = stringsStart + data.length;
  return Buffer.concat([
    u16(0x0001),
    u16(headerSize),
    u32(size),
    u32(strings.length),
    u32(0),
    u32(0),
    u32(stringsStart),
    u32(0),
    ...offsets.map(u32),
    data,
  ]);
}

function resMap(ids: number[]) {
  const size = 8 + ids.length * 4;
  return Buffer.concat([u16(0x0180), u16(8), u32(size), ...ids.map(u32)]);
}

function xmlNode(type: number, extra: Buffer, line = 2) {
  const headerSize = 16;
  const size = headerSize + extra.length;
  return Buffer.concat([u16(type), u16(headerSize), u32(size), u32(line), u32(0xffffffff), extra]);
}

const TYPE_STRING = 0x03;
const TYPE_INT = 0x10;
const TYPE_BOOL = 0x12;

function typed(type: number, data: number) {
  return Buffer.concat([u16(8), u8(0), u8(type), u32(data)]);
}

function attr(ns: number, name: number, raw: number, type: number, data: number) {
  return Buffer.concat([u32(ns >>> 0), u32(name >>> 0), u32(raw >>> 0), typed(type, data)]);
}

function startNs(prefix: number, uri: number) {
  return xmlNode(0x0100, Buffer.concat([u32(prefix), u32(uri)]));
}
function endNs(prefix: number, uri: number) {
  return xmlNode(0x0101, Buffer.concat([u32(prefix), u32(uri)]));
}
function startEl(
  ns: number,
  name: number,
  attrs: Buffer[],
  idIdx = 0,
  classIdx = 0,
  styleIdx = 0,
) {
  const attrStart = 20;
  const extra = Buffer.concat([
    u32(ns >>> 0),
    u32(name),
    u16(attrStart),
    u16(20),
    u16(attrs.length),
    u16(idIdx),
    u16(classIdx),
    u16(styleIdx),
    ...attrs,
  ]);
  const headerSize = 16;
  const size = headerSize + extra.length;
  return Buffer.concat([u16(0x0102), u16(headerSize), u32(size), u32(3), u32(0xffffffff), extra]);
}
function endEl(ns: number, name: number) {
  return xmlNode(0x0103, Buffer.concat([u32(ns >>> 0), u32(name)]));
}

function buildManifest() {
  const p = pool();
  const android = addStr(p, "android");
  const nsUri = addStr(p, ANDROID_NS);
  const attrNames: { name: string; id: number }[] = [
    { name: "versionCode", id: ATTR.versionCode },
    { name: "versionName", id: ATTR.versionName },
    { name: "minSdkVersion", id: ATTR.minSdkVersion },
    { name: "targetSdkVersion", id: ATTR.targetSdkVersion },
    { name: "name", id: ATTR.name },
    { name: "label", id: ATTR.label },
    { name: "debuggable", id: ATTR.debuggable },
    { name: "usesCleartextTraffic", id: ATTR.usesCleartextTraffic },
    { name: "exported", id: ATTR.exported },
  ];
  const attrIdx: Record<string, number> = {};
  const ids: number[] = new Array(p.strings.length).fill(0);
  for (const a of attrNames) {
    attrIdx[a.name] = addStr(p, a.name);
  }
  while (ids.length < p.strings.length) ids.push(0);
  for (const a of attrNames) ids[attrIdx[a.name]] = a.id;

  const manifest = addStr(p, "manifest");
  const pkg = addStr(p, "package");
  const usesSdk = addStr(p, "uses-sdk");
  const usesPerm = addStr(p, "uses-permission");
  const application = addStr(p, "application");
  const activity = addStr(p, "activity");
  const intentFilter = addStr(p, "intent-filter");
  const action = addStr(p, "action");
  const category = addStr(p, "category");
  const pkgName = addStr(p, "com.webstudio.khach");
  const verName = addStr(p, "1.8.3");
  const label = addStr(p, "WebStudio");
  const internet = addStr(p, "android.permission.INTERNET");
  const network = addStr(p, "android.permission.ACCESS_NETWORK_STATE");
  const activityName = addStr(p, "com.webstudio.khach.MainActivity");
  const main = addStr(p, "android.intent.action.MAIN");
  const launcher = addStr(p, "android.intent.category.LAUNCHER");

  const ns = {
    str: (key: string, value: number) =>
      attr(nsUri, attrIdx[key], value, TYPE_STRING, value),
    int: (key: string, value: number) =>
      attr(nsUri, attrIdx[key], 0xffffffff, TYPE_INT, value),
    bool: (key: string, on: boolean) =>
      attr(nsUri, attrIdx[key], 0xffffffff, TYPE_BOOL, on ? 0xffffffff : 0),
  };

  const body = Buffer.concat([
    startNs(android, nsUri),
    startEl(-1, manifest, [
      attr(0xffffffff, pkg, pkgName, TYPE_STRING, pkgName),
      ns.int("versionCode", 14),
      ns.str("versionName", verName),
    ]),
    startEl(-1, usesSdk, [ns.int("minSdkVersion", 21), ns.int("targetSdkVersion", 28)]),
    endEl(-1, usesSdk),
    startEl(-1, usesPerm, [ns.str("name", internet)]),
    endEl(-1, usesPerm),
    startEl(-1, usesPerm, [ns.str("name", network)]),
    endEl(-1, usesPerm),
    startEl(-1, application, [
      ns.str("label", label),
      ns.bool("debuggable", true),
      ns.bool("usesCleartextTraffic", true),
    ]),
    startEl(-1, activity, [ns.str("name", activityName), ns.bool("exported", true)]),
    startEl(-1, intentFilter, []),
    startEl(-1, action, [ns.str("name", main)]),
    endEl(-1, action),
    startEl(-1, category, [ns.str("name", launcher)]),
    endEl(-1, category),
    endEl(-1, intentFilter),
    endEl(-1, activity),
    endEl(-1, application),
    endEl(-1, manifest),
    endNs(android, nsUri),
  ]);

  const chunks = Buffer.concat([stringPool(p.strings), resMap(ids), body]);
  const file = Buffer.concat([u16(0x0003), u16(8), u32(8 + chunks.length), chunks]);
  file.writeUInt32LE(file.length, 4);
  return file;
}

function crc32(buf: Buffer) {
  if (typeof zlib.crc32 === "function") return zlib.crc32(buf) >>> 0;
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}

type ZipEntry = { name: string; data: Buffer };

function zipApk(files: ZipEntry[]) {
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;
  for (const file of files) {
    const name = Buffer.from(file.name, "utf8");
    const crc = crc32(file.data);
    let extraLen = (4 - ((30 + name.length) % 4)) % 4;
    const local = Buffer.concat([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(file.data.length),
      u32(file.data.length),
      u16(name.length),
      u16(extraLen),
      name,
      Buffer.alloc(extraLen),
      file.data,
    ]);
    const central = Buffer.concat([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(file.data.length),
      u32(file.data.length),
      u16(name.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      name,
    ]);
    locals.push(local);
    centrals.push(central);
    offset += local.length;
  }
  const centralDir = Buffer.concat(centrals);
  const eocd = Buffer.concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(centralDir.length),
    u32(offset),
    u16(0),
  ]);
  return Buffer.concat([...locals, centralDir, eocd]);
}

function sha1b64(buf: Buffer) {
  return createHash("sha1").update(buf).digest("base64");
}

function signJar(files: ZipEntry[], privateKey: string, cert: Buffer) {
  const manifestLines = ["Manifest-Version: 1.0", "Created-By: WebStudio", ""];
  const sections: { name: string; block: string }[] = [];
  for (const file of files) {
    const digest = sha1b64(file.data);
    const block = `Name: ${file.name}\r\nSHA1-Digest: ${digest}\r\n\r\n`;
    manifestLines.push(`Name: ${file.name}`, `SHA1-Digest: ${digest}`, "");
    sections.push({ name: file.name, block });
  }
  const manifest = Buffer.from(`${manifestLines.join("\r\n")}\r\n`, "utf8");
  const sfLines = [
    "Signature-Version: 1.0",
    "Created-By: WebStudio",
    `SHA1-Digest-Manifest: ${sha1b64(manifest)}`,
    "",
  ];
  for (const section of sections) {
    sfLines.push(`Name: ${section.name}`, `SHA1-Digest: ${sha1b64(Buffer.from(section.block, "utf8"))}`, "");
  }
  const sf = Buffer.from(`${sfLines.join("\r\n")}\r\n`, "utf8");
  const signer = createSign("SHA1");
  signer.update(sf);
  const signature = signer.sign(privateKey);
  const digestAlg = derSeq(derOid("1.3.14.3.2.26"), derNull());
  const sigAlg = derSeq(derOid("1.2.840.113549.1.1.5"), derNull());
  const issuerAndSerial = derSeq(
    derSeq(derSet(derSeq(derSeq(derOid("2.5.4.3"), derUtf8("WebStudio Debug"))))),
    derInt(1),
  );
  const signerInfo = derSeq(
    derInt(1),
    issuerAndSerial,
    digestAlg,
    sigAlg,
    derOctet(signature),
  );
  const signedData = derSeq(
    derInt(1),
    derSet(digestAlg),
    derSeq(derOid("1.2.840.113549.1.7.1")),
    tlv(0xa0, cert),
    derSet(signerInfo),
  );
  const pkcs7 = derSeq(derOid("1.2.840.113549.1.7.2"), tlv(0xa0, signedData));
  return [
    ...files,
    { name: "META-INF/MANIFEST.MF", data: manifest },
    { name: "META-INF/CERT.SF", data: sf },
    { name: "META-INF/CERT.RSA", data: pkcs7 },
  ];
}

function publicOrigin(request: Request) {
  const configured = process.env.PUBLIC_ORIGIN?.trim().replace(/\/$/, "");
  if (configured) return configured;
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;
  const hostName = host.split(":")[0];
  const port = host.includes(":") ? host.split(":").pop() : url.port || "3000";
  if (hostName === "localhost" || hostName === "127.0.0.1" || hostName === "[::1]") {
    const ip = firstLanIpv4();
    if (ip) return `http://${ip}:${port || "3000"}`;
  }
  const proto =
    request.headers.get("x-forwarded-proto") ??
    (url.protocol ? url.protocol.replace(":", "") : "http");
  return `${proto}://${host}`;
}

export function publicAppUrl(request: Request) {
  return `${publicOrigin(request)}/app-khach`;
}

export function publicAdminUrl(request: Request) {
  return `${publicOrigin(request)}/admin`;
}

function firstLanIpv4() {
  const preferred: string[] = [];
  const rest: string[] = [];
  for (const [name, list] of Object.entries(os.networkInterfaces())) {
    if (/hotspot|bluetooth|vmware|virtualbox|vethernet|loopback|pseudo/i.test(name)) {
      continue;
    }
    for (const item of list ?? []) {
      const family = String(item.family);
      if ((family !== "IPv4" && family !== "4") || item.internal) continue;
      if (item.address.startsWith("192.168.") || item.address.startsWith("10.")) {
        preferred.push(item.address);
      } else {
        rest.push(item.address);
      }
    }
  }
  return preferred[0] || rest[0] || null;
}

function injectDex(apkPath: string, dex: Buffer) {
  const dexFile = `${apkPath}.classes.dex`;
  writeFileSync(dexFile, dex);
  const esc = (value: string) => value.replace(/'/g, "''");
  const script = `
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [IO.Compression.ZipFile]::Open('${esc(apkPath)}', 'Update')
    $old = $zip.GetEntry('classes.dex')
    if ($old) { $old.Delete() }
    $entry = $zip.CreateEntry('classes.dex', 'NoCompression')
    $bytes = [IO.File]::ReadAllBytes('${esc(dexFile)}')
    $stream = $entry.Open()
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Close()
    $zip.Dispose()
  `;
  const result = spawnSync("powershell", ["-NoProfile", "-Command", script], {
    encoding: "utf8",
    windowsHide: true,
  });
  rmSync(dexFile, { force: true });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "Không gắn classes.dex vào APK.");
  }
}

function signApkFile(unsignedPath: string) {
  const jar = path.join(toolsDir(), "uber-apk-signer.jar");
  const java = javaBin();
  if (!existsSync(jar) || !java) throw new Error("Thiếu công cụ ký APK.");
  const dir = mkdtempSync(path.join(os.tmpdir(), "ws-apk-"));
  const ks = path.join(toolsDir(), "release.p12");
  const args = ["-jar", jar, "-a", unsignedPath, "--out", dir, "--allowResign"];
  if (existsSync(ks)) {
    args.push(
      "--ks",
      ks,
      "--ksAlias",
      "webstudio",
      "--ksPass",
      "webstudio-release",
      "--ksKeyPass",
      "webstudio-release",
    );
  }
  const result = spawnSync(java, args, {
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.status !== 0) {
    rmSync(dir, { recursive: true, force: true });
    throw new Error(result.stderr || result.stdout || "Không ký được APK.");
  }
  const signed = readdirSync(dir).find((name) => name.endsWith(".apk"));
  if (!signed) {
    rmSync(dir, { recursive: true, force: true });
    throw new Error("Không tìm thấy APK đã ký.");
  }
  const bytes = readFileSync(path.join(dir, signed));
  rmSync(dir, { recursive: true, force: true });
  return bytes;
}

function androidJar() {
  const sdk = path.join(
    process.env.LOCALAPPDATA || "",
    "Android",
    "Sdk",
    "platforms",
    "android-37.0",
    "android.jar",
  );
  if (existsSync(sdk)) return sdk;
  const local = path.join(toolsDir(), "android.jar");
  if (existsSync(local)) return local;
  throw new Error("Thiếu android.jar để biên dịch APK.");
}

function javaRtJar() {
  const home = process.env.JAVA_HOME || "";
  const candidates = [
    path.join(home, "jre", "lib", "rt.jar"),
    path.join(home, "lib", "rt.jar"),
    "C:\\Program Files\\Java\\jre-1.8\\lib\\rt.jar",
    "C:\\Program Files\\Java\\jdk1.8.0_401\\jre\\lib\\rt.jar",
  ];
  for (const candidate of candidates) {
    if (candidate && existsSync(candidate)) return candidate;
  }
  throw new Error("Thiếu Java 8 (rt.jar) để biên dịch APK.");
}

function compileWebViewDex() {
  const tools = toolsDir();
  const dexPath = path.join(tools, "template", "classes.dex");
  if (existsSync(dexPath)) return;
  const ecj = path.join(tools, "ecj.jar");
  const dx = path.join(tools, "dx.jar");
  const src = path.join(tools, "src", "com", "webstudio", "khach", "MainActivity.java");
  const out = path.join(tools, "classes-out");
  if (!existsSync(ecj) || !existsSync(dx) || !existsSync(src)) return;
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  mkdirSync(path.join(tools, "template"), { recursive: true });
  const boot = `${javaRtJar()}${path.delimiter}${androidJar()}`;
  const compiled = spawnSync(
    "java",
    ["-jar", ecj, "-1.6", "-bootclasspath", boot, "-d", out, src],
    { encoding: "utf8", windowsHide: true },
  );
  if (compiled.status !== 0) {
    throw new Error(compiled.stderr || compiled.stdout || "Không biên dịch được WebView APK.");
  }
  const dexed = spawnSync(
    "java",
    ["-cp", dx, "com.android.dx.command.Main", "--dex", `--output=${dexPath}`, out],
    { encoding: "utf8", windowsHide: true },
  );
  if (dexed.status !== 0) {
    throw new Error(dexed.stderr || dexed.stdout || "Không tạo được classes.dex.");
  }
}

function javaBin() {
  const candidates = [
    "java",
    process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, "bin", "java.exe") : "",
    process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, "bin", "java") : "",
    "C:\\Program Files\\Android\\Android Studio\\jbr\\bin\\java.exe",
    "C:\\Program Files\\Java\\jdk-17\\bin\\java.exe",
    "C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.12-hotspot\\bin\\java.exe",
  ].filter(Boolean);
  for (const bin of candidates) {
    if (bin !== "java" && !existsSync(bin)) continue;
    const probe = spawnSync(bin, ["-version"], { encoding: "utf8", windowsHide: true });
    if (probe.status === 0 || /version/i.test(`${probe.stdout}${probe.stderr}`)) {
      return bin;
    }
  }
  return null;
}

function resolveDexPath() {
  const candidates = [
    path.join(toolsDir(), "template", "classes.dex"),
    path.join(toolsDir(), "classes.dex"),
  ];
  for (const file of candidates) {
    if (existsSync(file)) return file;
  }
  compileWebViewDex();
  for (const file of candidates) {
    if (existsSync(file)) return file;
  }
  throw new Error("Thiếu classes.dex để đóng gói APK.");
}

function patchedDex(dexPath: string, appUrl: string) {
  const raw = readFileSync(dexPath);
  return raw.includes(Buffer.from(URL_MARK, "utf8")) ? patchDex(raw, appUrl) : raw;
}

function addAssetTree(files: ZipEntry[], absDir: string, zipPrefix: string) {
  if (!existsSync(absDir)) return;
  for (const entry of readdirSync(absDir, { withFileTypes: true })) {
    const abs = path.join(absDir, entry.name);
    const zip = `${zipPrefix}${entry.name}`.replace(/\\/g, "/");
    if (entry.isDirectory()) {
      addAssetTree(files, abs, `${zip}/`);
    } else {
      files.push({ name: zip, data: readFileSync(abs) });
    }
  }
}

function assembleWithNode(decoded: string, appUrl: string, dexPath: string) {
  const template = path.join(toolsDir(), "template");
  const manifestBin = path.join(template, "AndroidManifest.xml");
  const arsc = path.join(template, "resources.arsc");
  const files: ZipEntry[] = [
    {
      name: "AndroidManifest.xml",
      data: existsSync(manifestBin) ? readFileSync(manifestBin) : buildManifest(),
    },
    { name: "classes.dex", data: patchedDex(dexPath, appUrl) },
  ];
  if (existsSync(arsc)) {
    files.push({ name: "resources.arsc", data: readFileSync(arsc) });
  }
  addAssetTree(files, path.join(template, "res"), "res/");
  addAssetTree(files, path.join(decoded, "assets"), "assets/");
  const seen = new Set<string>();
  const unique = files.filter((file) => {
    if (seen.has(file.name)) return false;
    seen.add(file.name);
    return true;
  });
  const key = ensureDebugKey();
  return zipApk(signJar(unique, key.privateKey, key.cert));
}

function assembleAndSignApk(decoded: string, appUrl: string) {
  const dexPath = resolveDexPath();
  const apktool = path.join(toolsDir(), "apktool.jar");
  const java = javaBin();
  if (java && existsSync(apktool) && existsSync(decoded)) {
    const dir = mkdtempSync(path.join(os.tmpdir(), "ws-apk-"));
    const unsigned = path.join(dir, "unsigned.apk");
    const built = spawnSync(java, ["-jar", apktool, "b", decoded, "-f", "-o", unsigned], {
      encoding: "utf8",
      windowsHide: true,
    });
    if (built.status === 0) {
      const smaliDir = path.join(decoded, "smali");
      if (!existsSync(smaliDir)) {
        injectDex(unsigned, patchedDex(dexPath, appUrl));
      }
      const signed = signApkFile(unsigned);
      rmSync(dir, { recursive: true, force: true });
      return signed;
    }
    rmSync(dir, { recursive: true, force: true });
  }
  return assembleWithNode(decoded, appUrl, dexPath);
}

function adminHomeHtml(adminUrl: string) {
  const safe = JSON.stringify(adminUrl);
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta http-equiv="refresh" content="0;url=${adminUrl.replace(/"/g, "")}" />
  <title>WebStudio Admin</title>
  <style>
    html,body{margin:0;height:100%;background:#eef1f6;color:#1a2230;font-family:sans-serif}
    .wrap{min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;gap:16px}
    a{color:#4f43c8;font-weight:700}
  </style>
  <script>location.replace(${safe});</script>
</head>
<body>
  <div class="wrap">
    <p>Đang mở app quản trị…</p>
    <p><a href=${safe}>Mở trang admin</a></p>
  </div>
</body>
</html>`;
}

export function buildCustomerApk(appUrl: string) {
  const decodedSrc = path.join(toolsDir(), "decoded");
  if (!existsSync(decodedSrc)) throw new Error("Thiếu bộ đóng gói APK.");
  const dir = mkdtempSync(path.join(os.tmpdir(), "ws-apk-khach-"));
  const decoded = path.join(dir, "decoded");
  try {
    cpSync(decodedSrc, decoded, { recursive: true });
    writeFileSync(path.join(decoded, "assets", "www", "start.txt"), appUrl.trim());
    return assembleAndSignApk(decoded, appUrl);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function buildAdminApk(adminUrl: string) {
  const decodedSrc = path.join(toolsDir(), "decoded");
  if (!existsSync(decodedSrc)) throw new Error("Thiếu bộ đóng gói APK.");
  const dir = mkdtempSync(path.join(os.tmpdir(), "ws-apk-admin-"));
  const decoded = path.join(dir, "decoded");
  try {
    cpSync(decodedSrc, decoded, { recursive: true });
    writeFileSync(path.join(decoded, "assets", "www", "home.html"), adminHomeHtml(adminUrl));
    writeFileSync(path.join(decoded, "assets", "www", "index.html"), adminHomeHtml(adminUrl));
    writeFileSync(path.join(decoded, "assets", "www", "start.txt"), adminUrl.trim());
    writeFileSync(
      path.join(decoded, "res", "values", "strings.xml"),
      `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">WebStudio Admin</string>
    <string name="splash_title">WebStudio Admin</string>
    <string name="app_version">1.8.1</string>
    <string name="loading">Đang tải app quản trị…</string>
    <string name="offline_title">Mất kết nối</string>
</resources>
`,
    );
    const manifestPath = path.join(decoded, "AndroidManifest.xml");
    const manifest = readFileSync(manifestPath, "utf8").replace(
      'package="com.webstudio.khach"',
      'package="com.webstudio.admin"',
    );
    writeFileSync(manifestPath, manifest);
    return assembleAndSignApk(decoded, adminUrl);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function defaultCustomerAppUrl() {
  const origin = process.env.PUBLIC_ORIGIN?.trim().replace(/\/$/, "");
  if (origin) {
    if (process.env.APP_KHACH_STATIC === "1" || /github\.io/i.test(origin)) return `${origin}/`;
    return `${origin}/app-khach`;
  }
  const ip = firstLanIpv4();
  return `http://${ip || "127.0.0.1"}:3000/app-khach`;
}

export function saveApkCopies(fileName: string, apk: Buffer) {
  const root = process.cwd();
  const folders = [
    root,
    path.join(root, "dist"),
    path.join(root, "docs"),
  ];
  for (const folder of folders) {
    mkdirSync(folder, { recursive: true });
    writeFileSync(path.join(folder, fileName), apk);
  }
  const downloads = path.join(os.homedir(), "Downloads");
  if (existsSync(downloads)) {
    writeFileSync(path.join(downloads, fileName), apk);
  }
}

export function saveAdminApkCopies(apk: Buffer) {
  saveApkCopies("WebStudio-Admin.apk", apk);
}

