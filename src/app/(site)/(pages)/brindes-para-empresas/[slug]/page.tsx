import React from "react";
import { Metadata } from "next";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import {
  getCatalogoSubcategoria,
  getCatalogoTipoProduto,
  searchProdutosSiteWithDestination,
} from "@/lib/api";
import { buildSeoOther, contextualKeywords, siteName, siteUrl } from "@/lib/seo";

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

const resolveCatalogo = async (slug: string) => {
  const tipoId = toNumber(slug);

  if (tipoId) {
    return getCatalogoTipoProduto(tipoId);
  }

  const { destinoBusca } = await searchProdutosSiteWithDestination(titleFromSlug(slug), 1);

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
