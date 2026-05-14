import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Brindes para empresas | Pepperone",
  description: "Conheca brindes para empresas e produtos promocionais Pepperone.",
};

const ShopWithoutSidebarPage = async () => {
  redirect("/brindes-para-empresas");
};

export default ShopWithoutSidebarPage;
