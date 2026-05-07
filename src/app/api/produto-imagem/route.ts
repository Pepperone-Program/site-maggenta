import { NextRequest, NextResponse } from "next/server";
import { buildApiUrl } from "@/lib/api";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const filename = request.nextUrl.searchParams.get("filename");
  const folder = request.nextUrl.searchParams.get("folder") || "thumb";

  if (!id || !filename) {
    return new NextResponse("Imagem invalida", { status: 400 });
  }

  const url = buildApiUrl(
    `/produtos/${id}/images/${encodeURIComponent(filename)}/view?folder=${folder}`
  );
  const token = process.env.NEXT_API_TOKEN || process.env.API_TOKEN;

  if (!url) {
    return new NextResponse("API nao configurada", { status: 404 });
  }

  try {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return new NextResponse("Imagem nao encontrada", { status: 404 });
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Imagem indisponivel", { status: 404 });
  }
}
