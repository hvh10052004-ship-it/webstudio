"use client";

import { useEffect } from "react";

export function GateLogin() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("ws-auth") !== "1") {
        location.replace("/neon-lamp-login.html");
      }
    } catch {
      location.replace("/neon-lamp-login.html");
    }
  }, []);
  return null;
}
