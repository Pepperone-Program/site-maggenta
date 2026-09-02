import React from "react";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import {
  getCatalogoCategoria,
  getCatalogoCategorias,
  getCatalogoSubcategoriaProdutos,
  getDatasPromocionais,
  getPublicosAlvos,
} from "@/lib/api";
import { brandOpenGraphImages, buildSeoOther, catalogRobots, contextualKeywords, noIndexRobots, siteName, siteUrl, subcategoryPath } from "@/lib/seo";

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

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const routeParams = (await params) || {};
  const query = (await searchParams) || {};
  const slug = routeParams.slug || "";
  const subcategoriaId = toNumber(slug);
  if (!subcategoriaId) {
    notFound();
  }
  const catalogo = await getCatalogoSubcategoriaProdutos(
    subcategoriaId,
    titleFromSlug(slug) || "Subcategoria",
    {
      page: 1,
      limit: 1,
      idCategoria: toNumber(firstParam(query.categoria)),
    }
  );
  if (!catalogo.categoria) {
    notFound();
  }
  const subcategoriaName = catalogo.categoria.categoria;
  const title = `${subcategoriaName} Personalizados para Empresas`;
  const description = `Conheça opções de ${subcategoriaName.toLocaleLowerCase("pt-BR")} personalizados para empresas, eventos e campanhas. Peça seu orçamento com a Maggenta.`;
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
      subject: `${subcategoriaName}, subcategoria de brindes personalizados`,
    }),
  };
}

const SubcategoriaPage = async ({ params, searchParams }: PageProps) => {
  const routeParams = (await params) || {};
  const query = (await searchParams) || {};
  const slug = routeParams.slug || "";
  const subcategoriaId = toNumber(slug);
  if (!subcategoriaId) notFound();
  const subcategoriaName = titleFromSlug(slug) || "Subcategoria";
  const page = toNumber(firstParam(query.page)) || 1;
  const limit = toNumber(firstParam(query.limit)) || 24;
  const categoriaIdFromQuery = toNumber(firstParam(query.categoria));
  const selectedDatas = firstParam(query.datas_promocionais) || firstParam(query.data_promocional);
  const [catalogo, categorias, publicosAlvos, datasPromocionais] = await Promise.all([
    getCatalogoSubcategoriaProdutos(subcategoriaId, subcategoriaName, {
      empresaId: toNumber(firstParam(query.empresaId)) || 1,
      page,
      limit,
      idCategoria: categoriaIdFromQuery,
      publicos_alvos: firstParam(query.publicos_alvos),
      quantidade_minima_min: toNumber(firstParam(query.quantidade_minima_min)),
      quantidade_minima_max: toNumber(firstParam(query.quantidade_minima_max)),
      data_promocional: firstParam(query.data_promocional),
      datas_promocionais: firstParam(query.datas_promocionais),
    }),
    getCatalogoCategorias(),
    getPublicosAlvos(),
    getDatasPromocionais(),
  ]);
  if (!catalogo.categoria) notFound();
  const parentCategoriaId = catalogo.parentCategoryId || categoriaIdFromQuery || 0;
  const parentCatalogo = parentCategoriaId
    ? await getCatalogoCategoria(parentCategoriaId, { page: 1, limit: 24 })
    : null;
  const parentSubcategories = parentCatalogo?.filtros.subcategorias || [];
  const parentContainsCurrentSubcategory = parentSubcategories.some(
    (item) => item.id_subcategoria === subcategoriaId
  );
  const catalogoComFiltrosDaCategoria = parentCatalogo && parentContainsCurrentSubcategory
    ? {
        ...catalogo,
        filtros: {
          ...catalogo.filtros,
          subcategorias: parentSubcategories,
        },
      }
    : catalogo;
  const canonicalName = catalogo.categoria.categoria;
  const canonicalPath = subcategoryPath(subcategoriaId, canonicalName);
  const currentPath = `/subcategorias/${slug}`;

  if (currentPath !== canonicalPath) {
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
      <ShopWithSidebar
        catalogo={catalogoComFiltrosDaCategoria}
        activeFilters={{
          categoria: String(parentCategoriaId || 1),
          subcategorias: String(subcategoriaId || ""),
          publicos_alvos: firstParam(query.publicos_alvos) || "",
          quantidade_minima_min: firstParam(query.quantidade_minima_min) || "",
          quantidade_minima_max: firstParam(query.quantidade_minima_max) || "",
          datas_promocionais: selectedDatas || "",
          limit: firstParam(query.limit) || "24",
        }}
        categoryOptions={categorias}
        publicOptions={publicosAlvos}
        dateOptions={datasPromocionais}
        pageTitle={`${canonicalName} personalizado`}
        basePath={canonicalPath}
        subcategoriesContextCategoryId={parentCategoriaId || undefined}
      />
    </main>
  );
};

export default SubcategoriaPage;
