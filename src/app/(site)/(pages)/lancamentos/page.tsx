import React from "react";
import { Metadata } from "next";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { buildSeoOther, contextualKeywords, siteName, siteUrl } from "@/lib/seo";
import { getProdutosSite } from "@/lib/api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Lançamentos | Pepperone Brindes",
  description:
    "Veja os 24 primeiros lançamentos do catálogo Pepperone, com produtos novos e destaque para campanhas, eventos e ações promocionais.",
  keywords: contextualKeywords("lançamentos Pepperone", [
    "produtos novos para empresas",
    "lançamentos de brindes",
    "catálogo de brindes lançamentos",
  ]),
  alternates: {
    canonical: "/lancamentos",
  },
  openGraph: {
    title: "Lançamentos | Pepperone Brindes",
    description:
      "Veja os 24 primeiros lançamentos do catálogo Pepperone, com produtos novos e destaque para campanhas, eventos e ações promocionais.",
    type: "website",
    url: `${siteUrl}/lancamentos`,
    siteName,
    locale: "pt_BR",
  },
  other: buildSeoOther({
    title: "Lançamentos | Pepperone Brindes",
    description:
      "Veja os 24 primeiros lançamentos do catálogo Pepperone, com produtos novos e destaque para campanhas, eventos e ações promocionais.",
    canonical: `${siteUrl}/lancamentos`,
    subject: "lançamentos de brindes personalizados",
  }),
};

export default async function LancamentosPage() {
  const products = await getProdutosSite(24);

  return (
    <main>
      <ShopWithoutSidebar
        products={products}
        title="Lançamentos Personalizados"
        description="Os 24 primeiros produtos do catálogo Pepperone em destaque para lançamentos, campanhas e oportunidades de relacionamento com clientes."
        breadcrumbPages={["Lançamentos Personalizados"]}
        productBadgeLabel="Lançamento"
      />
    </main>
  );
}