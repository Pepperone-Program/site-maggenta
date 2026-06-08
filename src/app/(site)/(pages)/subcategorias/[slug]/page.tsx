import React from "react";
import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import {
  getCatalogoCategorias,
  getCatalogoSubcategoriaProdutos,
  getDatasPromocionais,
  getPublicosAlvos,
} from "@/lib/api";
import { buildSeoOther, contextualKeywords, siteName, siteUrl, subcategoryPath } from "@/lib/seo";

export const revalidate = 120;

type PageProps = {
  params?: Promise<{ slug?: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const toNumber = (value: string | undefined) => {
  const parsed = parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const titleFromSlug = (slug = "") =>
  slug
    .replace(/^\d+-?/, "")
    .replace(/-personalizad[ao]s?$/i, "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const routeParams = (await params) || {};
  const slug = routeParams.slug || "";
  const subcategoriaId = toNumber(slug) || 0;
  const subcategoriaName = titleFromSlug(slug) || "Subcategoria";
  const title = `${subcategoriaName} Personalizado Brindes Personalizados`;
  const description = `${subcategoriaName} Personalizado, Querendo comprar Brindes Personalizados? É aqui na Pepperone Brindes`;
  const canonical = new URL(
    subcategoryPath(subcategoriaId || 0, subcategoriaName),
    siteUrl
  ).toString();

  return {
    title,
    description,
    keywords: contextualKeywords(subcategoriaName, [
      `${subcategoriaName} personalizado`,
      `${subcategoriaName} brindes para empresas`,
      `${subcategoriaName} com logomarca`,
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
      subject: `${subcategoriaName}, subcategoria de brindes personalizados`,
    }),
  };
}

const SubcategoriaPage = async ({ params, searchParams }: PageProps) => {
  const routeParams = (await params) || {};
  const query = (await searchParams) || {};
  const slug = routeParams.slug || "";
  const subcategoriaId = toNumber(slug) || 0;
  const subcategoriaName = titleFromSlug(slug) || "Subcategoria";
  const [catalogo, categorias, publicosAlvos, datasPromocionais] = await Promise.all([
    getCatalogoSubcategoriaProdutos(subcategoriaId, subcategoriaName),
    getCatalogoCategorias(),
    getPublicosAlvos(),
    getDatasPromocionais(),
  ]);
  const canonicalPath = subcategoryPath(subcategoriaId || 0, subcategoriaName);
  const currentPath = `/subcategorias/${slug}`;

  if (currentPath !== canonicalPath || firstParam(query.page)) {
    permanentRedirect(canonicalPath);
  }

  return (
    <main>
      <ShopWithSidebar
        catalogo={catalogo}
        activeFilters={{
          categoria: String(subcategoriaId || 1),
          subcategorias: String(subcategoriaId || ""),
          limit: "100",
        }}
        categoryOptions={categorias}
        publicOptions={publicosAlvos}
        dateOptions={datasPromocionais}
        pageTitle={`${subcategoriaName} personalizado`}
        basePath={canonicalPath}
      />
    </main>
  );
};

export default SubcategoriaPage;
