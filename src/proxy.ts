import { NextResponse, type NextRequest } from "next/server";

const canonicalHost = "www.pepperone.com.br";
const legacyAssetPrefixes = [
  "/content/stream/",
  "/static/uploads/",
  "/upload/media/video/",
  "/assets/video/",
];

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  const homeUrl = new URL("/", request.url);

  if (
    request.nextUrl.hostname === "pepperone.com.br" ||
    request.nextUrl.hostname === "site-peppeerone.vercel.app"
  ) {
    url.hostname = canonicalHost;
    url.protocol = "https";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/home") {
    return NextResponse.redirect(homeUrl, 308);
  }

  if (
    pathname === "/categorias/[slug]" ||
    pathname === "/subcategorias/[slug]" ||
    pathname === "/brindes-personalizados/[slug]" ||
    pathname === "/brindes-para-empresas/[slug]"
  ) {
    return NextResponse.redirect(homeUrl, 308);
  }

  if (pathname.startsWith("/index.php/brindes-personalizados/")) {
    url.pathname = pathname.replace(
      "/index.php/brindes-personalizados/",
      "/brindes-personalizados/"
    );
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/orcamento.php") {
    url.pathname = "/orcamentos";
    return NextResponse.redirect(url, 308);
  }

  if (
    pathname === "/cdn-cgi/l/email-protection" ||
    legacyAssetPrefixes.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.redirect(homeUrl, 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/).*)",
  ],
};
