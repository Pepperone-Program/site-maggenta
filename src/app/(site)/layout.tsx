import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import ClientShell from "./ClientShell";

const siteUrl = "https://www.pepperone.com.br";
const marketKeywords = [
  "brindes personalizados",
  "brindes corporativos",
  "brindes promocionais",
  "brindes para empresas",
  "produtos personalizados",
  "presentes corporativos",
  "marketing promocional",
  "campanhas promocionais",
  "datas comemorativas corporativas",
  "orcamento de brindes",
  "brindes para eventos",
  "brindes sustentaveis",
  "canetas personalizadas",
  "copos personalizados",
  "squeezes personalizados",
  "mochilas personalizadas",
  "blocos de anotacoes personalizados",
];
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Pepperone Brindes Corporativos",
  url: siteUrl,
  logo: `${siteUrl}/images/logo/logo.svg`,
  email: "vendas@pepperone.com.br",
  telephone: "+55-11-2971-5252",
  sameAs: [
    "https://www.instagram.com/pepperonebrindes/",
    "https://www.facebook.com/pepperonepromocional",
    "https://www.linkedin.com/company/pepperone/",
    "https://x.com/pepperonebrinde",
    "https://www.youtube.com/channel/UC_5I5Dl0two_DqBNsZdRlfA",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Jaguarete, 43",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    postalCode: "02515-010",
    addressCountry: "BR",
  },
};
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Pepperone",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/brindes-personalizados?busca={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pepperone Brindes Corporativos Personalizados para Empresas",
    template: "%s | Pepperone Brindes",
  },
  description:
    "Brindes corporativos personalizados, produtos promocionais e orcamentos para empresas em todo o Brasil.",
  keywords: marketKeywords,
  applicationName: "Pepperone Brindes",
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
    siteName: "Pepperone Brindes",
    title: "Pepperone Brindes Corporativos Personalizados para Empresas",
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
    title: "Pepperone Brindes Corporativos Personalizados para Empresas",
    description:
      "Brindes corporativos personalizados, produtos promocionais e orcamentos para empresas.",
  },
  other: {
    "ai-content": "index, follow",
    "llms": `${siteUrl}/llms.txt`,
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema]),
          }}
        />
      </head>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
