import type { HeaderMenuItem } from "../types/header-menu";

type RankedProduct = {
  id_produto: number;
  id_categoria?: number | null;
  site?: string | null;
  habilitado?: string | null;
  categorias?: { id_categoria: number }[];
};

/** Products must arrive in the authoritative ranking order. */
export function selectFeaturedCategories(categories: HeaderMenuItem[], products: RankedProduct[]) {
  const selected: { id: string; productId: number }[] = [];
  const ordered = [...categories].sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
  for (const product of products) {
    if (product.site !== "S" || product.habilitado === "N") continue;
    const main = categories.find((category) => category.id === String(product.id_categoria));
    const category = main || ordered.find((category) => product.categorias?.some((item) => String(item.id_categoria) === category.id));
    if (!category || selected.some((item) => item.id === category.id)) continue;
    selected.push({ id: category.id, productId: product.id_produto });
    if (selected.length === 5) break;
  }
  return selected;
}
