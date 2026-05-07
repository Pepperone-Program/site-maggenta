import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produto | Pepperone",
  description: "Redirecionamento para a página de produto Pepperone.",
};

const ShopDetailsPage = () => {
  redirect("/produto/mochila-expedition-42l");
};

export default ShopDetailsPage;
