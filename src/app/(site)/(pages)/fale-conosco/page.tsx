import Contact from "@/components/Contact";
import { Metadata } from "next";
import { buildSeoOther, contextualKeywords, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Fale conosco",
  description:
    "Entre em contato com a Maggenta para orcamentos de brindes personalizados, atendimento comercial e suporte.",
  keywords: contextualKeywords("contato Maggenta", [
    "orçamento de brindes personalizados",
    "atendimento Maggenta Brindes",
    "vendas Maggenta",
  ]),
  alternates: {
    canonical: "/fale-conosco",
  },
  other: buildSeoOther({
    title: "Fale conosco",
    description:
      "Entre em contato com a Maggenta para orcamentos de brindes personalizados, atendimento comercial e suporte.",
    canonical: `${siteUrl}/fale-conosco`,
    subject: "contato comercial para brindes personalizados",
  }),
};

const FaleConoscoPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default FaleConoscoPage;
