const fs = require("fs");

const src = fs
  .readFileSync(
    "C:/Users/ADMIN/.cursor/projects/e-thiet-ke-website-chuyen-nghiep/agent-tools/3fb293c0-e5ac-4099-a13e-dd0a99037f72.txt",
    "utf8"
  )
  .split(/\r?\n/);

const html = src.slice(23, 404).join("\n");
const css = src.slice(411, 1439).join("\n");
const js = src.slice(1446, 1998).join("\n");

if (!html.startsWith("<!DOCTYPE html>")) {
  throw new Error("HTML start mismatch: " + html.slice(0, 80));
}
if (!html.trimEnd().endsWith("</html>")) {
  throw new Error("HTML end mismatch: " + html.slice(-80));
}
if (!css.includes("#dustCanvas")) {
  throw new Error("CSS missing dustCanvas");
}
if (!js.includes("DOMContentLoaded")) {
  throw new Error("JS start mismatch");
}

const page = html
  .replace('  <link rel="stylesheet" href="style.css">\n', "")
  .replace("</head>", "  <style>\n" + css + "\n  </style>\n</head>")
  .replace(
    '  <script src="script.js"></script>',
    "  <script>\n" + js + "\n  </script>"
  );

const out = "E:/thiet-ke-website-chuyen-nghiep/public/neon-lamp-login.html";
fs.writeFileSync(out, page);
console.log("wrote", out, "bytes", page.length);
