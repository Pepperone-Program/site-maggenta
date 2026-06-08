import React from "react";
import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import {
  getCatalogoSubcategoria,
  getCatalogoTipoProduto,
  friendlyPersonalizedParam,
  personalizedTitle,
  searchProdutosSiteAll,
  searchProdutosSiteWithDestination,
} from "@/lib/api";
import { buildSeoOther, contextualKeywords, siteName, siteUrl } from "@/lib/seo";
import { Product } from "@/types/product";

export const revalidate = 120;

type PageProps = {
  params?: Promise<{ slug?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const routeParams = (await params) || {};
  const slug = routeParams.slug || "";
  const catalogo = await resolveCatalogo(slug);
  const tipoName = catalogo.tipo_produto?.tipo_produto || "Brindes para empresas";
  const displayName = personalizedTitle(tipoName);
  const title = `${displayName} para Empresas e Eventos`;
  const description = `${displayName}, Querendo comprar Brindes Personalizados? E aqui na Pepperone Brindes`;
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

const searchCatalogo = (term: string, products: Product[]) => ({
  tipo_produto: {
    id_empresa: 1,
    id_tipo_produto: 0,
    tipo_produto: term,
    descricao: `Resultados encontrados para "${term}" com base no nome do produto.`,
    habilitado: "S",
  },
  filtros: {
    subcategorias: [],
    publicos_alvos: [],
    datas_promocionais: [],
    quantidade_minima: {
      min: 0,
      max: 0,
    },
  },
  items: products,
  total: products.length,
  page: 1,
  limit: products.length || 100,
  totalPages: 1,
});

const resolveCatalogo = async (slug: string) => {
  const tipoId = toNumber(slug);

  if (tipoId) {
    return getCatalogoTipoProduto(tipoId);
  }

  const term = titleFromSlug(slug);
  const products = await searchProdutosSiteAll(term);

  if (products.length) {
    return searchCatalogo(term, products);
  }

  const { destinoBusca } = await searchProdutosSiteWithDestination(term, 1);

  if (destinoBusca?.tipo === "subcategoria" && destinoBusca.id_subcategoria) {
    return getCatalogoSubcategoria(destinoBusca.id_subcategoria, {
      idCategoria: destinoBusca.id_categoria || undefined,
    });
  }

  return getCatalogoTipoProduto(12);
};

const BrindesParaEmpresasTipoPage = async ({ params }: PageProps) => {
  const routeParams = (await params) || {};
  const catalogo = await resolveCatalogo(routeParams.slug || "");
  const title = catalogo.tipo_produto?.tipo_produto || "Brindes para empresas";
  const tipoId = catalogo.tipo_produto?.id_tipo_produto || toNumber(routeParams.slug) || 0;
  const canonicalPath = `/brindes-para-empresas/${encodeURIComponent(
    friendlyPersonalizedParam(tipoId, title)
  )}`;

  if (`/brindes-para-empresas/${routeParams.slug || ""}` !== canonicalPath) {
    permanentRedirect(canonicalPath);
  }

  return (
    <main>
      <ShopWithoutSidebar
        products={catalogo.items}
        title={personalizedTitle(title)}
        description={catalogo.tipo_produto?.descricao || ""}
      />
    </main>
  );
};

export default BrindesParaEmpresasTipoPage;
