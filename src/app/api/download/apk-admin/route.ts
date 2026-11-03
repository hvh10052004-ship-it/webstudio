import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export function GET() {
  const file = path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "public",
    "WebStudio-Admin.apk",
  );
  if (!existsSync(/* turbopackIgnore: true */ file)) {
    return NextResponse.json(
      { error: "Chưa có tệp WebStudio-Admin.apk." },
      { status: 404 },
    );
  }
  const apk = readFileSync(/* turbopackIgnore: true */ file);
  return new NextResponse(new Uint8Array(apk), {
    headers: {
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Disposition": 'attachment; filename="WebStudio-Admin.apk"',
      "Cache-Control": "no-store",
    },
  });
}
