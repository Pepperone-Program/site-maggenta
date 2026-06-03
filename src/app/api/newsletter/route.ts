import { NextResponse } from "next/server";
import { buildApiUrl } from "@/lib/api";
import { fetchWithTimeout, isRequestTimeoutError } from "@/lib/timed-fetch";

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

  try {
    const response = await fetchWithTimeout(url, {
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
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: isRequestTimeoutError(error)
          ? "A API demorou para responder. Tente novamente em alguns instantes."
          : "Nao foi possivel cadastrar seu email.",
      },
      { status: 504 }
    );
  }
}
