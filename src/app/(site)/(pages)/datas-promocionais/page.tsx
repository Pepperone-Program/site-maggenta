import React from "react";
import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import {
  friendlyParam,
  getCatalogoDataPromocional,
  getCatalogoCategorias,
  getDatasPromocionais,
  getPublicosAlvos,
} from "@/lib/api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Brindes para Datas Promocionais | Pepperone",
  description:
    "Brindes personalizados para datas especiais e campanhas promocionais. Encontre produtos para suas estratégias sazonais.",
};

type DatasPromocionaísPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const toNumber = (value: string | string[] | undefined) => {
  const parsed = parseInt(String(firstParam(value) || ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const DatasPromocionaísPage = async ({ searchParams }: DatasPromocionaísPageProps) => {
  const params = (await searchParams) || {};
  const dataPromocionalId = toNumber(params.data_promocional) || 1;
  const [catalogo, categorias, publicosAlvos, datasPromocionais] = await Promise.all([
    getCatalogoDataPromocional(dataPromocionalId, {
      empresaId: 1,
      page: toNumber(params.page) || 1,
      limit: toNumber(params.limit) || 100,
      datas_promocionais: firstParam(params.datas_promocionais) || String(dataPromocionalId),
      subcategorias: firstParam(params.subcategorias),
      publicos_alvos: firstParam(params.publicos_alvos),
      quantidade_minima_min: toNumber(params.quantidade_minima_min),
      quantidade_minima_max: toNumber(params.quantidade_minima_max),
    }),
    getCatalogoCategorias(),
    getPublicosAlvos(),
    getDatasPromocionais(),
  ]);

  const dataPromocional = datasPromocionais.find((d) => d.id === dataPromocionalId);
  const pageTitle = `Brindes para ${dataPromocional?.title || "Data Promocional"}`;

  if (firstParam(params.data_promocional)) {
    const redirectParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      const firstValue = firstParam(value);
      if (key !== "data_promocional" && firstValue) {
        redirectParams.set(key, firstValue);
      }
    });
    const query = redirectParams.toString();
    permanentRedirect(
      `/datas-promocionais/${encodeURIComponent(
        friendlyParam(dataPromocionalId, dataPromocional?.title || "data-promocional")
      )}${query ? `?${query}` : ""}`
    );
  }

  return (
    <main>
      <ShopWithSidebar
        catalogo={catalogo}
        activeFilters={{
          categoria: "1",
          data_promocional: String(dataPromocionalId),
          subcategorias: firstParam(params.subcategorias) || "",
          publicos_alvos: firstParam(params.publicos_alvos) || "",
          quantidade_minima_min: firstParam(params.quantidade_minima_min) || "",
          quantidade_minima_max: firstParam(params.quantidade_minima_max) || "",
          datas_promocionais: firstParam(params.datas_promocionais) || String(dataPromocionalId),
          limit: firstParam(params.limit) || "100",
        }}
        categoryOptions={categorias}
        publicOptions={publicosAlvos}
        dateOptions={datasPromocionais}
        pageTitle={pageTitle}
        basePath="/datas-promocionais"
      />
    </main>
  );
};

export default DatasPromocionaísPage;
