import React from "react";
import { Metadata } from "next";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import {
  getCatalogoCategoria,
  getCatalogoCategorias,
  getDatasPromocionais,
  getPublicosAlvos,
} from "@/lib/api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Categoria de brindes personalizados | Pepperone",
  description:
    "Veja produtos personalizados por categoria com filtros de subcategoria, publico-alvo, data promocional e quantidade minima.",
};

type PageProps = {
  params?: Promise<{ slug?: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const toNumber = (value: string | string[] | undefined) => {
  const parsed = parseInt(String(firstParam(value) || ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const CategoriasPage = async ({ params, searchParams }: PageProps) => {
  const routeParams = (await params) || {};
  const query = (await searchParams) || {};
  const categoriaId = toNumber(routeParams.slug) || 1;
  const selectedDatas = firstParam(query.datas_promocionais) || firstParam(query.data_promocional);
  const [catalogo, categorias, publicosAlvos, datasPromocionais] = await Promise.all([
    getCatalogoCategoria(categoriaId, {
      empresaId: toNumber(query.empresaId) || 1,
      page: toNumber(query.page) || 1,
      limit: toNumber(query.limit) || 24,
      subcategorias: firstParam(query.subcategorias),
      publicos_alvos: firstParam(query.publicos_alvos),
      quantidade_minima_min: toNumber(query.quantidade_minima_min),
      quantidade_minima_max: toNumber(query.quantidade_minima_max),
      data_promocional: firstParam(query.data_promocional),
      datas_promocionais: firstParam(query.datas_promocionais),
    }),
    getCatalogoCategorias(),
    getPublicosAlvos(),
    getDatasPromocionais(),
  ]);

  return (
    <main>
      <ShopWithSidebar
        catalogo={catalogo}
        activeFilters={{
          categoria: String(categoriaId),
          subcategorias: firstParam(query.subcategorias) || "",
          publicos_alvos: firstParam(query.publicos_alvos) || "",
          quantidade_minima_min: firstParam(query.quantidade_minima_min) || "",
          quantidade_minima_max: firstParam(query.quantidade_minima_max) || "",
          datas_promocionais: selectedDatas || "",
          limit: firstParam(query.limit) || "24",
        }}
        categoryOptions={categorias}
        publicOptions={publicosAlvos}
        dateOptions={datasPromocionais}
        basePath={`/categorias/${routeParams.slug || categoriaId}`}
      />
    </main>
  );
};

export default CategoriasPage;
