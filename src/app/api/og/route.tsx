import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const size = {
  width: 1200,
  height: 630,
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Pepperone Brindes";
  const subtitle =
    searchParams.get("subtitle") || "Brindes personalizados para empresas";
  const image = searchParams.get("image");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f7f8f4",
          color: "#06123a",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            width: "52%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "38px",
              fontSize: "30px",
              fontWeight: 700,
              color: "#1f8f2f",
            }}
          >
            Pepperone Brindes
          </div>
          <div
            style={{
              fontSize: "58px",
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: "-1px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: "28px",
              fontSize: "28px",
              lineHeight: 1.35,
              color: "#53607a",
            }}
          >
            {subtitle}
          </div>
        </div>
        <div
          style={{
            width: "48%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "52px",
            background: "linear-gradient(135deg, #eef7ef 0%, #ffffff 100%)",
          }}
        >
          {image ? (
            <img
              src={image}
              alt=""
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                width: "330px",
                height: "330px",
                borderRadius: "50%",
                background: "#1f8f2f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "132px",
                fontWeight: 800,
              }}
            >
              P
            </div>
          )}
        </div>
      </div>
    ),
    size
  );
}
