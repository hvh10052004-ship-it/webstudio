import { buildCustomerApk, defaultCustomerAppUrl, saveApkCopies } from "../src/lib/buildApk.ts";

const url = defaultCustomerAppUrl();
const apk = buildCustomerApk(url);
saveApkCopies("webstudio.apk", apk);
saveApkCopies("WebStudio.apk", apk);
console.log(
  `Đã tạo App khách ${apk.length} bytes → ${/^https:\/\//i.test(url) && !/192\.168\.|127\.0\.0\.1|localhost/.test(url) ? url : "offline (không cần máy tính)"}`,
);
