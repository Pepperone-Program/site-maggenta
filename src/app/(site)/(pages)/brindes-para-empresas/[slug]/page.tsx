import React from "react";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import {
  getCatalogoTipoProduto,
  friendlyPersonalizedParam,
  personalizedTitle,
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
  const tipoId = toNumber(slug);
  if (!tipoId) {
    notFound();
  }
  const catalogo = await getCatalogoTipoProduto(tipoId, { page: 1, limit: 1 });
  if (!catalogo.tipo_produto) {
    notFound();
  }
  const tipoName = catalogo.tipo_produto.tipo_produto;
  const displayName = personalizedTitle(tipoName);
  const title = `${displayName} para Empresas e Eventos`;
  const description = `Personalize ${displayName.toLocaleLowerCase("pt-BR")} para eventos, campanhas e ações corporativas. Consulte opções e solicite um orçamento com a Maggenta.`;
  const canonical = new URL(
    `/brindes-para-empresas/${encodeURIComponent(friendlyPersonalizedParam(tipoId, tipoName))}`,
    siteUrl
  ).toString();

  return {
    title,
    description,
    keywords: contextualKeywords(displayName, [
      `${displayName} para empresa`,
      `${tipoName} promocional`,
      `${tipoName} com logomarca`,
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
      subject: `${displayName}, tipos de produtos personalizados`,
    }),
  };
}

const toNumber = (value: string | undefined) => {
  const parsed = parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const BrindesParaEmpresasTipoPage = async ({ params, searchParams }: PageProps) => {
  const routeParams = (await params) || {};
  const query = (await searchParams) || {};
  const page = toNumber(firstParam(query.page)) || 1;
  const limit = toNumber(firstParam(query.limit)) || 24;
  const tipoId = toNumber(routeParams.slug);
  if (!tipoId) notFound();
  const catalogo = await getCatalogoTipoProduto(tipoId, { page, limit });
  if (!catalogo.tipo_produto) notFound();
  const title = catalogo.tipo_produto.tipo_produto;
  const canonicalPath = `/brindes-para-empresas/${encodeURIComponent(
    friendlyPersonalizedParam(tipoId, title)
  )}`;

  if (`/brindes-para-empresas/${routeParams.slug || ""}` !== canonicalPath) {
    const redirectParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      const firstValue = firstParam(value);
      if (firstValue) {
        redirectParams.set(key, firstValue);
      }
    });

    const redirectQuery = redirectParams.toString();
    permanentRedirect(`${canonicalPath}${redirectQuery ? `?${redirectQuery}` : ""}`);
  }

  return (
    <main>
      <ShopWithoutSidebar
        products={catalogo.items}
        title={personalizedTitle(title)}
        description={catalogo.tipo_produto?.descricao || ""}
        total={catalogo.total}
        page={catalogo.page}
        limit={catalogo.limit}
        totalPages={catalogo.totalPages}
        basePath={canonicalPath}
        loadMoreUrl={
          `/api/produtos/catalogo?kind=type&id=${tipoId}&limit=${catalogo.limit}`
        }
        pagesPerLoad={1}
      />
    </main>
  );
};

export default BrindesParaEmpresasTipoPage;
