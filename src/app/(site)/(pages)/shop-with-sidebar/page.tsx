import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { getProdutos } from "@/lib/api";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Loja outdoor | Pepperone",
  description:
    "Compre mochilas, roupas técnicas, hidratação e acessórios outdoor na Pepperone.",
};

const ShopWithSidebarPage = async () => {
  const products = await getProdutos();

  return (
    <main>
      <ShopWithSidebar products={products} />
    </main>
  );
};

export default ShopWithSidebarPage;
