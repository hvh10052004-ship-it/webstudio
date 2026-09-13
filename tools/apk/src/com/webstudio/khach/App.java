package com.webstudio.khach;

import android.app.Application;
import com.webstudio.khach.crash.CrashGuard;

public class App extends Application {
  @Override
  public void onCreate() {
    super.onCreate();
    CrashGuard.install(this);
  }
}
