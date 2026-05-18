import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import ClientShell from "./ClientShell";
import { buildSeoOther, marketKeywords, ogImageUrl, siteName, siteUrl } from "@/lib/seo";

const defaultTitle = "Pepperone Brindes Corporativos Personalizados para Empresas";
const defaultDescription =
  "Brindes corporativos personalizados, produtos promocionais e orcamentos para empresas em todo o Brasil.";
const defaultOgImage = ogImageUrl({
  title: "Pepperone Brindes",
  subtitle: "Brindes corporativos personalizados para empresas",
});
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
    default: defaultTitle,
    template: "%s | Pepperone Brindes",
  },
  description: defaultDescription,
  keywords: marketKeywords,
  applicationName: siteName,
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
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
    images: [
      {
        url: defaultOgImage,
        alt: "Pepperone Brindes Corporativos",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  other: buildSeoOther({
    title: defaultTitle,
    description: defaultDescription,
    canonical: siteUrl,
    subject: "brindes personalizados, brindes corporativos, produtos promocionais",
  }),
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
