import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const node = process.execPath;
const watchdog = path.join(root, "scripts", "server-watchdog.mjs");
const launcher = path.join(root, "scripts", "run-server.cmd");
const regFile = path.join(root, "scripts", "webstudio-autostart.reg");

fs.mkdirSync(path.join(root, "logs"), { recursive: true });
fs.writeFileSync(
  launcher,
  `@echo off\r\ncd /d "${root}"\r\n"${node}" "${watchdog}"\r\n`,
);

const escaped = launcher.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
fs.writeFileSync(
  regFile,
  `Windows Registry Editor Version 5.00\r\n\r\n[HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run]\r\n"WebStudioServer"="\\"${escaped}\\""\r\n`,
);

const add = spawnSync(
  "reg",
  [
    "add",
    "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
    "/v",
    "WebStudioServer",
    "/t",
    "REG_SZ",
    "/d",
    `"${launcher}"`,
    "/f",
  ],
  { encoding: "utf8" },
);

if (add.status === 0) {
  console.log("Da ghi khoi dong cung Windows.");
} else {
  console.log("Khong ghi duoc registry tu dong (thieu quyen).");
  console.log(`Hay bam dup: ${regFile}`);
}
console.log(`Lenh server: ${launcher}`);
console.log("Log: logs/server.log");
console.log("Go cai: npm run server:uninstall");
