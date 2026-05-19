import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildSeoOther, contextualKeywords, siteName, siteUrl } from "@/lib/seo";
import { personalizedSuffix, slugify } from "@/lib/api";

export const revalidate = 120;

type SearchPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const searchTerm = (params: Record<string, string | string[] | undefined>) =>
  (firstParam(params.q) || firstParam(params.busca) || "").trim();

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = (await searchParams) || {};
  const term = searchTerm(params) || "Busca";
  const title = `${term} Brindes Personalizados`;
  const description = `${term}, veja produtos encontrados pelo nome e solicite orçamento de brindes personalizados na Pepperone Brindes.`;
  const canonical = new URL(`/busca?q=${encodeURIComponent(term)}`, siteUrl).toString();

  return {
    title,
    description,
    keywords: contextualKeywords(term, [
      `${term} personalizado`,
      `${term} brindes para empresas`,
      `${term} orçamento`,
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
      subject: `${term}, busca de produtos personalizados`,
    }),
  };
}

const BuscaPage = async ({ searchParams }: SearchPageProps) => {
  const params = (await searchParams) || {};
  const term = searchTerm(params);

  redirect(
    term
      ? `/brindes-para-empresas/${slugify(`${term} ${personalizedSuffix(term)}`)}`
      : "/brindes-para-empresas"
  );
};

export default BuscaPage;
