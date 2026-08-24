import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import ClientShell from "./ClientShell";
import Footer from "@/components/Footer";
import {
  brandOpenGraphImages,
  brandSocialImage,
  buildSeoOther,
  marketKeywords,
  siteName,
  siteUrl,
} from "@/lib/seo";

const defaultTitle = "Brindes Personalizados para Empresas | Maggenta Brindes";
const defaultDescription =
  "Crie brindes corporativos personalizados para ações, eventos e equipes. Atendimento consultivo, amplo catálogo e entrega para empresas em todo o Brasil.";
const faviconIcon = "/favicon.ico?v=20260710";
const siteIcon = "/icon.png?v=20260710";
const appleIcon = "/apple-icon.png?v=20260710";
const brandLogo = "/images/logo/NOVO_LOGO_MAGG_HORIZONTAL_COR.png";
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Maggenta Brindes Corporativos",
  url: siteUrl,
  logo: `${siteUrl}${brandLogo}`,
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
        url: faviconIcon,
        type: "image/x-icon",
      },
      {
        url: siteIcon,
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: faviconIcon,
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: appleIcon,
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
    images: brandOpenGraphImages,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [brandSocialImage],
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
        <link rel="icon" href={faviconIcon} sizes="any" />
        <link rel="icon" href={siteIcon} type="image/png" />
        <link rel="shortcut icon" href={faviconIcon} />
        <link rel="apple-touch-icon" href={appleIcon} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema]),
          }}
        />
      </head>
      <body>
        <ClientShell>{children}</ClientShell>
        <Footer />
      </body>
    </html>
  );
}
