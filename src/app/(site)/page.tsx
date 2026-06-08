import Home from "@/components/Home";
import { Metadata } from "next";
import { contextualKeywords } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: {
    absolute: "Pepperone Brindes Corporativos Personalizados para Empresas",
  },
  description:
    "Solicite orcamento de brindes corporativos personalizados, produtos promocionais e itens para empresas em todo o Brasil.",
  keywords: contextualKeywords("brindes personalizados para empresas", [
    "empresas de brindes corporativos",
    "loja brindes personalizados",
    "empresa de brindes",
    "brindes premium personalizados",
    "loja de brindes personalizados",
    "peperone brindes",
    "pepperoni brindes",
  ]),
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
      "x-default": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return <Home />;
}
