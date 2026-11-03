import tls from "node:tls";

type Pending = { code: string; name: string; expires: number };

const pending = new Map<string, Pending>();

export function issueCode(gmail: string, name: string) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  pending.set(gmail, { code, name, expires: Date.now() + 10 * 60 * 1000 });
  return code;
}

export function checkCode(gmail: string, code: string) {
  const row = pending.get(gmail);
  if (!row || row.expires < Date.now()) return false;
  if (row.code !== code) return false;
  pending.delete(gmail);
  return true;
}

function command(socket: tls.TLSSocket, line: string) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const onData = (buf: Buffer) => {
      chunks.push(buf);
      const text = Buffer.concat(chunks).toString("utf8");
      if (/\r\n$/.test(text) && /^\d{3} /.test(text.trim().split("\r\n").pop() || "")) {
        socket.off("data", onData);
        const status = Number(text.trim().split("\r\n").pop()?.slice(0, 3));
        if (status >= 400) reject(new Error(text.trim()));
        else resolve(text);
      }
    };
    socket.on("data", onData);
    socket.write(line + "\r\n");
  });
}

export async function sendGmailCode(to: string, code: string) {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!user || !pass) {
    throw new Error("Chưa cấu hình GMAIL_USER và GMAIL_APP_PASSWORD trong file .env");
  }

  const socket = tls.connect({ host: "smtp.gmail.com", port: 465, servername: "smtp.gmail.com" });
  await new Promise<void>((resolve, reject) => {
    socket.once("secureConnect", () => resolve());
    socket.once("error", reject);
  });

  const readGreeting = () =>
    new Promise<void>((resolve, reject) => {
      socket.once("data", (buf) => {
        const text = buf.toString("utf8");
        if (!text.startsWith("220")) reject(new Error(text.trim()));
        else resolve();
      });
    });
  await readGreeting();
  await command(socket, "EHLO webstudio");
  await command(socket, "AUTH LOGIN");
  await command(socket, Buffer.from(user).toString("base64"));
  await command(socket, Buffer.from(pass).toString("base64"));
  await command(socket, `MAIL FROM:<${user}>`);
  await command(socket, `RCPT TO:<${to}>`);
  await command(socket, "DATA");
  const body = [
    `From: WebStudio <${user}>`,
    `To: ${to}`,
    "Subject: Ma dang ky WebStudio",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    `Ma xac nhan dang ky WebStudio cua ban la: ${code}`,
    "Ma co hieu luc trong 10 phut.",
    ".",
  ].join("\r\n");
  await command(socket, body);
  socket.end();
}
