import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), "utf8");
const failures = [];

const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const files = {
  product: await read("src/app/(site)/(pages)/brindes-personalizados/[slug]/page.tsx"),
  category: await read("src/app/(site)/(pages)/categorias/[slug]/page.tsx"),
  subcategory: await read("src/app/(site)/(pages)/subcategorias/[slug]/page.tsx"),
  type: await read("src/app/(site)/(pages)/brindes-para-empresas/[slug]/page.tsx"),
  audience: await read("src/app/(site)/(pages)/publicos-alvos/[slug]/page.tsx"),
  date: await read("src/app/(site)/(pages)/datas-promocionais/[slug]/page.tsx"),
  search: await read("src/app/(site)/(pages)/busca/page.tsx"),
  notFound: await read("src/app/(site)/not-found.tsx"),
  sitemap: await read("src/app/sitemap.ts"),
  seo: await read("src/lib/seo.ts"),
  api: await read("src/lib/api.ts"),
  image: await read("src/components/Common/ImageWithFallback.tsx"),
  shop: await read("src/components/ShopWithoutSidebar/index.tsx"),
  shopFilters: await read("src/components/ShopWithSidebar/index.tsx"),
  pixels: await read("src/components/Common/MarketingPixels.tsx"),
  conversion: await read("src/lib/google-ads-conversion.ts"),
  proxy: await read("src/proxy.ts"),
  gridItem: await read("src/components/Shop/SingleGridItem.tsx"),
};

check(files.notFound.includes("Esta página não foi encontrada"), "A página 404 útil não foi implementada.");
check(!files.notFound.includes('redirect("/")'), "A página 404 ainda redireciona para a home.");
check(files.product.includes("notFound()"), "Produto inexistente não usa notFound().");
check(files.proxy.includes('new URL("/404", request.url), { status: 404 }'), "Entidades inválidas não recebem status HTTP 404 antes do streaming.");
check(files.proxy.includes("NextResponse.redirect(url, 308)"), "Slugs antigos não recebem redirect HTTP 308 antes do streaming.");
check(files.product.includes("permanentRedirect(productPath(product))"), "Slug antigo de produto não usa redirecionamento permanente.");
check(!files.product.includes('"@type": "Offer"'), "O Product JSON-LD ainda publica Offer sem preço público real.");
check(!files.product.includes('availability: "https://schema.org/InStock"'), "O Product JSON-LD ainda inventa estoque.");
check(!files.product.includes('price: product.discountedPrice'), "O Product JSON-LD ainda publica preço técnico.");
check(files.product.includes("categoryCanonical"), "O breadcrumb estruturado não inclui a categoria.");

for (const [name, source] of Object.entries({
  category: files.category,
  subcategory: files.subcategory,
  type: files.type,
  audience: files.audience,
  date: files.date,
})) {
  check(source.includes("notFound()"), `${name}: entidade inválida não retorna 404.`);
  check(source.includes("noIndexRobots"), `${name}: estado vazio/inválido não recebe noindex.`);
  check(source.includes("catalogRobots"), `${name}: filtros e paginação não usam a política central.`);
}

check(files.search.includes("robots: noIndexRobots"), "A busca interna não está marcada como noindex.");
check(files.search.includes("officialDestinationPath"), "A busca não restringe redirecionamentos a destinos oficiais.");
check(!files.search.includes("personalizedSuffix"), "A busca ainda fabrica páginas semânticas por termo livre.");
check(files.seo.includes("isCleanCatalogQuery"), "A política central de parâmetros indexáveis não existe.");

check(files.sitemap.includes("isIndexableLandingPage"), "O sitemap não valida conteúdo nativo das campanhas.");
check(files.sitemap.includes("categoryCatalogs"), "O sitemap não valida catálogos reais das taxonomias.");
check(files.sitemap.includes("Number(catalog?.total) > 0"), "O sitemap ainda permite taxonomias sem produtos.");
check(!files.sitemap.includes("changeFrequency"), "O sitemap ainda emite changefreq sem utilidade.");
check(!files.sitemap.includes("priority:"), "O sitemap ainda emite priority sem utilidade.");
check(!files.sitemap.includes("new Date() : date"), "O sitemap ainda fabrica lastmod atual.");

check(files.api.includes("emptyCatalogoProdutos"), "A API interna não distingue entidade ausente.");
check(!/if \(!data\) \{[\s\S]{0,200}getProdutos\(limit\)/.test(files.api), "Catálogo inválido ainda recebe produtos genéricos.");
check(files.api.includes("updatedAt: product.data_modificacao"), "A data real de modificação não é propagada.");

check(files.image.includes('from "next/image"'), "ImageWithFallback ainda não usa next/image.");
check(files.image.includes("sizes: props.sizes"), "ImageWithFallback não propaga sizes.");
check(files.image.includes("unoptimized: props.unoptimized"), "Hosts externos não possuem fallback explícito.");
check(files.gridItem.includes("priority={priority}"), "A imagem LCP inicial do catálogo não recebe prioridade.");
check(files.shop.includes("Próxima página"), "Listagens sem sidebar não possuem paginação rastreável.");
check(files.shopFilters.includes("Próxima página"), "Listagens com filtros não possuem paginação rastreável.");

check(!files.pixels.includes("universal-analytics"), "O Universal Analytics legado ainda é carregado.");
check(!files.pixels.includes("universalAnalyticsId"), "O ID do Universal Analytics ainda é configurado.");
check(files.conversion.includes('"generate_lead"'), "O orçamento concluído não registra generate_lead no GA4.");
check(files.conversion.includes("maggenta:ga4-lead"), "generate_lead não possui deduplicação por orçamento.");

if (failures.length) {
  console.error(`SEO contract failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("SEO contract passed: 404=true noindex=true canonicals=true curated_search=true truthful_schema=true sitemap_policy=true responsive_images=true crawlable_pagination=true ga4_lead=true");
