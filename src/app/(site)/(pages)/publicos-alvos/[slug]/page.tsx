import React from "react";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import {
  getCatalogoCategorias,
  getCatalogoPublicoAlvo,
  getDatasPromocionais,
  getPublicosAlvos,
  friendlyParam,
} from "@/lib/api";
import { brandOpenGraphImages, buildSeoOther, catalogRobots, contextualKeywords, noIndexRobots, siteName, siteUrl } from "@/lib/seo";

export const revalidate = 120;

type PageProps = {
  params?: Promise<{ slug?: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const routeParams = (await params) || {};
  const query = (await searchParams) || {};
  const slug = routeParams.slug || "";
  const publicoAlvoId = toNumber(slug);
  if (!publicoAlvoId) {
    notFound();
  }
  const catalogo = await getCatalogoPublicoAlvo(publicoAlvoId, { page: 1, limit: 1 });
  if (!catalogo.categoria) {
    notFound();
  }
  const publicoName = catalogo.categoria.categoria;
  const title = `Brindes para ${publicoName} Personalizados e Corporativos`;
  const description = `Encontre brindes personalizados para ${publicoName.toLocaleLowerCase("pt-BR")}, ideais para relacionamento, eventos e campanhas corporativas. Solicite um orçamento.`;
  const canonical = new URL(
    `/publicos-alvos/${encodeURIComponent(friendlyParam(publicoAlvoId, publicoName))}`,
    siteUrl
  ).toString();

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
    robots: catalogo.total > 0 ? catalogRobots(query) : noIndexRobots,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName,
      locale: "pt_BR",
      images: brandOpenGraphImages,
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
  const publicoAlvoId = toNumber(routeParams.slug);
  if (!publicoAlvoId) notFound();
  const [catalogo, categorias, publicosAlvos, datasPromocionais] = await Promise.all([
    getCatalogoPublicoAlvo(publicoAlvoId, {
      empresaId: 1,
      page: toNumber(query.page) || 1,
      limit: toNumber(query.limit) || 24,
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
  if (!catalogo.categoria) notFound();

  const canonicalPath = `/publicos-alvos/${encodeURIComponent(
    friendlyParam(publicoAlvoId, catalogo.categoria.categoria)
  )}`;
  const currentPath = `/publicos-alvos/${routeParams.slug || ""}`;
  if (currentPath !== canonicalPath) {
    const redirectParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      const param = firstParam(value);
      if (param) redirectParams.set(key, param);
    });
    const redirectQuery = redirectParams.toString();
    permanentRedirect(`${canonicalPath}${redirectQuery ? `?${redirectQuery}` : ""}`);
  }

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
          limit: firstParam(query.limit) || "24",
        }}
        categoryOptions={categorias}
        publicOptions={publicosAlvos}
        dateOptions={datasPromocionais}
        pageTitle={`Brindes para ${publicoAlvo?.title || "Publico Alvo"}`}
        basePath={canonicalPath}
      />
    </main>
  );
};

export default PublicoAlvoSlugPage;
