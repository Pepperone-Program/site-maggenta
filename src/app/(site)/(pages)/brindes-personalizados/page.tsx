import React from "react";
import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import {
  getCatalogoCategorias,
  getProdutosSitePaginated,
  type CatalogoProdutos,
} from "@/lib/api";
import { buildSeoOther, catalogRobots, categoryPath, contextualKeywords, siteUrl } from "@/lib/seo";

export const revalidate = 120;

const baseMetadata: Metadata = {
  title: "Brindes personalizados",
  alternates: {
    canonical: "/brindes-personalizados",
  },
  description:
    "Explore brindes personalizados para empresas, eventos e campanhas. Compare categorias, quantidades mínimas e solicite um orçamento sob medida.",
  keywords: contextualKeywords("brindes personalizados", [
    "catálogo de brindes personalizados",
    "brindes personalizados por categoria",
    "brindes com quantidade mínima",
  ]),
  other: buildSeoOther({
    title: "Brindes personalizados",
    description:
      "Explore brindes personalizados para empresas, eventos e campanhas. Compare categorias, quantidades mínimas e solicite um orçamento sob medida.",
    canonical: `${siteUrl}/brindes-personalizados`,
    subject: "catálogo de brindes personalizados",
  }),
};

type CatalogPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: CatalogPageProps): Promise<Metadata> {
  const params = (await searchParams) || {};
  return { ...baseMetadata, robots: catalogRobots(params) };
}

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const toNumber = (value: string | string[] | undefined) => {
  const parsed = parseInt(String(firstParam(value) || ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const BrindesPersonalizadosPage = async ({ searchParams }: CatalogPageProps) => {
  const params = (await searchParams) || {};
  const categoriaId = toNumber(params.categoria);
  const hasCategory = Number.isFinite(categoriaId) && categoriaId > 0;
  const limit = Math.min(Math.max(toNumber(params.limit) || 24, 1), 48);
  const [products, categorias] = await Promise.all([
    hasCategory ? Promise.resolve(null) : getProdutosSitePaginated({
      empresaId: toNumber(params.empresaId) || 1,
      page: Math.max(toNumber(params.page) || 1, 1),
      limit,
    }),
    getCatalogoCategorias(),
  ]);

  if (hasCategory) {
    const redirectParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      const firstValue = firstParam(value);
      if (key !== "categoria" && firstValue) {
        redirectParams.set(key, firstValue);
      }
    });
    const categoryTitle =
      categorias.find((category) => category.id === categoriaId)?.title ||
      "brindes";
    const query = redirectParams.toString();
    permanentRedirect(`${categoryPath(categoriaId, categoryTitle)}${query ? `?${query}` : ""}`);
  }

  const catalogo: CatalogoProdutos = {
    ...products,
    categoria: null,
    filtros: {
      subcategorias: [],
      publicos_alvos: [],
      datas_promocionais: [],
      quantidade_minima: { min: 0, max: 0 },
    },
  };

  return (
    <main>
      <ShopWithSidebar
        catalogo={catalogo}
        catalogKind="products"
        pageTitle="Brindes personalizados"
        activeFilters={{ limit: String(limit) }}
        categoryOptions={categorias}
      />
    </main>
  );
};

export default BrindesPersonalizadosPage;
