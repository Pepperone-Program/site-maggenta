import React from "react";
import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { friendlyPersonalizedParam, getProdutosSitePaginated } from "@/lib/api";
import { buildSeoOther, contextualKeywords, siteName, siteUrl } from "@/lib/seo";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Brindes para empresas | Catálogo completo",
  description:
    "Catálogo completo de brindes para empresas da Maggenta, com produtos promocionais para empresas e eventos.",
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
      "Catálogo completo de brindes para empresas da Maggenta, com produtos promocionais para empresas e eventos.",
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
  const page = toNumber(params.page) || 1;
  const limit = toNumber(params.limit) || 24;
  const catalogo = await getProdutosSitePaginated({ page, limit });

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
        products={catalogo.items}
        title="Brindes para empresas"
        description="Confira o catálogo completo da Maggenta com produtos promocionais para empresas, eventos e campanhas de relacionamento."
        breadcrumbPages={["Brindes para empresas"]}
        total={catalogo.total}
        page={catalogo.page}
        limit={catalogo.limit}
        totalPages={catalogo.totalPages}
        basePath="/brindes-para-empresas"
      />
    </main>
  );
};

export default BrindesParaEmpresasPage;
