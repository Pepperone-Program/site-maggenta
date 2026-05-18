import Checkout from "@/components/Checkout";
import { Metadata } from "next";
import { buildSeoOther, contextualKeywords, siteUrl } from "@/lib/seo";

const title = "Solicitar orçamento";
const description =
  "Solicite orçamento de brindes personalizados para empresas com atendimento consultivo da Pepperone Brindes.";

export const metadata: Metadata = {
  title,
  description,
  keywords: contextualKeywords("orçamento de brindes personalizados", [
    "solicitar orçamento Pepperone",
    "cotação de brindes corporativos",
    "brindes personalizados sob consulta",
  ]),
  alternates: {
    canonical: "/orcamento",
  },
  other: buildSeoOther({
    title,
    description,
    canonical: `${siteUrl}/orcamento`,
    subject: "orçamento de brindes personalizados",
  }),
};

const OrcamentoPage = () => {
  return (
    <main>
      <Checkout />
    </main>
  );
};

export default OrcamentoPage;
