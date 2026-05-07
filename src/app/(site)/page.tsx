import Home from "@/components/Home";
import { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Pepperone Brindes Corporativos Personalizados",
  description:
    "Solicite orcamento de brindes corporativos personalizados, produtos promocionais e itens para empresas em todo o Brasil.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return <Home />;
}
