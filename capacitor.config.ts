import type { CapacitorConfig } from "@capacitor/cli";

const liveUrl = process.env.CAPACITOR_SERVER_URL?.trim().replace(/\/$/, "");

const config: CapacitorConfig = {
  appId: "com.webstudio.khach",
  appName: "WebStudio",
  webDir: "www-cap",
  android: {
    allowMixedContent: true,
    backgroundColor: "#f4f1ec",
  },
  server: liveUrl
    ? {
        url: `${liveUrl}/`,
        cleartext: liveUrl.startsWith("http://"),
        androidScheme: "https",
      }
    : {
        androidScheme: "https",
      },
};

export default config;
