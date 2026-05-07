import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import ClientShell from "./ClientShell";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pepperone.com.br";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pepperone Brindes Corporativos",
    template: "%s | Pepperone",
  },
  description:
    "Brindes corporativos personalizados, produtos promocionais e orcamentos para empresas em todo o Brasil.",
  applicationName: "Pepperone",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "mgvzGTTx3EwBN_LTzrGsWq3yl0ClkS3KGvwLkNC-lU4",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Pepperone",
    title: "Pepperone Brindes Corporativos",
    description:
      "Brindes corporativos personalizados, produtos promocionais e orcamentos para empresas.",
    url: "/",
    images: [
      {
        url: "/images/logo/logo.svg",
        alt: "Pepperone Brindes Corporativos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pepperone Brindes Corporativos",
    description:
      "Brindes corporativos personalizados, produtos promocionais e orcamentos para empresas.",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
