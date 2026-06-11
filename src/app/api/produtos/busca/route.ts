import { NextRequest, NextResponse } from "next/server";
import { productPath } from "@/lib/products";
import {
  friendlyParam,
  friendlyPersonalizedParam,
  searchProdutosSiteWithDestination,
} from "@/lib/api";
import { categoryPath, subcategoryPath } from "@/lib/seo";

const destinationPath = (
  destino: Awaited<ReturnType<typeof searchProdutosSiteWithDestination>>["destinoBusca"]
) => {
  if (!destino) {
    return null;
  }

  if (destino.tipo === "categoria" && destino.id_categoria) {
    const title = destino.categoria || "categoria";
    return categoryPath(destino.id_categoria, title);
  }

  if (destino.tipo === "tipo_produto" && destino.id_tipo_produto) {
    const title = destino.tipo_produto || "brindes";
    return `/brindes-para-empresas/${encodeURIComponent(
      /personalizad/i.test(title)
        ? friendlyParam(destino.id_tipo_produto, title)
        : friendlyPersonalizedParam(destino.id_tipo_produto, title)
    )}`;
  }

  if (destino.tipo === "subcategoria" && destino.id_subcategoria) {
    const title = destino.subcategoria || "brindes";
    return subcategoryPath(destino.id_subcategoria, title);
  }

  return destino.url_sugerida || null;
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  const limit = Number(request.nextUrl.searchParams.get("limit") || 10);
  const { products, destinoBusca, exactProduct, exactProductId, exactProductCode } =
    await searchProdutosSiteWithDestination(
    query,
    Number.isFinite(limit) ? limit : 10
  );
  const destinoPath = destinationPath(destinoBusca);
  const exactProductPath =
    exactProduct || exactProductId
      ? productPath(
          exactProduct || {
            id: exactProductId || undefined,
            title: exactProductCode || "produto",
          }
        )
      : null;
  const items = products.map((product) => ({
    id: product.id,
    title: product.title,
    codigo: product.codigo || String(product.id),
    label: `${product.title} - ${product.codigo || product.id}`,
    path: productPath(product),
  }));

  return NextResponse.json(
    {
      success: true,
      message: "Produtos encontrados com sucesso",
      destino_busca: exactProductPath
        ? {
            tipo: "produto",
            id_produto: exactProduct?.id || exactProductId,
            codigo: exactProduct?.codigo || exactProductCode,
            path: exactProductPath,
          }
        : destinoBusca
        ? {
            ...destinoBusca,
            path: destinoPath,
          }
        : null,
      data: {
        items,
        total: items.length,
        page: 1,
        limit,
        totalPages: items.length ? 1 : 0,
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=1800",
      },
    }
  );
}
