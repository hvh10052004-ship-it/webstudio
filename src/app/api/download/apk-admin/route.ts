import { NextResponse } from "next/server";
import { buildAdminApk, publicAdminUrl, saveAdminApkCopies } from "@/lib/buildApk";

export const runtime = "nodejs";

export function GET(request: Request) {
  try {
    const apk = buildAdminApk(publicAdminUrl(request));
    try {
      saveAdminApkCopies(apk);
    } catch {
      // vẫn trả file tải dù không ghi được ra đĩa
    }
    return new NextResponse(new Uint8Array(apk), {
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": 'attachment; filename="WebStudio-Admin.apk"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không tạo được tệp cài đặt.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
