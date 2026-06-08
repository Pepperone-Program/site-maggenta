import shopData from "@/components/Shop/shopData";
import { Product } from "@/types/product";
import { slugify } from "@/lib/slugs";

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const formatDisplayPrice = (value: number) =>
  value > 0 ? formatPrice(value) : "Sob consulta";

export const productPath = (product: Partial<Pick<Product, "slug" | "id" | "title">>) => {
  if (product.slug) {
    return `/brindes-personalizados/${product.slug}`;
  }

  if (product.id) {
    const titleSlug = product.title ? slugify(product.title) : "produto";
    return `/brindes-personalizados/${product.id}-${titleSlug}`;
  }

  return "/brindes-personalizados";
};

export const getProductBySlug = (slug: string) =>
  shopData.find((product) => product.slug === slug);

export const getMockRelatedProducts = (product: Product, limit = 4) =>
  shopData
    .filter((item) => item.id !== product.id && item.category === product.category)
    .concat(shopData.filter((item) => item.id !== product.id))
    .filter((item, index, items) => items.findIndex((entry) => entry.id === item.id) === index)
    .slice(0, limit);
