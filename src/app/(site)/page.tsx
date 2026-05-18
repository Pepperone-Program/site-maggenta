import Home from "@/components/Home";
import { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: {
    absolute: "Pepperone Brindes Corporativos Personalizados para Empresas",
  },
  description:
    "Solicite orcamento de brindes corporativos personalizados, produtos promocionais e itens para empresas em todo o Brasil.",
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
