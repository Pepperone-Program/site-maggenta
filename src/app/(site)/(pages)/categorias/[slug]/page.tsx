import React from "react";
import { Metadata } from "next";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import {
  getCatalogoCategoria,
  getCatalogoCategorias,
  getDatasPromocionais,
  getPublicosAlvos,
} from "@/lib/api";
import { buildSeoOther, contextualKeywords, siteName, siteUrl } from "@/lib/seo";

export const revalidate = 120;

type PageProps = {
  params?: Promise<{ slug?: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const toNumber = (value: string | string[] | undefined) => {
  const parsed = parseInt(String(firstParam(value) || ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const titleFromSlug = (slug: string) => {
  const withoutId = slug.replace(/^\d+-?/, "").replace(/-personalizad[ao]s?$/i, "");

  return withoutId
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const personalizedAgreement = (categoryName: string) => {
  const normalized = normalizeText(categoryName);

  if (/personalizad[ao]s?/.test(normalized)) {
    return "";
  }

  const words: string[] = normalized.match(/[a-z0-9]+/g) || [];
  const firstWord = words[0] || "";
  const feminineWords = new Set([
    "bolsa",
    "bolsas",
    "caixa",
    "caixas",
    "caneca",
    "canecas",
    "caneta",
    "canetas",
    "embalagem",
    "embalagens",
    "ferramenta",
    "ferramentas",
    "fabricacao",
    "linha",
    "madeira",
    "mochila",
    "mochilas",
    "mala",
    "malas",
    "necessaire",
    "necessaires",
    "sacola",
    "sacolas",
    "tecnologia",
    "informatica",
  ]);
  const masculineWords = new Set([
    "bloco",
    "blocos",
    "brinde",
    "brindes",
    "caderno",
    "cadernos",
    "cooler",
    "coolers",
    "copo",
    "copos",
    "carregador",
    "carregadores",
    "chaveiro",
    "chaveiros",
    "fone",
    "fones",
    "guarda",
    "kit",
    "kits",
    "lapis",
    "neoprene",
    "pen",
    "pet",
    "porta",
    "squeeze",
    "squeezes",
    "uso",
  ]);
  const hasMasculine = words.some((word) => masculineWords.has(word));
  const isFeminine = feminineWords.has(firstWord) && !hasMasculine;
  const isPlural =
    firstWord.endsWith("s") ||
    /\se\s/.test(normalized) ||
    words.some((word) => word.endsWith("s"));

  if (isFeminine) {
    return isPlural ? "Personalizadas" : "Personalizada";
  }

  return isPlural ? "Personalizados" : "Personalizado";
};

const categorySeoTitle = (categoryName: string) => {
  const agreement = personalizedAgreement(categoryName);

  return agreement
    ? `${categoryName} ${agreement} Brindes Personalizados`
    : `${categoryName} Brindes Personalizados`;
};

const categorySeoDescription = (categoryName: string) => {
  const agreement = personalizedAgreement(categoryName);
  const nameWithAgreement = agreement ? `${categoryName} ${agreement}` : categoryName;

  return `${nameWithAgreement}, Querendo comprar Brindes Personalizados? É aqui na Pepperone Brindes`;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const routeParams = (await params) || {};
  const slug = routeParams.slug || "";
  const categoriaId = toNumber(slug) || 1;
  const catalogo = await getCatalogoCategoria(categoriaId, { page: 1, limit: 1 });
  const categoryName = catalogo.categoria?.categoria || titleFromSlug(slug) || "Categoria";
  const title = categorySeoTitle(categoryName);
  const description = categorySeoDescription(categoryName);
  const canonical = new URL(`/categorias/${slug}`, siteUrl).toString();

  return {
    title,
    description,
    keywords: contextualKeywords(categoryName, [
      `${categoryName} atacado`,
      `${categoryName} promocional`,
      `${categoryName} com logomarca`,
      `${categoryName} para eventos`,
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
      subject: `${categoryName}, brindes personalizados por categoria`,
    }),
  };
}

const CategoriasPage = async ({ params, searchParams }: PageProps) => {
  const routeParams = (await params) || {};
  const query = (await searchParams) || {};
  const categoriaId = toNumber(routeParams.slug) || 1;
  const selectedDatas = firstParam(query.datas_promocionais) || firstParam(query.data_promocional);
  const [catalogo, categorias, publicosAlvos, datasPromocionais] = await Promise.all([
    getCatalogoCategoria(categoriaId, {
      empresaId: toNumber(query.empresaId) || 1,
      page: toNumber(query.page) || 1,
      limit: toNumber(query.limit) || 24,
      subcategorias: firstParam(query.subcategorias),
      publicos_alvos: firstParam(query.publicos_alvos),
      quantidade_minima_min: toNumber(query.quantidade_minima_min),
      quantidade_minima_max: toNumber(query.quantidade_minima_max),
      data_promocional: firstParam(query.data_promocional),
      datas_promocionais: firstParam(query.datas_promocionais),
    }),
    getCatalogoCategorias(),
    getPublicosAlvos(),
    getDatasPromocionais(),
  ]);

  return (
    <main>
      <ShopWithSidebar
        catalogo={catalogo}
        activeFilters={{
          categoria: String(categoriaId),
          subcategorias: firstParam(query.subcategorias) || "",
          publicos_alvos: firstParam(query.publicos_alvos) || "",
          quantidade_minima_min: firstParam(query.quantidade_minima_min) || "",
          quantidade_minima_max: firstParam(query.quantidade_minima_max) || "",
          datas_promocionais: selectedDatas || "",
          limit: firstParam(query.limit) || "24",
        }}
        categoryOptions={categorias}
        publicOptions={publicosAlvos}
        dateOptions={datasPromocionais}
        basePath={`/categorias/${routeParams.slug || categoriaId}`}
      />
    </main>
  );
};

export default CategoriasPage;
