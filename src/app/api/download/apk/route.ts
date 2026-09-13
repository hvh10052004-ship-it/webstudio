import { NextResponse } from "next/server";
import { buildCustomerApk, publicAppUrl, saveApkCopies } from "@/lib/buildApk";

export const runtime = "nodejs";

export function GET(request: Request) {
  try {
    const apk = buildCustomerApk(publicAppUrl(request));
    try {
      saveApkCopies("WebStudio.apk", apk);
    } catch {
      // vẫn trả file tải dù không ghi được ra đĩa
    }
    return new NextResponse(new Uint8Array(apk), {
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": 'attachment; filename="WebStudio.apk"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không tạo được tệp cài đặt.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
