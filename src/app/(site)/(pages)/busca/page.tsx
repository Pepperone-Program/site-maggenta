import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import {
  friendlyParam,
  friendlyPersonalizedParam,
  searchProdutosSiteWithDestination,
} from "@/lib/api";
import { productPath } from "@/lib/products";
import { categoryPath, noIndexRobots, subcategoryPath } from "@/lib/seo";

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
  const term = searchTerm(params);

  return {
    title: term ? `Resultados para ${term}` : "Buscar brindes personalizados",
    description: term
      ? `Veja os produtos encontrados para ${term} e solicite um orçamento personalizado.`
      : "Busque produtos por nome ou código no catálogo de brindes personalizados da Maggenta.",
    robots: noIndexRobots,
  };
}

const officialDestinationPath = (
  result: Awaited<ReturnType<typeof searchProdutosSiteWithDestination>>
) => {
  if (result.exactProduct) return productPath(result.exactProduct);
  if (result.exactProductId) {
    return productPath({
      id: result.exactProductId,
      title: result.exactProductCode || "produto",
    });
  }

  const destination = result.destinoBusca;
  if (!destination) return null;

  if (destination.tipo === "categoria" && destination.id_categoria) {
    return categoryPath(destination.id_categoria, destination.categoria || "categoria");
  }
  if (destination.tipo === "subcategoria" && destination.id_subcategoria) {
    return subcategoryPath(
      destination.id_subcategoria,
      destination.subcategoria || "subcategoria"
    );
  }
  if (destination.tipo === "tipo_produto" && destination.id_tipo_produto) {
    const title = destination.tipo_produto || "brindes";
    return `/brindes-para-empresas/${encodeURIComponent(
      /personalizad/i.test(title)
        ? friendlyParam(destination.id_tipo_produto, title)
        : friendlyPersonalizedParam(destination.id_tipo_produto, title)
    )}`;
  }

  return null;
};

export default async function BuscaPage({ searchParams }: SearchPageProps) {
  const params = (await searchParams) || {};
  const term = searchTerm(params);
  if (!term) redirect("/brindes-personalizados");

  const page = Math.max(1, Number(firstParam(params.page) || 1));
  const limit = Math.min(48, Math.max(1, Number(firstParam(params.limit) || 24)));
  const result = await searchProdutosSiteWithDestination(term, limit, page);
  const destination = officialDestinationPath(result);
  if (destination) redirect(destination);

  return (
    <main>
      <ShopWithoutSidebar
        products={result.products}
        title={`Resultados para “${term}”`}
        description={
          result.total > 0
            ? `${result.total} produto${result.total === 1 ? "" : "s"} encontrado${
                result.total === 1 ? "" : "s"
              } para sua busca.`
            : "Nenhum produto foi encontrado. Tente outro nome, categoria ou código."
        }
        breadcrumbPages={["Busca"]}
        total={result.total}
        page={result.page}
        limit={result.limit}
        totalPages={result.totalPages}
        basePath={`/busca?q=${encodeURIComponent(term)}`}
        loadMoreUrl={`/api/produtos/catalogo?kind=search&q=${encodeURIComponent(
          term
        )}&limit=${result.limit}`}
      />
    </main>
  );
}
