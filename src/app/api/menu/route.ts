import { NextResponse } from "next/server";
import { getMenuGroups } from "@/lib/api";

export const revalidate = 300;

export async function GET() {
  const menu = await getMenuGroups();
  return NextResponse.json(
    { success: true, data: menu },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=1800",
      },
    }
  );
}
