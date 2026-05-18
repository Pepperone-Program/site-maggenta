import React from "react";
import { Metadata } from "next";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import {
  getCatalogoCategorias,
  getCatalogoPublicoAlvo,
  getDatasPromocionais,
  getPublicosAlvos,
} from "@/lib/api";

export const revalidate = 120;

type PageProps = {
  params?: Promise<{ slug?: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const siteUrl = "https://www.pepperone.com.br";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const routeParams = (await params) || {};
  const slug = routeParams.slug || "";

  return {
    title: "Brindes por publico-alvo",
    description:
      "Brindes personalizados filtrados por publico-alvo para campanhas corporativas.",
    alternates: {
      canonical: new URL(`/publicos-alvos/${slug}`, siteUrl).toString(),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const toNumber = (value: string | string[] | undefined) => {
  const parsed = parseInt(String(firstParam(value) || ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const PublicoAlvoSlugPage = async ({ params, searchParams }: PageProps) => {
  const routeParams = (await params) || {};
  const query = (await searchParams) || {};
  const publicoAlvoId = toNumber(routeParams.slug) || 1;
  const [catalogo, categorias, publicosAlvos, datasPromocionais] = await Promise.all([
    getCatalogoPublicoAlvo(publicoAlvoId, {
      empresaId: 1,
      page: toNumber(query.page) || 1,
      limit: toNumber(query.limit) || 100,
      publicos_alvos: firstParam(query.publicos_alvos) || String(publicoAlvoId),
      datas_promocionais: firstParam(query.datas_promocionais),
      subcategorias: firstParam(query.subcategorias),
      quantidade_minima_min: toNumber(query.quantidade_minima_min),
      quantidade_minima_max: toNumber(query.quantidade_minima_max),
    }),
    getCatalogoCategorias(),
    getPublicosAlvos(),
    getDatasPromocionais(),
  ]);

  const publicoAlvo = publicosAlvos.find((p) => p.id === publicoAlvoId);

  return (
    <main>
      <ShopWithSidebar
        catalogo={catalogo}
        activeFilters={{
          categoria: "1",
          publico_alvo: String(publicoAlvoId),
          subcategorias: firstParam(query.subcategorias) || "",
          publicos_alvos: firstParam(query.publicos_alvos) || String(publicoAlvoId),
          quantidade_minima_min: firstParam(query.quantidade_minima_min) || "",
          quantidade_minima_max: firstParam(query.quantidade_minima_max) || "",
          datas_promocionais: firstParam(query.datas_promocionais) || "",
          limit: firstParam(query.limit) || "100",
        }}
        categoryOptions={categorias}
        publicOptions={publicosAlvos}
        dateOptions={datasPromocionais}
        pageTitle={`Brindes para ${publicoAlvo?.title || "Publico Alvo"}`}
        basePath={`/publicos-alvos/${routeParams.slug || publicoAlvoId}`}
      />
    </main>
  );
};

export default PublicoAlvoSlugPage;
