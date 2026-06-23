import Contact from "@/components/Contact";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Fale conosco | Maggenta",
  description: "Fale com a equipe Maggenta sobre brindes personalizados e orçamentos.",
};

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;
