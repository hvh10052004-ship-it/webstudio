package com.webstudio.khach.crash;

import android.app.Application;

public class CrashGuard {
  public static void install(Application app) {
    final Thread.UncaughtExceptionHandler previous = Thread.getDefaultUncaughtExceptionHandler();
    Thread.setDefaultUncaughtExceptionHandler(
        new Thread.UncaughtExceptionHandler() {
          public void uncaughtException(Thread thread, Throwable error) {
            try {
              android.util.Log.e("WebStudio", "crash", error);
            } catch (Throwable ignored) {
            }
            if (previous != null) {
              previous.uncaughtException(thread, error);
            }
          }
        });
  }
}
