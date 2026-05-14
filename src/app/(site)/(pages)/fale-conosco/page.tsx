import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fale conosco | Pepperone",
  description:
    "Entre em contato com a Pepperone para orcamentos de brindes personalizados, atendimento comercial e suporte.",
  alternates: {
    canonical: "/fale-conosco",
  },
};

const FaleConoscoPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default FaleConoscoPage;
