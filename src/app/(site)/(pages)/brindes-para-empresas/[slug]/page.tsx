import React from "react";
import { Metadata } from "next";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { getCatalogoTipoProduto } from "@/lib/api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Brindes para empresas personalizados | Pepperone",
  description:
    "Conheca tipos de produtos personalizados para empresas, eventos, campanhas e acoes promocionais.",
};

type PageProps = {
  params?: Promise<{ slug?: string }>;
};

const toNumber = (value: string | undefined) => {
  const parsed = parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const BrindesParaEmpresasTipoPage = async ({ params }: PageProps) => {
  const routeParams = (await params) || {};
  const tipoId = toNumber(routeParams.slug) || 12;
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

export default BrindesParaEmpresasTipoPage;
