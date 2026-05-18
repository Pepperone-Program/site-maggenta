import { NextRequest, NextResponse } from "next/server";
import { productPath } from "@/lib/products";
import { friendlyParam, searchProdutosSiteWithDestination } from "@/lib/api";

const suffixIfNeeded = (title: string, suffix: string) =>
  /personalizad/i.test(title) ? "" : suffix;

const destinationPath = (
  destino: Awaited<ReturnType<typeof searchProdutosSiteWithDestination>>["destinoBusca"]
) => {
  if (!destino) {
    return null;
  }

  if (destino.tipo === "categoria" && destino.id_categoria) {
    const title = destino.categoria || "categoria";
    return `/categorias/${encodeURIComponent(
      friendlyParam(destino.id_categoria, title, suffixIfNeeded(title, "personalizados"))
    )}`;
  }

  if (destino.tipo === "tipo_produto" && destino.id_tipo_produto) {
    const title = destino.tipo_produto || "brindes";
    return `/brindes-para-empresas/${encodeURIComponent(
      friendlyParam(destino.id_tipo_produto, title, suffixIfNeeded(title, "personalizadas"))
    )}`;
  }

  return destino.url_sugerida || null;
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  const limit = Number(request.nextUrl.searchParams.get("limit") || 10);
  const { products, destinoBusca } = await searchProdutosSiteWithDestination(
    query,
    Number.isFinite(limit) ? limit : 10
  );
  const destinoPath = destinationPath(destinoBusca);

  if (products.length === 0 && !destinoPath) {
    return NextResponse.json(
      { success: false, message: "Nenhum produto encontrado", data: [] },
      {
        status: 404,
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=1800",
        },
      }
    );
  }

  return NextResponse.json(
    {
      success: true,
      destino_busca: destinoBusca
        ? {
            ...destinoBusca,
            path: destinoPath,
          }
        : null,
      data: products.map((product) => ({
        id: product.id,
        title: product.title,
        codigo: product.codigo || String(product.id),
        label: `${product.title} - ${product.codigo || product.id}`,
        path: productPath(product),
      })),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=1800",
      },
    }
  );
}
