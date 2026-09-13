package com.webstudio.khach;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

public class SplashActivity extends Activity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    try {
      int layout = getResources().getIdentifier("activity_splash", "layout", getPackageName());
      if (layout != 0) {
        setContentView(layout);
      }
    } catch (Throwable ignored) {
    }
    new Handler(Looper.getMainLooper())
        .postDelayed(
            new Runnable() {
              public void run() {
                try {
                  startActivity(new Intent(SplashActivity.this, MainActivity.class));
                } catch (Throwable ignored) {
                }
                finish();
              }
            },
            1100);
  }
}
