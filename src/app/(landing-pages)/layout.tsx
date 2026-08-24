import type { ReactNode } from "react";

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
        {children}
      </body>
    </html>
  );
}
