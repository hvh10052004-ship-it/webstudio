import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const namedConfig = path.join(root, "cloudflared", "config.yml");
const port = process.env.PORT || "3000";

function findCloudflared() {
  const fromEnv = process.env.CLOUDFLARED_BIN;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;
  const which = spawnSync(process.platform === "win32" ? "where" : "which", ["cloudflared"], {
    encoding: "utf8",
  });
  const first = which.stdout?.split(/\r?\n/).map((s) => s.trim()).find(Boolean);
  if (first && fs.existsSync(first)) return first;
  return "cloudflared";
}

function ensureCloudflared(bin) {
  const check = spawnSync(bin, ["--version"], { encoding: "utf8" });
  if (check.status === 0) return bin;
  if (process.platform === "win32") {
    console.log("Chua co cloudflared. Dang cai bang winget...");
    const install = spawnSync(
      "winget",
      ["install", "--id", "Cloudflare.cloudflared", "-e", "--accept-package-agreements", "--accept-source-agreements"],
      { stdio: "inherit" },
    );
    if (install.status !== 0) {
      console.error("Cai cloudflared that bai. Cai tay: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/");
      process.exit(1);
    }
    return findCloudflared();
  }
  console.error("Can cai cloudflared truoc: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/");
  process.exit(1);
}

const nextDir = path.join(root, ".next");
if (!fs.existsSync(nextDir)) {
  console.log("Chua build. Dang chay npm run build...");
  const build = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (build.status !== 0) process.exit(build.status ?? 1);
}

const cloudflared = ensureCloudflared(findCloudflared());
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

const app = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", port], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

const tunnelArgs = fs.existsSync(namedConfig)
  ? ["tunnel", "--config", namedConfig, "run"]
  : ["tunnel", "--url", `http://127.0.0.1:${port}`];

if (!fs.existsSync(namedConfig)) {
  console.log("");
  console.log("Chua co cloudflared/config.yml — dung Quick Tunnel (URL doi moi lan bat).");
  console.log("De 24/7 on dinh: tai khoan Cloudflare + ten mien, roi copy cloudflared/config.example.yml thanh config.yml");
  console.log("");
}

const tunnel = spawn(cloudflared, tunnelArgs, {
  cwd: root,
  stdio: "inherit",
});

function shutdown() {
  app.kill();
  tunnel.kill();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
app.on("exit", (code) => {
  tunnel.kill();
  process.exit(code ?? 0);
});
tunnel.on("exit", (code) => {
  app.kill();
  process.exit(code ?? 0);
});
