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
  title: "Brindes personalizados | Pepperone",
  description:
    "Encontre brindes personalizados por categoria, subcategoria, publico-alvo e quantidade minima.",
};

type CatalogPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const toNumber = (value: string | string[] | undefined) => {
  const parsed = Number(firstParam(value));
  return Number.isFinite(parsed) ? parsed : undefined;
};

const BrindesPersonalizadosPage = async ({ searchParams }: CatalogPageProps) => {
  const params = (await searchParams) || {};
  const categoriaId = toNumber(params.categoria) || 1;
  const selectedDatas = firstParam(params.datas_promocionais) || firstParam(params.data_promocional);
  const [catalogo, categorias, publicosAlvos, datasPromocionais] = await Promise.all([
    getCatalogoCategoria(categoriaId, {
      empresaId: toNumber(params.empresaId) || 1,
      page: toNumber(params.page) || 1,
      limit: toNumber(params.limit) || 24,
      subcategorias: firstParam(params.subcategorias),
      publicos_alvos: firstParam(params.publicos_alvos),
      quantidade_minima_min: toNumber(params.quantidade_minima_min),
      quantidade_minima_max: toNumber(params.quantidade_minima_max),
      data_promocional: firstParam(params.data_promocional),
      datas_promocionais: firstParam(params.datas_promocionais),
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
          subcategorias: firstParam(params.subcategorias) || "",
          publicos_alvos: firstParam(params.publicos_alvos) || "",
          quantidade_minima_min: firstParam(params.quantidade_minima_min) || "",
          quantidade_minima_max: firstParam(params.quantidade_minima_max) || "",
          datas_promocionais: selectedDatas || "",
          limit: firstParam(params.limit) || "24",
        }}
        categoryOptions={categorias}
        publicOptions={publicosAlvos}
        dateOptions={datasPromocionais}
      />
    </main>
  );
};

export default BrindesPersonalizadosPage;
