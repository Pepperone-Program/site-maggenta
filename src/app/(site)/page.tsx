import Home from "@/components/Home";
import { Metadata } from "next";
import { contextualKeywords, siteName, siteUrl } from "@/lib/seo";

export const revalidate = 300;

const title = "Maggenta Brindes Corporativos Personalizados para Empresas";
const description =
  "Solicite orcamento de brindes corporativos personalizados, produtos promocionais e itens para empresas em todo o Brasil.";
const homeUrl = `${siteUrl}/`;
const socialImage = `${siteUrl}/images/logo/NOVO_LOGO_MAGG_HORIZONTAL_COR.png`;

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  keywords: contextualKeywords("brindes personalizados para empresas", [
    "empresas de brindes corporativos",
    "loja brindes personalizados",
    "empresa de brindes",
    "brindes premium personalizados",
    "loja de brindes personalizados",
  ]),
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName,
    title,
    description,
    url: homeUrl,
    images: [
      {
        url: socialImage,
        secureUrl: socialImage,
        type: "image/png",
        width: 881,
        height: 151,
        alt: "Maggenta Brindes Corporativos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: socialImage,
        alt: "Maggenta Brindes Corporativos",
        width: 881,
        height: 151,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return <Home />;
}
