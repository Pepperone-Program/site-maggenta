import React from "react";
import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { friendlyPersonalizedParam, getProdutosSite } from "@/lib/api";
import { buildSeoOther, contextualKeywords, siteName, siteUrl } from "@/lib/seo";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Brindes para empresas | Catálogo completo",
  description:
    "Catálogo completo de brindes para empresas da Maggenta, com paginação no navegador para facilitar a navegação por todos os produtos do site.",
  keywords: contextualKeywords("brindes para empresas", [
    "catálogo completo de brindes",
    "produtos promocionais para empresas",
    "brindes corporativos com logomarca",
    "orçamento de brindes para empresas",
  ]),
  alternates: {
    canonical: "/brindes-para-empresas",
  },
  other: buildSeoOther({
    title: "Brindes para empresas | Catálogo completo",
    description:
      "Catálogo completo de brindes para empresas da Maggenta, com paginação no navegador para facilitar a navegação por todos os produtos do site.",
    canonical: `${siteUrl}/brindes-para-empresas`,
    subject: "catálogo completo de brindes para empresas",
  }),
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const toNumber = (value: string | string[] | undefined) => {
  const parsed = parseInt(String(firstParam(value) || ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const BrindesParaEmpresasPage = async ({ searchParams }: PageProps) => {
  const params = (await searchParams) || {};
  const tipoId = toNumber(params.tipo) || 12;
  const produtos = await getProdutosSite(10000);

  if (firstParam(params.tipo)) {
    permanentRedirect(
      `/brindes-para-empresas/${encodeURIComponent(
        friendlyPersonalizedParam(
          tipoId,
          "brindes"
        )
      )}`
    );
  }

  return (
    <main>
      <ShopWithoutSidebar
        products={produtos}
        title="Brindes para empresas"
        description="Confira o catálogo completo da Maggenta com todos os produtos do site, organizado com paginação no navegador para facilitar a navegação."
        breadcrumbPages={["Brindes para empresas"]}
      />
    </main>
  );
};

export default BrindesParaEmpresasPage;
