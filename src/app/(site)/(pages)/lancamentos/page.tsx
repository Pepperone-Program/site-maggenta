import React from "react";
import { Metadata } from "next";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { brandOpenGraphImages, buildSeoOther, catalogRobots, contextualKeywords, siteName, siteUrl } from "@/lib/seo";
import { getProdutosSitePaginated } from "@/lib/api";

export const dynamic = "force-dynamic";

const baseMetadata: Metadata = {
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

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const positiveNumber = (value: string | string[] | undefined, fallback: number) => {
  const parsed = Number(firstParam(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = (await searchParams) || {};
  return { ...baseMetadata, robots: catalogRobots(params) };
}

export default async function LancamentosPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const page = positiveNumber(params.page, 1);
  const limit = Math.min(48, positiveNumber(params.limit, 24));
  const catalogo = await getProdutosSitePaginated({ page, limit });

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
        basePath="/lancamentos"
        loadMoreUrl={`/api/produtos/catalogo?kind=products&limit=${catalogo.limit}`}
      />
    </main>
  );
}
