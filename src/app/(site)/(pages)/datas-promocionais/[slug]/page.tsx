import React from "react";
import { Metadata } from "next";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import {
  getCatalogoCategorias,
  getCatalogoDataPromocional,
  getDatasPromocionais,
  getPublicosAlvos,
} from "@/lib/api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Brindes para datas promocionais | Pepperone",
  description:
    "Brindes personalizados para datas promocionais, campanhas sazonais e eventos corporativos.",
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

const DataPromocionalSlugPage = async ({ params, searchParams }: PageProps) => {
  const routeParams = (await params) || {};
  const query = (await searchParams) || {};
  const dataPromocionalId = toNumber(routeParams.slug) || 1;
  const [catalogo, categorias, publicosAlvos, datasPromocionais] = await Promise.all([
    getCatalogoDataPromocional(dataPromocionalId, {
      empresaId: 1,
      page: toNumber(query.page) || 1,
      limit: toNumber(query.limit) || 100,
      datas_promocionais: firstParam(query.datas_promocionais) || String(dataPromocionalId),
      subcategorias: firstParam(query.subcategorias),
      publicos_alvos: firstParam(query.publicos_alvos),
      quantidade_minima_min: toNumber(query.quantidade_minima_min),
      quantidade_minima_max: toNumber(query.quantidade_minima_max),
    }),
    getCatalogoCategorias(),
    getPublicosAlvos(),
    getDatasPromocionais(),
  ]);

  const dataPromocional = datasPromocionais.find((d) => d.id === dataPromocionalId);

  return (
    <main>
      <ShopWithSidebar
        catalogo={catalogo}
        activeFilters={{
          categoria: "1",
          data_promocional: String(dataPromocionalId),
          subcategorias: firstParam(query.subcategorias) || "",
          publicos_alvos: firstParam(query.publicos_alvos) || "",
          quantidade_minima_min: firstParam(query.quantidade_minima_min) || "",
          quantidade_minima_max: firstParam(query.quantidade_minima_max) || "",
          datas_promocionais: firstParam(query.datas_promocionais) || String(dataPromocionalId),
          limit: firstParam(query.limit) || "100",
        }}
        categoryOptions={categorias}
        publicOptions={publicosAlvos}
        dateOptions={datasPromocionais}
        pageTitle={`Brindes para ${dataPromocional?.title || "Data Promocional"}`}
        basePath={`/datas-promocionais/${routeParams.slug || dataPromocionalId}`}
      />
    </main>
  );
};

export default DataPromocionalSlugPage;
