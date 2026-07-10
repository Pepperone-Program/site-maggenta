import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import ClientShell from "./ClientShell";
import Footer from "@/components/Footer";
import { getMenuGroups } from "@/lib/api";
import { buildSeoOther, marketKeywords, ogImageUrl, siteName, siteUrl } from "@/lib/seo";

const defaultTitle = "Brindes Personalizados | Maggenta Brindes ";
const defaultDescription =
  "Brindes corporativos personalizados, produtos promocionais e orcamentos para empresas em todo o Brasil.";
const defaultOgImage = ogImageUrl({
  title: "Maggenta Brindes",
  subtitle: "Brindes corporativos personalizados para empresas",
});
const siteIcon = "/images/logo/Simbolo-maggenta.png";
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Maggenta Brindes Corporativos",
  url: siteUrl,
  logo: `${siteUrl}/images/logo/logo.svg`,
  email: "vendas@maggenta.com.br",
  telephone: "+55-11-2287-6444",
  sameAs: [
    "https://www.instagram.com/brindesmaggenta",
    "https://web.facebook.com/maggentapromocional?_rdc=1&_rdr#",
    "https://www.linkedin.com/company/maggenta-brindes-promocionais/posts/?feedView=all",
    "https://x.com/maggentabrindes",
    "https://www.youtube.com/@maggentabrindes9883",
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
  name: "Maggenta",
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
    template: "%s | Maggenta Brindes",
  },
  description: defaultDescription,
  keywords: marketKeywords,
  applicationName: siteName,
  icons: {
    icon: [
      {
        url: siteIcon,
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: siteIcon,
        type: "image/png",
      },
    ],
    apple: [
      {
        url: siteIcon,
        type: "image/png",
      },
    ],
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
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
    images: [
      {
        url: defaultOgImage,
        alt: "Maggenta Brindes Corporativos",
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

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const initialMenuGroups = await getMenuGroups();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
        <link rel="icon" href={siteIcon} type="image/png" />
        <link rel="shortcut icon" href={siteIcon} type="image/png" />
        <link rel="apple-touch-icon" href={siteIcon} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema]),
          }}
        />
      </head>
      <body>
        <ClientShell initialMenuGroups={initialMenuGroups}>{children}</ClientShell>
        <Footer />
      </body>
    </html>
  );
}
