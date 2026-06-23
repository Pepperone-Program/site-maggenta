import { MetadataRoute } from "next";
import { productPath } from "@/lib/products";
import { getMenuGroups, getProdutosForSitemap } from "@/lib/api";

const siteUrl = "https://www.maggenta.com.br";

const routes = [
  "",
  "/brindes-personalizados",
  "/brindes-para-empresas",
  "/lancamentos",
  "/orcamentos",
  "/fale-conosco",
  "/empresa-de-brindes",
  "/termos-de-uso",
  "/politicas-de-privacidade",
];

const staticLastModified = new Date(
  process.env.SITEMAP_STATIC_LASTMOD || "2026-05-19T00:00:00.000Z"
);

const sitemapPath = (path: string) => path.split(/[?#]/)[0];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: staticLastModified,
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  const products = await getProdutosForSitemap();
  const menuGroups = await getMenuGroups();
  const productRoutes = products.map((product) => ({
    url: `${siteUrl}${productPath(product)}`,
    lastModified: product.dataInclusao ? new Date(product.dataInclusao) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
    images: product.imgs.previews
      .filter((image) => image.startsWith("http"))
      .slice(0, 3),
  }));
  const menuRoutes = menuGroups
    .flatMap((group) => group.items || [])
    .filter(
      (item) =>
        item.path &&
        !item.path.includes("[") &&
        !["/", "/cart", "/wishlist", "/llms.txt"].includes(sitemapPath(item.path))
    )
    .map((item) => ({
      url: `${siteUrl}${sitemapPath(item.path)}`,
      lastModified: staticLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

  const uniqueRoutes = new Map(
    [...staticRoutes, ...menuRoutes, ...productRoutes].map((route) => [route.url, route])
  );

  return Array.from(uniqueRoutes.values());
}
