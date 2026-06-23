import Checkout from "@/components/Checkout";
import { Metadata } from "next";
import { buildSeoOther, contextualKeywords, siteUrl } from "@/lib/seo";

const title = "Solicitar orçamentos";
const description =
  "Solicite orçamentos de brindes personalizados para empresas com atendimento consultivo da Maggenta Brindes.";

export const metadata: Metadata = {
  title,
  description,
  keywords: contextualKeywords("orçamentos de brindes personalizados", [
    "solicitar orçamento Maggenta",
    "cotação de brindes corporativos",
    "brindes personalizados sob consulta",
  ]),
  alternates: {
    canonical: "/orcamentos",
  },
  other: buildSeoOther({
    title,
    description,
    canonical: `${siteUrl}/orcamentos`,
    subject: "orçamentos de brindes personalizados",
  }),
};

const OrcamentosPage = () => {
  return (
    <main>
      <Checkout />
    </main>
  );
};

export default OrcamentosPage;