import React from "react";
import { Metadata } from "next";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { brandOpenGraphImages, buildSeoOther, contextualKeywords, siteName, siteUrl } from "@/lib/seo";
import { getProdutosSitePaginated } from "@/lib/api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Lançamentos de Brindes Personalizados",
  description:
    "Veja os 24 primeiros lançamentos do catálogo Maggenta, com produtos novos e destaque para campanhas, eventos e ações promocionais.",
  keywords: contextualKeywords("lançamentos Maggenta", [
    "produtos novos para empresas",
    "lançamentos de brindes",
    "catálogo de brindes lançamentos",
  ]),
  alternates: {
    canonical: "/lancamentos",
  },
  openGraph: {
    title: "Lançamentos de Brindes Personalizados | Maggenta Brindes",
    description:
      "Veja os 24 primeiros lançamentos do catálogo Maggenta, com produtos novos e destaque para campanhas, eventos e ações promocionais.",
    type: "website",
    url: `${siteUrl}/lancamentos`,
    siteName,
    locale: "pt_BR",
    images: brandOpenGraphImages,
  },
  other: buildSeoOther({
    title: "Lançamentos de Brindes Personalizados | Maggenta Brindes",
    description:
      "Veja os 24 primeiros lançamentos do catálogo Maggenta, com produtos novos e destaque para campanhas, eventos e ações promocionais.",
    canonical: `${siteUrl}/lancamentos`,
    subject: "lançamentos de brindes personalizados",
  }),
};

export default async function LancamentosPage() {
  const catalogo = await getProdutosSitePaginated({ page: 1, limit: 24 });

  return (
    <main>
      <ShopWithoutSidebar
        products={catalogo.items}
        title="Lançamentos Personalizados"
        description="Os 24 primeiros produtos do catálogo Maggenta em destaque para lançamentos, campanhas e oportunidades de relacionamento com clientes."
        breadcrumbPages={["Lançamentos Personalizados"]}
        productBadgeLabel="Lançamento"
        total={catalogo.total}
        page={catalogo.page}
        limit={catalogo.limit}
        totalPages={catalogo.totalPages}
        loadMoreUrl={`/api/produtos/catalogo?kind=products&limit=${catalogo.limit}`}
      />
    </main>
  );
}
