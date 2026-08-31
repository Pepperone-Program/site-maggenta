import { NextResponse, type NextRequest } from "next/server";
import { friendlyParam, friendlyPersonalizedParam } from "@/lib/slugs";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.maggenta.com.br").replace(/\/$/, "");
const canonicalUrl = new URL(siteUrl);
const canonicalHost = canonicalUrl.hostname;
const apiOrigin = (process.env.NEXT_API_URL || "").replace(/\/$/, "");
const legacyAssetPrefixes = ["/content/stream/", "/static/uploads/", "/upload/media/video/", "/assets/video/"];
const entityRoutes = [
  { prefix: "/categorias/", endpoint: "categorias", key: "categoria", title: "categoria", personalized: true },
  { prefix: "/subcategorias/", endpoint: "subcategorias", key: "subcategoria", title: "subcategoria", personalized: true },
  { prefix: "/brindes-para-empresas/", endpoint: "tipos-produtos", key: "tipo_produto", title: "tipo_produto", personalized: true },
  { prefix: "/publicos-alvos/", endpoint: "publicos-alvos", key: "publico_alvo", title: "publico_alvo", personalized: false },
  { prefix: "/datas-promocionais/", endpoint: "datas-promocionais", key: "data_promocional", title: "data_promocional", personalized: false },
] as const;
const canonicalEntityCache = new Map<string, { slug: string; expiresAt: number }>();
const entityCacheTtlMs = 5 * 60 * 1000;

const getCachedCanonicalSlug = (key: string) => {
  const cached = canonicalEntityCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt <= Date.now()) {
    canonicalEntityCache.delete(key);
    return null;
  }
  return cached.slug;
};

const cacheCanonicalSlug = (key: string, slug: string) => {
  if (canonicalEntityCache.size >= 5_000) {
    const oldestKey = canonicalEntityCache.keys().next().value;
    if (oldestKey) canonicalEntityCache.delete(oldestKey);
  }
  canonicalEntityCache.set(key, { slug, expiresAt: Date.now() + entityCacheTtlMs });
};

const notFoundRewrite = (request: NextRequest) =>
  NextResponse.rewrite(new URL("/404", request.url), { status: 404 });

const unwrapData = (payload: unknown) => {
  if (!payload || typeof payload !== "object") return null;
  const envelope = payload as Record<string, unknown>;
  const data = envelope.data && typeof envelope.data === "object"
    ? envelope.data as Record<string, unknown>
    : envelope;
  return data.item && typeof data.item === "object"
    ? data.item as Record<string, unknown>
    : data;
};

const validateEntityRoute = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const productPrefix = "/brindes-personalizados/";

  if (pathname.startsWith(productPrefix)) {
    const slug = decodeURIComponent(pathname.slice(productPrefix.length));
    const id = Number(slug.match(/^(\d+)(?:-|$)/)?.[1] || slug.match(/-(\d+)$/)?.[1]);
    if (!id) return notFoundRewrite(request);
    if (!apiOrigin) return null;
    const cacheKey = `produto:${id}`;
    const cachedSlug = getCachedCanonicalSlug(cacheKey);
    if (cachedSlug) {
      if (slug === cachedSlug) return null;
      const url = request.nextUrl.clone();
      url.pathname = `${productPrefix}${cachedSlug}`;
      return NextResponse.redirect(url, 308);
    }

    try {
      const response = await fetch(`${apiOrigin}/api/v1/produtos/${id}`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(12_000),
      });
      if (response.status === 404) return notFoundRewrite(request);
      if (!response.ok) return null;
      const product = unwrapData(await response.json());
      if (!product?.id_produto || !product.produto) return notFoundRewrite(request);
      const canonicalSlug = friendlyParam(Number(product.id_produto), String(product.produto));
      cacheCanonicalSlug(cacheKey, canonicalSlug);
      if (slug !== canonicalSlug) {
        const url = request.nextUrl.clone();
        url.pathname = `${productPrefix}${canonicalSlug}`;
        return NextResponse.redirect(url, 308);
      }
    } catch {
      return null;
    }

    return null;
  }

  const route = entityRoutes.find(({ prefix }) => pathname.startsWith(prefix));
  if (!route) return null;
  const slug = decodeURIComponent(pathname.slice(route.prefix.length));
  const id = Number(slug.match(/^(\d+)(?:-|$)/)?.[1]);
  if (!id) return notFoundRewrite(request);
  if (!apiOrigin) return null;
  const cacheKey = `${route.endpoint}:${id}`;
  const cachedSlug = getCachedCanonicalSlug(cacheKey);
  if (cachedSlug) {
    if (slug === cachedSlug) return null;
    const url = request.nextUrl.clone();
    url.pathname = `${route.prefix}${cachedSlug}`;
    return NextResponse.redirect(url, 308);
  }

  try {
    const response = await fetch(
      `${apiOrigin}/api/v1/${route.endpoint}/${id}/catalogo?empresaId=1&page=1&limit=1`,
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(12_000) }
    );
    if (response.status === 404) return notFoundRewrite(request);
    if (!response.ok) return null;
    const data = unwrapData(await response.json());
    const entity = data?.[route.key];
    if (!entity || typeof entity !== "object") return notFoundRewrite(request);
    const title = String((entity as Record<string, unknown>)[route.title] || "").trim();
    if (!title) return notFoundRewrite(request);
    const canonicalSlug = route.personalized
      ? friendlyPersonalizedParam(id, title)
      : friendlyParam(id, title);
    cacheCanonicalSlug(cacheKey, canonicalSlug);
    if (slug !== canonicalSlug) {
      const url = request.nextUrl.clone();
      url.pathname = `${route.prefix}${canonicalSlug}`;
      return NextResponse.redirect(url, 308);
    }
  } catch {
    return null;
  }

  return null;
};

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  const homeUrl = new URL("/", request.url);

  if (request.nextUrl.hostname === "maggenta.com.br") {
    url.hostname = canonicalHost;
    url.protocol = canonicalUrl.protocol.replace(":", "");
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/home") {
    return NextResponse.redirect(homeUrl, 308);
  }

  const entityResponse = await validateEntityRoute(request);
  if (entityResponse) return entityResponse;

  if (
    pathname === "/categorias/[slug]" ||
    pathname === "/subcategorias/[slug]" ||
    pathname === "/brindes-personalizados/[slug]" ||
    pathname === "/brindes-para-empresas/[slug]"
  ) {
    return NextResponse.redirect(homeUrl, 308);
  }

  if (pathname.startsWith("/index.php/brindes-personalizados/")) {
    url.pathname = pathname.replace("/index.php/brindes-personalizados/", "/brindes-personalizados/");
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/).*)"],
};
