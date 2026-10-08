"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function InstallAppCard() {
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    setInstalled(isStandalone());
    setIos(isIos());
    function onPrompt(e: Event) {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (installed) {
    return <p className="app-install-note">Ứng dụng đang chạy trên điện thoại.</p>;
  }

  async function install() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setPromptEvent(null);
  }

  return (
    <div className="app-install-card">
      <strong>Tải về điện thoại</strong>
      {ios ? (
        <p>
          iPhone không cài được tệp Android. Hãy mở trang tải trên điện thoại Android.
        </p>
      ) : (
        <>
          <p>Tải tệp về máy rồi mở để cài trên điện thoại Android.</p>
          {promptEvent ? (
            <button type="button" className="app-btn app-btn-primary" onClick={() => void install()}>
              Cài nhanh trên trình duyệt
            </button>
          ) : null}
          <a
            className="app-btn app-btn-primary"
            href="/webstudio.apk"
            download="webstudio.apk"
          >
            Tải tệp cài đặt
          </a>
        </>
      )}
    </div>
  );
}
