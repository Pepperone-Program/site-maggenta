import { NextResponse } from "next/server";
import { buildApiUrl } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { success: false, message: "Informe um email valido." },
      { status: 400 }
    );
  }

  const url = buildApiUrl("/newsletter");

  if (!url) {
    return NextResponse.json(
      { success: false, message: "API de newsletter nao configurada." },
      { status: 500 }
    );
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const payload = await response.json().catch(() => null);

  return NextResponse.json(payload || { success: response.ok }, {
    status: response.ok ? 200 : response.status,
  });
}
