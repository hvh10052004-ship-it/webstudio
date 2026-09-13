import { createConnection } from "node:net";
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const logsDir = path.join(root, "logs");
const pidFile = path.join(logsDir, "server.pid");
const namedConfig = path.join(root, "cloudflared", "config.yml");
const port = Number(process.env.PORT || "3000");
const hostname = process.env.HOSTNAME || "0.0.0.0";
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

fs.mkdirSync(logsDir, { recursive: true });

const logStream = fs.createWriteStream(path.join(logsDir, "server.log"), { flags: "a" });

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}`;
  logStream.write(`${line}\n`);
  console.log(line);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function portOpen() {
  return new Promise((resolve) => {
    const socket = createConnection({ host: "127.0.0.1", port }, () => {
      socket.end();
      resolve(true);
    });
    socket.on("error", () => resolve(false));
    socket.setTimeout(800, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

function isPlaceholderConfig(text) {
  return /THAY-BANG-ID-TUNNEL|ten-mien-cua-ban/i.test(text);
}

function findCloudflared() {
  const fromEnv = process.env.CLOUDFLARED_BIN;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;
  const which = spawnSync(process.platform === "win32" ? "where" : "which", ["cloudflared"], {
    encoding: "utf8",
  });
  const first = which.stdout?.split(/\r?\n/).map((s) => s.trim()).find(Boolean);
  return first && fs.existsSync(first) ? first : "";
}

function spawnLogged(command, args, name) {
  const child = spawn(command, args, {
    cwd: root,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  const prefix = (chunk) => {
    const text = chunk.toString();
    for (const line of text.split(/\r?\n/)) {
      if (line) log(`[${name}] ${line}`);
    }
  };
  child.stdout.on("data", prefix);
  child.stderr.on("data", prefix);
  return child;
}

let app = null;
let tunnel = null;
let stopping = false;

function stopChild(child) {
  if (!child || child.killed) return;
  child.kill();
}

function shutdown() {
  stopping = true;
  stopChild(app);
  stopChild(tunnel);
  try {
    if (fs.existsSync(pidFile)) fs.unlinkSync(pidFile);
  } catch {
    /* ignore */
  }
  setTimeout(() => process.exit(0), 400);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("SIGHUP", shutdown);

if (fs.existsSync(pidFile)) {
  const oldPid = Number(fs.readFileSync(pidFile, "utf8").trim());
  if (oldPid && oldPid !== process.pid) {
    try {
      process.kill(oldPid, 0);
      log(`Watchdog cu dang chay (pid ${oldPid}), thoat.`);
      process.exit(0);
    } catch {
      /* process khong con */
    }
  }
}
fs.writeFileSync(pidFile, String(process.pid));

if (!fs.existsSync(path.join(root, ".next"))) {
  log("Chua build. Dang chay npm run build...");
  const build = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (build.status !== 0) process.exit(build.status ?? 1);
}

async function keepApp() {
  while (!stopping) {
    if (await portOpen()) {
      log(`Cong ${port} dang duoc dung. Doi 15s roi thu lai...`);
      await sleep(15000);
      continue;
    }
    log(`Khoi dong Next.js ${hostname}:${port}`);
    app = spawnLogged(process.execPath, [nextBin, "start", "--hostname", hostname, "--port", String(port)], "next");
    await new Promise((resolve) => app.once("exit", resolve));
    app = null;
    if (stopping) break;
    log("Next.js dung. Khoi dong lai sau 3s...");
    await sleep(3000);
  }
}

async function keepTunnel() {
  if (!fs.existsSync(namedConfig)) {
    log("Bo qua Cloudflare Tunnel (chua co cloudflared/config.yml).");
    return;
  }
  const text = fs.readFileSync(namedConfig, "utf8");
  if (isPlaceholderConfig(text)) {
    log("Bo qua Cloudflare Tunnel (config.yml chua dien ID/ten mien that).");
    return;
  }
  const bin = findCloudflared();
  if (!bin) {
    log("Bo qua Cloudflare Tunnel (chua cai cloudflared).");
    return;
  }
  while (!stopping) {
    log("Khoi dong Cloudflare Tunnel");
    tunnel = spawnLogged(bin, ["tunnel", "--config", namedConfig, "run"], "tunnel");
    await new Promise((resolve) => tunnel.once("exit", resolve));
    tunnel = null;
    if (stopping) break;
    log("Tunnel dung. Khoi dong lai sau 5s...");
    await sleep(5000);
  }
}

log("Watchdog bat dau");
await Promise.all([keepApp(), keepTunnel()]);
