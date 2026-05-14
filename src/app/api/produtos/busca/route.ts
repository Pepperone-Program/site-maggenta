import { NextRequest, NextResponse } from "next/server";
import { productPath } from "@/lib/products";
import { searchProdutosSite } from "@/lib/api";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  const limit = Number(request.nextUrl.searchParams.get("limit") || 10);
  const products = await searchProdutosSite(query, Number.isFinite(limit) ? limit : 10);

  if (products.length === 0) {
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
