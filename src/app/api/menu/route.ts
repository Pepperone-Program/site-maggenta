import { NextResponse } from "next/server";
import { getMenuGroups } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const menu = await getMenuGroups();
    return NextResponse.json(
      { success: true, data: menu },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=1800",
        },
      }
    );
  } catch (error) {
    console.error("[api/menu] Nao foi possivel carregar o menu da API.", {
      message: error instanceof Error ? error.message : "falha desconhecida",
    });

    return NextResponse.json(
      {
        success: false,
        message: "Menu temporariamente indisponivel.",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": "5",
        },
      }
    );
  }
}
