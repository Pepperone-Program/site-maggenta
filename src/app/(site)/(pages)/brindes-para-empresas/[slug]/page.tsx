import React from "react";
import { Metadata } from "next";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { getCatalogoTipoProduto } from "@/lib/api";

export const revalidate = 120;

type PageProps = {
  params?: Promise<{ slug?: string }>;
};

const siteUrl = "https://www.pepperone.com.br";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const routeParams = (await params) || {};
  const slug = routeParams.slug || "";

  return {
    title: "Brindes para empresas personalizados",
    description:
      "Conheca tipos de produtos personalizados para empresas, eventos, campanhas e acoes promocionais.",
    alternates: {
      canonical: new URL(`/brindes-para-empresas/${slug}`, siteUrl).toString(),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

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
