import React from "react";
import { redirect } from "next/navigation";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Loja outdoor | Pepperone",
  description:
    "Compre mochilas, roupas técnicas, hidratação e acessórios outdoor na Pepperone.",
};

const ShopWithSidebarPage = async () => {
  redirect("/brindes-personalizados");
};

export default ShopWithSidebarPage;
