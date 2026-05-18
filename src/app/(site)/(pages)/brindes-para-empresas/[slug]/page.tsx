import React from "react";
import { Metadata } from "next";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { getCatalogoTipoProduto } from "@/lib/api";
import { buildSeoOther, contextualKeywords, siteName, siteUrl } from "@/lib/seo";

export const revalidate = 120;

type PageProps = {
  params?: Promise<{ slug?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const routeParams = (await params) || {};
  const slug = routeParams.slug || "";
  const tipoId = toNumber(slug) || 12;
  const catalogo = await getCatalogoTipoProduto(tipoId);
  const tipoName = catalogo.tipo_produto?.tipo_produto || "Brindes para empresas";
  const title = `${tipoName} Personalizados para Empresas e Eventos`;
  const description = `${tipoName}, Querendo comprar Brindes Personalizados? É aqui na Pepperone Brindes`;
  const canonical = new URL(`/brindes-para-empresas/${slug}`, siteUrl).toString();

  return {
    title,
    description,
    keywords: contextualKeywords(tipoName, [
      `${tipoName} personalizado para empresa`,
      `${tipoName} promocional`,
      `${tipoName} com logomarca`,
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
      subject: `${tipoName}, tipos de produtos personalizados`,
    }),
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
