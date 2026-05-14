import { MetadataRoute } from "next";
import { productPath } from "@/lib/products";
import { getProdutosForSitemap } from "@/lib/api";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pepperone.com.br";

const routes = [
  "",
  "/brindes-personalizados",
  "/brindes-para-empresas",
  "/cart",
  "/orcamento",
  "/wishlist",
  "/contact",
  "/fale-conosco",
  "/empresa-de-brindes",
  "/termos-de-uso",
  "/politicas-de-privacidade",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  const products = await getProdutosForSitemap();
  const productRoutes = products.map((product) => ({
    url: `${siteUrl}${productPath(product)}`,
    lastModified: product.dataInclusao ? new Date(product.dataInclusao) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
    images: product.imgs.previews
      .filter((image) => image.startsWith("http"))
      .slice(0, 3),
  }));

  return [...staticRoutes, ...productRoutes];
}
