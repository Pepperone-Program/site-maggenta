import React from "react";
import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import {
  getCatalogoSubcategoria,
  getCatalogoTipoProduto,
  friendlyPersonalizedParam,
  personalizedTitle,
  searchProdutosSiteCatalogo,
  searchProdutosSiteWithDestination,
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
  const catalogo = await resolveCatalogo(slug);
  const tipoName = catalogo.tipo_produto?.tipo_produto || "Brindes para empresas";
  const displayName = personalizedTitle(tipoName);
  const title = `${displayName} para Empresas e Eventos`;
  const description = `${displayName}, Querendo comprar Brindes Personalizados? E aqui na Maggenta Brindes`;
  const tipoId = catalogo.tipo_produto?.id_tipo_produto || toNumber(slug) || 0;
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
      subject: `${displayName}, tipos de produtos personalizados`,
    }),
  };
}

const toNumber = (value: string | undefined) => {
  const parsed = parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const titleFromSlug = (slug: string) =>
  slug
    .replace(/^\d+-?/, "")
    .replace(/-personalizad[ao]s?$/i, "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const resolveCatalogo = async (slug: string, page = 1, limit = 24) => {
  const tipoId = toNumber(slug);

  if (tipoId) {
    return getCatalogoTipoProduto(tipoId, { page, limit });
  }

  const term = titleFromSlug(slug);
  const catalogo = await searchProdutosSiteCatalogo(term, { page, limit });

  if (catalogo.total > 0) {
    return catalogo;
  }

  const { destinoBusca } = await searchProdutosSiteWithDestination(term, 1);

  if (destinoBusca?.tipo === "subcategoria" && destinoBusca.id_subcategoria) {
    return getCatalogoSubcategoria(destinoBusca.id_subcategoria, {
      idCategoria: destinoBusca.id_categoria || undefined,
      page,
      limit,
    });
  }

  return getCatalogoTipoProduto(12, { page, limit });
};

const BrindesParaEmpresasTipoPage = async ({ params, searchParams }: PageProps) => {
  const routeParams = (await params) || {};
  const query = (await searchParams) || {};
  const page = toNumber(firstParam(query.page)) || 1;
  const limit = toNumber(firstParam(query.limit)) || 24;
  const catalogo = await resolveCatalogo(routeParams.slug || "", page, limit);
  const title = catalogo.tipo_produto?.tipo_produto || "Brindes para empresas";
  const tipoId = catalogo.tipo_produto?.id_tipo_produto || toNumber(routeParams.slug) || 0;
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
      />
    </main>
  );
};

export default BrindesParaEmpresasTipoPage;
