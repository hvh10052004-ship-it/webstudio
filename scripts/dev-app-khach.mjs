import { spawn } from "node:child_process";

process.env.APP_KHACH_SERVER = "1";
process.env.NEXT_PUBLIC_APP_KHACH_SERVER = "1";

const child = spawn("npx", ["next", "dev", "--hostname", "0.0.0.0"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
