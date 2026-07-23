import { ImageResponse } from "next/og";
import { siteUrl } from "@/lib/seo";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#ffffff",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <img
          alt="Maggenta Brindes Corporativos"
          src={`${siteUrl}/images/logo/NOVO_LOGO_MAGG_HORIZONTAL_COR.png`}
          style={{
            height: "auto",
            maxHeight: "330px",
            maxWidth: "1000px",
            objectFit: "contain",
            width: "83.333%",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    },
  );
}
