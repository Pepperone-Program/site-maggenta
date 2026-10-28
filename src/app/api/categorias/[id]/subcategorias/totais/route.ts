import { NextResponse } from "next/server";
import { getCategorySubcategoryTotals } from "@/lib/api";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  try {
    return NextResponse.json({ data: await getCategorySubcategoryTotals(Number(id)) }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ success: false, message: "Contagens temporariamente indisponíveis." }, {
      status: 503, headers: { "Cache-Control": "no-store" },
    });
  }
}
