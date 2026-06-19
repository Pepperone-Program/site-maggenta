import { NextResponse } from "next/server";
import { getMenuGroups } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const menu = await getMenuGroups();
  return NextResponse.json(
    { success: true, data: menu },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
