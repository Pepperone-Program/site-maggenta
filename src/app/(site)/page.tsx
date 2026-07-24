import Home from "@/components/Home";
import { Metadata } from "next";
import {
  brandOpenGraphImages,
  brandSocialImage,
  contextualKeywords,
  siteName,
  siteUrl,
} from "@/lib/seo";

export const revalidate = 300;

const title = "Maggenta Brindes Corporativos Personalizados para Empresas";
const description =
  "Solicite orcamento de brindes corporativos personalizados, produtos promocionais e itens para empresas em todo o Brasil.";
const homeUrl = `${siteUrl}/`;

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
    images: brandOpenGraphImages,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: brandSocialImage,
        alt: "Maggenta Brindes Corporativos",
        width: 1200,
        height: 630,
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
