"use client";

import { useEffect, useState, type ReactNode } from "react";

const APK_HREF = "/WebStudio.apk";
const APK_TYPE = "application/vnd.android.package-archive";

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function ApkDownloadLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <a className={className} href={APK_HREF} type={APK_TYPE}>
      {children}
    </a>
  );
}

export function DownloadAppCta({
  label = "Tải ứng dụng",
}: {
  label?: string;
}) {
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setIos(isIos());
  }, []);

  if (ios) {
    return (
      <p className="app-dl-ios">
        iPhone không cài được tệp Android. Mở trang này trên điện thoại Android
        để tải ứng dụng WebStudio.
      </p>
    );
  }

  return (
    <ApkDownloadLink className="btn btn-primary">{label}</ApkDownloadLink>
  );
}
