import { spawnSync } from "node:child_process";

const del = spawnSync(
  "reg",
  [
    "delete",
    "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
    "/v",
    "WebStudioServer",
    "/f",
  ],
  { encoding: "utf8" },
);
if (del.stdout) process.stdout.write(del.stdout);
if (del.stderr) process.stderr.write(del.stderr);
console.log("Da go khoi dong cung Windows.");
