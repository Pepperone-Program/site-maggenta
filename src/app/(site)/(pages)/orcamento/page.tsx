import Checkout from "@/components/Checkout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solicitar orçamento",
  description: "Envie uma solicitação de orçamento para equipamentos outdoor Pepperone.",
  alternates: {
    canonical: "/orcamento",
  },
};

const OrcamentoPage = () => {
  return (
    <main>
      <Checkout />
    </main>
  );
};

export default OrcamentoPage;
