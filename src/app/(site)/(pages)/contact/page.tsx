import Contact from "@/components/Contact";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contato | Pepperone",
  description: "Fale com a equipe Pepperone sobre pedidos, trocas e produtos outdoor.",
};

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;
