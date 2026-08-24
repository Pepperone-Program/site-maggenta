import Home from "@/components/Home";
import { Metadata } from "next";
import {
  brandOpenGraphImages,
  brandSocialImage,
  contextualKeywords,
  siteName,
  siteUrl,
} from "@/lib/seo";

// Os dados da API sao carregados no runtime para que uma indisponibilidade
// durante o build da Vercel nao publique uma home vazia nem bloqueie o deploy.
export const dynamic = "force-dynamic";

const title = "Brindes Corporativos Personalizados para Empresas | Maggenta";
const description =
  "Encontre brindes corporativos personalizados para eventos, campanhas e equipes. Solicite seu orçamento com atendimento especializado e entrega nacional.";
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
    canonical: homeUrl,
    languages: {
      "pt-BR": homeUrl,
      "x-default": homeUrl,
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
