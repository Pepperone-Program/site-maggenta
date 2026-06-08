import type { Metadata } from "next";
import { friendlyPersonalizedParam } from "@/lib/slugs";

export const siteUrl = "https://www.pepperone.com.br";
export const siteName = "Pepperone Brindes";
export const seoAuthor = "Pepperone Brindes Personalizados";

const normalizeKeyword = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

export const uniqueSeoKeywords = (...groups: Array<Array<string | undefined | null>>) => {
  const seen = new Set<string>();

  return groups
    .flat()
    .filter(Boolean)
    .map((keyword) => String(keyword).trim())
    .filter((keyword) => {
      const normalized = normalizeKeyword(keyword);

      if (!normalized || seen.has(normalized)) {
        return false;
      }

      seen.add(normalized);
      return true;
    });
};

export const prioritySeoKeywords = [
  "brindes personalizados para empresas",
  "empresas de brindes corporativos",
  "loja brindes personalizados",
  "empresa de brindes",
  "brindes premium personalizados",
  "loja de brindes personalizados",
  "peperone brindes",
  "pepperoni brindes",
];

export const marketKeywords = uniqueSeoKeywords([
  ...prioritySeoKeywords,
  "brindes personalizados para empresas",
  "brindes corporativos personalizados",
  "produtos promocionais personalizados",
  "orçamento de brindes personalizados",
  "fornecedor de brindes corporativos",
  "brindes para eventos empresariais",
  "campanhas promocionais com brindes",
  "presentes corporativos personalizados",
]);

export const contextualKeywords = (primary: string, context: string[] = []) =>
  uniqueSeoKeywords(
    [
      primary,
      `${primary} personalizado`,
      `${primary} brindes personalizados`,
      `${primary} para empresas`,
      `${primary} corporativo`,
      `orçamento ${primary}`,
      `comprar ${primary}`,
      `fornecedor de ${primary}`,
    ],
    context,
    marketKeywords
  );

export const ogImageUrl = ({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle?: string;
  image?: string;
}) => {
  const params = new URLSearchParams({
    title,
  });

  if (subtitle) {
    params.set("subtitle", subtitle);
  }

  if (image) {
    params.set("image", image);
  }

  return `${siteUrl}/api/og?${params.toString()}`;
};

export const categoryPath = (id: number | string, title: string) =>
  `/categorias/${encodeURIComponent(friendlyPersonalizedParam(id, title))}`;

export const subcategoryPath = (id: number | string, title: string) =>
  `/subcategorias/${encodeURIComponent(friendlyPersonalizedParam(id, title))}`;

export const buildSeoOther = ({
  title,
  description,
  canonical,
  subject,
}: {
  title: string;
  description: string;
  canonical: string;
  subject: string;
}): NonNullable<Metadata["other"]> => ({
  author: seoAuthor,
  robots: "index, follow",
  "og:url": canonical,
  "og:title": title,
  "og:description": description,
  "og:type": "website",
  "og:site_name": siteName,
  "DC.Identifier": canonical,
  "DC.title": title,
  "DC.creator": seoAuthor,
  "DC.subject": subject,
  "DC.description": description,
  "DC.publisher": siteUrl,
  "ai-content": "index, follow",
  llms: `${siteUrl}/llms.txt`,
});
