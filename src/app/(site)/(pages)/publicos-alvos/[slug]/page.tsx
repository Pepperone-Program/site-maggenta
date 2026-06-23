import React from "react";
import { Metadata } from "next";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import {
  getCatalogoCategorias,
  getCatalogoPublicoAlvo,
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
  const publicoAlvoId = toNumber(slug) || 1;
  const catalogo = await getCatalogoPublicoAlvo(publicoAlvoId, { page: 1, limit: 1 });
  const publicoName = catalogo.categoria?.categoria || "Público Alvo";
  const title = `Brindes para ${publicoName} Personalizados e Corporativos`;
  const description = `Brindes para ${publicoName}, Querendo comprar Brindes Personalizados? É aqui na Maggenta Brindes`;
  const canonical = new URL(`/publicos-alvos/${slug}`, siteUrl).toString();

  return {
    title,
    description,
    keywords: contextualKeywords(`brindes para ${publicoName}`, [
      `${publicoName} brindes corporativos`,
      `${publicoName} produtos promocionais`,
      `${publicoName} campanhas promocionais`,
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
      subject: `${publicoName}, brindes por publico-alvo`,
    }),
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
