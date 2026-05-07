import React from "react";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { getProdutos } from "@/lib/api";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Vitrine outdoor | Pepperone",
  description: "Conheça a vitrine de produtos outdoor premium da Pepperone.",
};

const ShopWithoutSidebarPage = async () => {
  const products = await getProdutos();

  return (
    <main>
      <ShopWithoutSidebar products={products} />
    </main>
  );
};

export default ShopWithoutSidebarPage;
