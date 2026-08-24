import { MetadataRoute } from "next";
import { productPath } from "@/lib/products";
import {
  friendlyParam,
  friendlyPersonalizedParam,
  getCatalogoCategoria,
  getCatalogoCategorias,
  getCatalogoTiposProdutos,
  getDatasPromocionais,
  getLandingPages,
  getProdutosForSitemap,
  getPublicosAlvos,
} from "@/lib/api";
import { categoryPath, siteUrl, subcategoryPath } from "@/lib/seo";

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

const staticLastModified = new Date(
  process.env.SITEMAP_STATIC_LASTMOD || "2026-05-19T00:00:00.000Z"
);

const absoluteUrl = (path: string) => new URL(path || "/", siteUrl).toString();

const safeDate = (value?: string) => {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const absoluteImageUrl = (image: string) => new URL(image, siteUrl).toString();

const uniqueByUrl = (entries: SitemapEntry[]) =>
  Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categorias, tipos, publicos, datas, landingPages] = await Promise.all([
    getProdutosForSitemap(),
    getCatalogoCategorias(),
    getCatalogoTiposProdutos(),
    getPublicosAlvos(),
    getDatasPromocionais(),
    getLandingPages(),
  ]);

  const categoryCatalogs = await Promise.all(
    categorias.map((category) =>
      getCatalogoCategoria(category.id, { page: 1, limit: 1 }).catch(() => null)
    )
  );

  const categoryRoutes: SitemapEntry[] = categorias.map((category) => ({
    url: absoluteUrl(categoryPath(category.id, category.title)),
    lastModified: staticLastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const subcategoryRoutes: SitemapEntry[] = categoryCatalogs.flatMap((catalogo) =>
    (catalogo?.filtros.subcategorias || []).map((subcategory) => ({
      url: absoluteUrl(
        subcategoryPath(subcategory.id_subcategoria, subcategory.subcategoria)
      ),
      lastModified: staticLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.84,
    }))
  );

  const typeRoutes: SitemapEntry[] = tipos.map((tipo) => ({
    url: absoluteUrl(
      `/brindes-para-empresas/${encodeURIComponent(
        friendlyPersonalizedParam(tipo.id, tipo.title)
      )}`
    ),
    lastModified: staticLastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const publicRoutes: SitemapEntry[] = publicos.map((publico) => ({
    url: absoluteUrl(
      `/publicos-alvos/${encodeURIComponent(friendlyParam(publico.id, publico.title))}`
    ),
    lastModified: staticLastModified,
    changeFrequency: "weekly",
    priority: 0.84,
  }));

  const dateRoutes: SitemapEntry[] = datas.map((data) => ({
    url: absoluteUrl(
      `/datas-promocionais/${encodeURIComponent(friendlyParam(data.id, data.title))}`
    ),
    lastModified: staticLastModified,
    changeFrequency: "weekly",
    priority: 0.84,
  }));

  const productRoutes: SitemapEntry[] = products.map((product) => ({
    url: absoluteUrl(productPath(product)),
    lastModified: safeDate(product.dataInclusao),
    changeFrequency: "weekly",
    priority: 0.92,
    images: product.imgs.previews
      .filter(Boolean)
      .map(absoluteImageUrl)
      .slice(0, 3),
  }));

  const landingPageRoutes: SitemapEntry[] = landingPages.map((landingPage) => ({
    url: absoluteUrl(landingPage.path),
    lastModified: safeDate(landingPage.data_lp || undefined),
    changeFrequency: "weekly",
    priority: 0.88,
  }));

  const baseRoutes: SitemapEntry[] = staticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: staticLastModified,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
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
