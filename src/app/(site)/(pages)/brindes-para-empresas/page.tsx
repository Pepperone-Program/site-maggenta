import React from "react";
import { Metadata } from "next";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { getCatalogoTipoProduto } from "@/lib/api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Brindes para empresas | Pepperone",
  description:
    "Conheca brindes para empresas e produtos promocionais personalizados para a sua marca.",
  alternates: {
    canonical: "/brindes-para-empresas",
  },
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

  return (
    <main>
      <ShopWithoutSidebar
        products={catalogo.items}
        title={catalogo.tipo_produto?.tipo_produto || "Brindes para empresas"}
        description={catalogo.tipo_produto?.descricao || ""}
      />
    </main>
  );
};

export default BrindesParaEmpresasPage;
