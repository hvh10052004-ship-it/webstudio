import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { buildCustomerApk, publicAppUrl, saveApkCopies } from "@/lib/buildApk";

export const runtime = "nodejs";

const APK_HEADERS = {
  "Content-Type": "application/vnd.android.package-archive",
  "Content-Disposition":
    'attachment; filename="WebStudio.apk"; filename*=UTF-8\'\'WebStudio.apk',
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "no-store",
};

function existingApk() {
  const direct = [
    path.join(
      /* turbopackIgnore: true */ process.cwd(),
      "android",
      "app",
      "build",
      "outputs",
      "apk",
      "debug",
      "webstudio.apk",
    ),
    path.join(/* turbopackIgnore: true */ process.cwd(), "public", "webstudio.apk"),
    path.join(/* turbopackIgnore: true */ process.cwd(), "public", "WebStudio.apk"),
  ];
  for (const file of direct) {
    if (existsSync(/* turbopackIgnore: true */ file)) {
      return readFileSync(/* turbopackIgnore: true */ file);
    }
  }
  return null;
}

function apkResponse(apk: Buffer) {
  return new NextResponse(new Uint8Array(apk), { headers: APK_HEADERS });
}

export function GET(request: Request) {
  const ready = existingApk();
  if (ready) return apkResponse(ready);
  try {
    const apk = buildCustomerApk(publicAppUrl(request));
    try {
      saveApkCopies("webstudio.apk", apk);
      saveApkCopies("WebStudio.apk", apk);
    } catch {
      // vẫn trả file tải dù không ghi được ra đĩa
    }
    return apkResponse(apk);
  } catch {
    const apk = existingApk();
    if (apk) return apkResponse(apk);
    return NextResponse.json(
      { error: "Chưa có tệp webstudio.apk để tải xuống." },
      { status: 500 },
    );
  }
}
