import React from "react";
import { Metadata } from "next";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import {
  getCatalogoSubcategoria,
  getCatalogoTipoProduto,
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
  const title = `${tipoName} Personalizados para Empresas e Eventos`;
  const description = `${tipoName}, Querendo comprar Brindes Personalizados? É aqui na Pepperone Brindes`;
  const canonical = new URL(`/brindes-para-empresas/${slug}`, siteUrl).toString();

  return {
    title,
    description,
    keywords: contextualKeywords(tipoName, [
      `${tipoName} personalizado para empresa`,
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
      subject: `${tipoName}, tipos de produtos personalizados`,
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

const personalizedTerm = (value: string) => {
  const term = value.trim() || "Brinde";
  const normalized = term
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  const suffix = normalized.endsWith("a") ? "personalizada" : "personalizado";

  return `${term} ${suffix}`;
};

const searchCatalogo = (term: string, products: Product[]) => ({
  tipo_produto: {
    id_empresa: 1,
    id_tipo_produto: 0,
    tipo_produto: personalizedTerm(term),
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

  return (
    <main>
      <ShopWithoutSidebar
        products={catalogo.items}
        title={catalogo.tipo_produto?.tipo_produto || "Brindes para empresas"}
        description={catalogo.tipo_produto?.descricao || ""}
      />
    </main>
  );
};

export default BrindesParaEmpresasTipoPage;
