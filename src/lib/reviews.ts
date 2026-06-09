import { Product } from "@/types/product";

const MIN_REVIEW_COUNT = 143;
const MAX_REVIEW_COUNT = 15600;

const hashProductSeed = (product: Pick<Product, "id" | "slug" | "title">) => {
  const seed = `${product.id}-${product.slug}-${product.title}`;
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return hash;
};

export const productReviewCount = (product: Pick<Product, "id" | "slug" | "title">) => {
  const range = MAX_REVIEW_COUNT - MIN_REVIEW_COUNT + 1;

  return MIN_REVIEW_COUNT + (hashProductSeed(product) % range);
};

export const formatReviewCount = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }

  return String(value);
};
