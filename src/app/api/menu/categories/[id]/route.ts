import { NextResponse } from "next/server";
import { getMenuSubcategories } from "@/lib/api";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  try {
    return NextResponse.json({ success: true, data: await getMenuSubcategories(Number(id)) });
  } catch {
    return NextResponse.json({ success: false, message: "Subcategorias temporariamente indisponíveis." }, { status: 503 });
  }
}
