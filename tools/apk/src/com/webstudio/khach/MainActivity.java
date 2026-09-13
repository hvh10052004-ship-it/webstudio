package com.webstudio.khach;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import java.io.InputStream;

public class MainActivity extends Activity {
  private static final int FILE_CHOOSER_REQ = 1001;
  private WebView web;
  private boolean shownError;
  private ValueCallback fileCallback;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    try {
      web = new WebView(this);
      web.setBackgroundColor(Color.parseColor("#EEF1F6"));
      WebSettings settings = web.getSettings();
      settings.setJavaScriptEnabled(true);
      settings.setDomStorageEnabled(true);
      settings.setDatabaseEnabled(true);
      settings.setAllowFileAccess(true);
      settings.setLoadWithOverviewMode(false);
      settings.setUseWideViewPort(true);
      settings.setSupportZoom(false);
      settings.setBuiltInZoomControls(false);
      try {
        settings.getClass().getMethod("setMixedContentMode", int.class).invoke(settings, Integer.valueOf(0));
      } catch (Throwable ignored) {
      }
      try {
        settings
            .getClass()
            .getMethod("setAllowUniversalAccessFromFileURLs", boolean.class)
            .invoke(settings, Boolean.TRUE);
        settings
            .getClass()
            .getMethod("setAllowFileAccessFromFileURLs", boolean.class)
            .invoke(settings, Boolean.TRUE);
      } catch (Throwable ignored) {
      }
      try {
        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        CookieManager.class
            .getMethod("setAcceptThirdPartyCookies", WebView.class, boolean.class)
            .invoke(cookies, web, Boolean.TRUE);
      } catch (Throwable ignored) {
      }
      web.setWebChromeClient(new FileChromeClient());
      web.setWebViewClient(
          new WebViewClient() {
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
              if (url == null) return true;
              String current = view.getUrl();
              boolean fromFile = current != null && current.indexOf("file://") == 0;
              if (url.indexOf("http://") == 0 || url.indexOf("https://") == 0) {
                if (fromFile) {
                  view.loadUrl(url);
                  return true;
                }
                return false;
              }
              if (url.indexOf("file://") == 0 || url.indexOf("data:") == 0) {
                return false;
              }
              return true;
            }

            public void onReceivedError(
                WebView view, int errorCode, String description, String failingUrl) {
              showLoadError(view, failingUrl, description);
            }
          });
      String start = readStartUrl();
      if (start.length() > 0) {
        web.loadUrl(start);
      } else {
        web.loadUrl("file:///android_asset/www/home.html");
      }
      setContentView(web);
    } catch (Throwable error) {
      TextView text = new TextView(this);
      text.setText("Không mở được trang chủ.\n\n" + String.valueOf(error));
      text.setTextColor(Color.WHITE);
      text.setBackgroundColor(Color.BLACK);
      text.setPadding(48, 80, 48, 48);
      text.setTextSize(16);
      setContentView(text);
    }
  }

  private class FileChromeClient extends WebChromeClient {
    public void openFileChooser(ValueCallback uploadMsg) {
      openFileChooser(uploadMsg, "*/*", null);
    }

    public void openFileChooser(ValueCallback uploadMsg, String acceptType) {
      openFileChooser(uploadMsg, acceptType, null);
    }

    public void openFileChooser(ValueCallback uploadMsg, String acceptType, String capture) {
      final ValueCallback single = uploadMsg;
      ValueCallback wrap =
          new ValueCallback() {
            public void onReceiveValue(Object value) {
              Uri one = null;
              if (value instanceof Uri[]) {
                Uri[] many = (Uri[]) value;
                if (many.length > 0) one = many[0];
              } else if (value instanceof Uri) {
                one = (Uri) value;
              }
              single.onReceiveValue(one);
            }
          };
      openChooser(wrap, acceptType);
    }

    public boolean onShowFileChooser(
        WebView view, ValueCallback filePathCallback, FileChooserParams fileChooserParams) {
      openChooser(filePathCallback, mimeFrom(fileChooserParams));
      return true;
    }
  }

  private String mimeFrom(WebChromeClient.FileChooserParams params) {
    try {
      if (params == null) return "image/*";
      String[] types = params.getAcceptTypes();
      if (types != null && types.length > 0 && types[0] != null && types[0].length() > 0) {
        return types[0];
      }
    } catch (Throwable ignored) {
    }
    return "image/*";
  }

  private void openChooser(ValueCallback callback, String mime) {
    if (fileCallback != null) {
      fileCallback.onReceiveValue(null);
      fileCallback = null;
    }
    fileCallback = callback;
    String type = mime == null || mime.length() == 0 ? "image/*" : mime;
    Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
    intent.addCategory(Intent.CATEGORY_OPENABLE);
    intent.setType(type);
    intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    try {
      startActivityForResult(Intent.createChooser(intent, "Chọn ảnh"), FILE_CHOOSER_REQ);
    } catch (Throwable error) {
      if (fileCallback != null) {
        fileCallback.onReceiveValue(null);
        fileCallback = null;
      }
    }
  }

  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (requestCode != FILE_CHOOSER_REQ) {
      super.onActivityResult(requestCode, resultCode, data);
      return;
    }
    if (fileCallback == null) return;
    Uri[] result = null;
    if (resultCode == RESULT_OK && data != null) {
      try {
        result = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
      } catch (Throwable ignored) {
        if (data.getData() != null) {
          result = new Uri[] {data.getData()};
        }
      }
    }
    fileCallback.onReceiveValue(result);
    fileCallback = null;
  }

  private String readStartUrl() {
    InputStream in = null;
    try {
      in = getAssets().open("www/start.txt");
      byte[] buf = new byte[256];
      int n = in.read(buf);
      if (n <= 0) return "";
      String url = new String(buf, 0, n, "UTF-8").trim();
      if (url.indexOf("http://") == 0 || url.indexOf("https://") == 0) return url;
      return "";
    } catch (Throwable ignored) {
      return "";
    } finally {
      try {
        if (in != null) in.close();
      } catch (Throwable ignored) {
      }
    }
  }

  private void showLoadError(WebView view, String failingUrl, String description) {
    if (shownError || view == null) return;
    shownError = true;
    String url = failingUrl == null ? "" : failingUrl;
    String detail = description == null ? "Không tải được trang." : description;
    String html =
        "<html><head><meta charset='utf-8'/><meta name='viewport' content='width=device-width, initial-scale=1'/></head>"
            + "<body style='margin:0;background:#10131a;color:#f4f1ec;font-family:sans-serif;padding:32px 24px'>"
            + "<h2 style='font-size:20px'>Không mở được app admin</h2>"
            + "<p style='line-height:1.5;color:#c5c9d3'>Điện thoại phải cùng Wi‑Fi với máy tính đang chạy <b>npm run dev:lan</b>, rồi tải lại APK từ trang tải app admin.</p>"
            + "<p style='word-break:break-all;color:#9aa3b5;font-size:13px'>"
            + escapeHtml(url)
            + "</p>"
            + "<p style='color:#9aa3b5;font-size:13px'>"
            + escapeHtml(detail)
            + "</p>"
            + "</body></html>";
    view.loadDataWithBaseURL(null, html, "text/html", "utf-8", null);
  }

  private String escapeHtml(String value) {
    if (value == null) return "";
    return value
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\"", "&quot;");
  }

  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    if (keyCode == android.view.KeyEvent.KEYCODE_BACK && web != null && web.canGoBack()) {
      web.goBack();
      return true;
    }
    return super.onKeyDown(keyCode, event);
  }
}
