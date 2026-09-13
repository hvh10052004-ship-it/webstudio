import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#6d5efc",
          color: "#fff",
          fontSize: 260,
          fontWeight: 800,
        }}
      >
        W
      </div>
    ),
    { width: 512, height: 512 },
  );
}
