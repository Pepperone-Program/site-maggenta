import { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { productPath } from "@/lib/products";
import {
  friendlyParam,
  friendlyPersonalizedParam,
  getCatalogoCategoria,
  getCatalogoCategorias,
  getCatalogoDataPromocional,
  getCatalogoPublicoAlvo,
  getCatalogoTiposProdutos,
  getDatasPromocionais,
  getLandingPages,
  getProdutosForSitemap,
  getPublicosAlvos,
} from "@/lib/api";
import { categoryPath, isIndexableLandingPage, siteUrl, subcategoryPath } from "@/lib/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

export const dynamic = "force-dynamic";
export const revalidate = 300;

const staticRoutes = [
  "",
  "/brindes-personalizados",
  "/brindes-para-empresas",
  "/lancamentos",
  "/orcamentos",
  "/fale-conosco",
  "/empresa-de-brindes",
  "/termos-de-uso",
  "/politicas-de-privacidade",
  "/publicos-alvos",
  "/datas-promocionais",
];

const absoluteUrl = (path: string) => new URL(path || "/", siteUrl).toString();

const validDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const absoluteImageUrl = (image: string) => new URL(image, siteUrl).toString();

const uniqueByUrl = (entries: SitemapEntry[]) =>
  Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());

async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categorias, tipos, publicos, datas, landingPages] = await Promise.all([
    getProdutosForSitemap(),
    getCatalogoCategorias(),
    getCatalogoTiposProdutos(),
    getPublicosAlvos(),
    getDatasPromocionais(),
    getLandingPages(),
  ]);

  const [categoryCatalogs, audienceCatalogs, dateCatalogs] = await Promise.all([
    Promise.all(
      categorias.map((category) =>
        getCatalogoCategoria(category.id, { page: 1, limit: 1 }).catch(() => null)
      )
    ),
    Promise.all(
      publicos.map((publico) =>
        getCatalogoPublicoAlvo(publico.id, { page: 1, limit: 1 }).catch(() => null)
      )
    ),
    Promise.all(
      datas.map((data) =>
        getCatalogoDataPromocional(data.id, { page: 1, limit: 1 }).catch(() => null)
      )
    ),
  ]);
  const productTypeIds = new Set(
    products.map((product) => product.idTipoProduto).filter((id): id is number => Boolean(id))
  );
  const subcategories = Array.from(
    new Map(
      categoryCatalogs
        .filter((catalog) => catalog?.categoria && Number(catalog.total) > 0)
        .flatMap((catalog) => catalog?.filtros.subcategorias || [])
        .map((item) => [item.id_subcategoria, item])
    ).values()
  );

  const categoryRoutes: SitemapEntry[] = categorias
    .filter((_, index) => {
      const catalog = categoryCatalogs[index];
      return Boolean(catalog?.categoria) && Number(catalog?.total) > 0;
    })
    .map((category) => ({
      url: absoluteUrl(categoryPath(category.id, category.title)),
    }));

  const subcategoryRoutes: SitemapEntry[] = subcategories.map((subcategory) => ({
      url: absoluteUrl(
        subcategoryPath(subcategory.id_subcategoria, subcategory.subcategoria)
      ),
    }));

  const typeRoutes: SitemapEntry[] = tipos
    .filter((tipo) => productTypeIds.has(tipo.id))
    .map((tipo) => ({
      url: absoluteUrl(
        `/brindes-para-empresas/${encodeURIComponent(
          friendlyPersonalizedParam(tipo.id, tipo.title)
        )}`
      ),
    }));

  const publicRoutes: SitemapEntry[] = publicos
    .filter((_, index) => {
      const catalog = audienceCatalogs[index];
      return Boolean(catalog?.categoria) && Number(catalog?.total) > 0;
    })
    .map((publico) => ({
      url: absoluteUrl(
        `/publicos-alvos/${encodeURIComponent(friendlyParam(publico.id, publico.title))}`
      ),
    }));

  const dateRoutes: SitemapEntry[] = datas
    .filter((_, index) => {
      const catalog = dateCatalogs[index];
      return Boolean(catalog?.categoria) && Number(catalog?.total) > 0;
    })
    .map((data) => ({
      url: absoluteUrl(
        `/datas-promocionais/${encodeURIComponent(friendlyParam(data.id, data.title))}`
      ),
    }));

  const productRoutes: SitemapEntry[] = products.map((product) => ({
    url: absoluteUrl(productPath(product)),
    ...(validDate(product.updatedAt) ? { lastModified: validDate(product.updatedAt) } : {}),
    images: product.imgs.previews
      .filter(Boolean)
      .map(absoluteImageUrl)
      .slice(0, 3),
  }));

  const landingPageRoutes: SitemapEntry[] = landingPages
    .filter(isIndexableLandingPage)
    .map((landingPage) => ({
      url: absoluteUrl(landingPage.path),
    }));

  const baseRoutes: SitemapEntry[] = staticRoutes.map((route) => ({
    url: absoluteUrl(route),
  }));

  return uniqueByUrl([
    ...baseRoutes,
    ...categoryRoutes,
    ...subcategoryRoutes,
    ...typeRoutes,
    ...publicRoutes,
    ...dateRoutes,
    ...productRoutes,
    ...landingPageRoutes,
  ]);
}

const getCachedSitemap = unstable_cache(buildSitemap, ["validated-sitemap-v2"], {
  revalidate,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getCachedSitemap();
}
