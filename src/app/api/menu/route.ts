import { NextResponse } from "next/server";
import { getMenuGroups } from "@/lib/api";

export async function GET() {
  const menu = await getMenuGroups();
  return NextResponse.json(
    { success: true, data: menu },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    }
  );
}
