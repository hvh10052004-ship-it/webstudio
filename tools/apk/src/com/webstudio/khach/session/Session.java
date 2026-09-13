package com.webstudio.khach.session;

import android.webkit.CookieManager;

public class Session {
  public static void persist() {
    try {
      CookieManager manager = CookieManager.getInstance();
      manager.setAcceptCookie(true);
      CookieManager.class.getMethod("flush").invoke(manager);
    } catch (Throwable ignored) {
    }
  }
}
