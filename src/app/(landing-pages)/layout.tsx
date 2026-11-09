import type { ReactNode } from "react";
import MetaPixel from "@/components/Common/MetaPixel";

export default function LandingPagesLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
