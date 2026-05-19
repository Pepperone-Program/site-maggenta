import React from "react";
import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import {
  friendlyPersonalizedParam,
  getCatalogoTipoProduto,
} from "@/lib/api";
import { buildSeoOther, contextualKeywords, siteUrl } from "@/lib/seo";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Brindes para empresas",
  description:
    "Brindes para Empresas, Querendo comprar produtos promocionais personalizados? É aqui na Pepperone Brindes",
  keywords: contextualKeywords("brindes para empresas", [
    "produtos promocionais para empresas",
    "brindes corporativos com logomarca",
    "orçamento de brindes para empresas",
  ]),
  alternates: {
    canonical: "/brindes-para-empresas",
  },
  other: buildSeoOther({
    title: "Brindes para empresas",
    description:
      "Brindes para Empresas, Querendo comprar produtos promocionais personalizados? É aqui na Pepperone Brindes",
    canonical: `${siteUrl}/brindes-para-empresas`,
    subject: "brindes para empresas e produtos promocionais",
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
  const catalogo = await getCatalogoTipoProduto(tipoId);

  if (firstParam(params.tipo)) {
    permanentRedirect(
      `/brindes-para-empresas/${encodeURIComponent(
        friendlyPersonalizedParam(
          tipoId,
          catalogo.tipo_produto?.tipo_produto || "brindes"
        )
      )}`
    );
  }

  return (
    <main>
      <ShopWithoutSidebar
        products={catalogo.items}
        title="Brindes para empresas"
        description={catalogo.tipo_produto?.descricao || ""}
      />
    </main>
  );
};

export default BrindesParaEmpresasPage;
