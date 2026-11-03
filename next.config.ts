import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "*": [
      "./android/**",
      "./tools/**",
      "./www-cap/**",
      "./docs/**",
      "./render-dist/**",
      "./dist/**",
      "./**/*.apk",
      "./**/*.zip",
    ],
  },
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.1.137", "192.168.0.137"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/", destination: "/index.html" },
      { source: "/webstudio.apk", destination: "/api/download/apk" },
      { source: "/WebStudio.apk", destination: "/api/download/apk" },
    ];
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/webstudio.apk",
        headers: [
          {
            key: "Content-Type",
            value: "application/vnd.android.package-archive",
          },
          {
            key: "Content-Disposition",
            value:
              'attachment; filename="WebStudio.apk"; filename*=UTF-8\'\'WebStudio.apk',
          },
        ],
      },
      {
        source: "/WebStudio.apk",
        headers: [
          {
            key: "Content-Type",
            value: "application/vnd.android.package-archive",
          },
          {
            key: "Content-Disposition",
            value:
              'attachment; filename="WebStudio.apk"; filename*=UTF-8\'\'WebStudio.apk',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
