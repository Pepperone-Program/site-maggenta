import React from "react";
import { Metadata } from "next";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import {
  getCatalogoCategorias,
  getCatalogoDataPromocional,
  getDatasPromocionais,
  getPublicosAlvos,
} from "@/lib/api";
import { buildSeoOther, contextualKeywords, siteName, siteUrl } from "@/lib/seo";

export const revalidate = 120;

type PageProps = {
  params?: Promise<{ slug?: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const routeParams = (await params) || {};
  const slug = routeParams.slug || "";
  const dataPromocionalId = toNumber(slug) || 1;
  const catalogo = await getCatalogoDataPromocional(dataPromocionalId, { page: 1, limit: 1 });
  const dataName = catalogo.categoria?.categoria || "Data Promocional";
  const title = `Brindes para ${dataName} Personalizados e Promocionais`;
  const description = `${dataName}, Querendo comprar Brindes Personalizados? É aqui na Pepperone Brindes`;
  const canonical = new URL(`/datas-promocionais/${slug}`, siteUrl).toString();

  return {
    title,
    description,
    keywords: contextualKeywords(`brindes para ${dataName}`, [
      `${dataName} brindes`,
      `${dataName} lembranças corporativas`,
      `${dataName} campanha promocional`,
    ]),
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName,
      locale: "pt_BR",
    },
    other: buildSeoOther({
      title,
      description,
      canonical,
      subject: `${dataName}, brindes para datas promocionais`,
    }),
  };
}

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
