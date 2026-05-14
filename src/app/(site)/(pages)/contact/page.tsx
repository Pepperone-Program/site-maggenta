import Contact from "@/components/Contact";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Fale conosco | Pepperone",
  description: "Fale com a equipe Pepperone sobre brindes personalizados e orcamentos.",
};

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;
