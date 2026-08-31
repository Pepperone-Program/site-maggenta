import { NextRequest, NextResponse } from "next/server";
import {
  getCatalogoCategoria,
  getCatalogoTipoProduto,
  getConfiguredApiOrigin,
  getProdutosSitePaginated,
  searchProdutosSiteCatalogo,
} from "@/lib/api";

const number = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const kind = params.get("kind") || "category";
    const page = number(params.get("page"), 1);
    const limit = Math.min(number(params.get("limit"), 36), 48);
    let catalog;

    if (kind === "products") {
      catalog = await getProdutosSitePaginated({ page, limit });
    } else if (kind === "type") {
      catalog = await getCatalogoTipoProduto(number(params.get("id"), 0), { page, limit });
    } else if (kind === "search") {
      catalog = await searchProdutosSiteCatalogo(params.get("q") || "", { page, limit });
    } else {
      catalog = await getCatalogoCategoria(number(params.get("categoria"), 1), {
        empresaId: 1,
        page,
        limit,
        subcategorias: params.get("subcategorias") || undefined,
        publicos_alvos: params.get("publicos_alvos") || undefined,
        quantidade_minima_min: number(params.get("quantidade_minima_min"), 0) || undefined,
        quantidade_minima_max: number(params.get("quantidade_minima_max"), 0) || undefined,
        data_promocional: params.get("data_promocional") || undefined,
        datas_promocionais: params.get("datas_promocionais") || undefined,
      });
    }

    return NextResponse.json(
      {
        items: catalog.items,
        total: catalog.total,
        page: catalog.page,
        totalPages: catalog.totalPages,
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "X-Maggenta-Data-Source": getConfiguredApiOrigin(),
        },
      }
    );
  } catch (error) {
    console.error("[api/produtos/catalogo] Falha ao consultar NEXT_API_URL.", {
      message: error instanceof Error ? error.message : "falha desconhecida",
    });

    return NextResponse.json(
      { success: false, message: "Catálogo temporariamente indisponível." },
      {
        status: 502,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": "5",
          "X-Maggenta-Data-Source": getConfiguredApiOrigin(),
        },
      }
    );
  }
}
