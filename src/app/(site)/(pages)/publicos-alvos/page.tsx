import React from "react";
import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import {
  friendlyParam,
  getCatalogoPublicoAlvo,
  getCatalogoCategorias,
  getDatasPromocionais,
  getPublicosAlvos,
} from "@/lib/api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Brindes por Público Alvo",
  alternates: {
    canonical: "/publicos-alvos",
  },
  description:
    "Brindes personalizados filtrados por público-alvo. Encontre o presente corporativo ideal para seu cliente.",
};

type PublicosAlvosPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const toNumber = (value: string | string[] | undefined) => {
  const parsed = parseInt(String(firstParam(value) || ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const PublicosAlvosPage = async ({ searchParams }: PublicosAlvosPageProps) => {
  const params = (await searchParams) || {};
  const publicoAlvoId = toNumber(params.publico_alvo) || 1;
  const [catalogo, categorias, publicosAlvos, datasPromocionais] = await Promise.all([
    getCatalogoPublicoAlvo(publicoAlvoId, {
      empresaId: 1,
      page: toNumber(params.page) || 1,
      limit: toNumber(params.limit) || 100,
      publicos_alvos: firstParam(params.publicos_alvos) || String(publicoAlvoId),
      datas_promocionais: firstParam(params.datas_promocionais),
      subcategorias: firstParam(params.subcategorias),
      quantidade_minima_min: toNumber(params.quantidade_minima_min),
      quantidade_minima_max: toNumber(params.quantidade_minima_max),
    }),
    getCatalogoCategorias(),
    getPublicosAlvos(),
    getDatasPromocionais(),
  ]);

  const publicoAlvo = publicosAlvos.find((p) => p.id === publicoAlvoId);
  const pageTitle = `Brindes para ${publicoAlvo?.title || "Público Alvo"}`;

  if (firstParam(params.publico_alvo)) {
    const redirectParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      const firstValue = firstParam(value);
      if (key !== "publico_alvo" && firstValue) {
        redirectParams.set(key, firstValue);
      }
    });
    const query = redirectParams.toString();
    permanentRedirect(
      `/publicos-alvos/${encodeURIComponent(
        friendlyParam(publicoAlvoId, publicoAlvo?.title || "publico-alvo")
      )}${query ? `?${query}` : ""}`
    );
  }

  return (
    <main>
      <ShopWithSidebar
        catalogo={catalogo}
        activeFilters={{
          categoria: "1",
          publico_alvo: String(publicoAlvoId),
          subcategorias: firstParam(params.subcategorias) || "",
          publicos_alvos: firstParam(params.publicos_alvos) || String(publicoAlvoId),
          quantidade_minima_min: firstParam(params.quantidade_minima_min) || "",
          quantidade_minima_max: firstParam(params.quantidade_minima_max) || "",
          datas_promocionais: firstParam(params.datas_promocionais) || "",
          limit: firstParam(params.limit) || "100",
        }}
        categoryOptions={categorias}
        publicOptions={publicosAlvos}
        dateOptions={datasPromocionais}
        pageTitle={pageTitle}
        basePath="/publicos-alvos"
      />
    </main>
  );
};

export default PublicosAlvosPage;
