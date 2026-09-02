import categoryData from "@/components/Home/Categories/categoryData";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { fetchWithTimeout } from "@/lib/timed-fetch";
import { isValidImageSrc, safeImageSrc } from "@/lib/images";
import {
  friendlyParam,
  friendlyPersonalizedParam,
  personalizedSuffix,
  personalizedTitle,
  slugify,
} from "@/lib/slugs";

export {
  friendlyParam,
  friendlyPersonalizedParam,
  personalizedSuffix,
  personalizedTitle,
  slugify,
};

type ApiFlag = "S" | "N" | string | null | undefined;

export type ProdutoApi = {
  id_empresa?: number;
  id_produto: number;
  id_tipo_produto?: number;
  produto: string;
  descricao?: string | null;
  codigo?: string | null;
  altura?: string | null;
  largura?: string | null;
  profundidade?: string | null;
  peso?: string | null;
  ncm?: string | null;
  quantidade_minima?: string | number | null;
  imagem?: string | null;
  imagem_url?: string | null;
  data_inclusao?: string | null;
  data_modificacao?: string | null;
  updated_at?: string | null;
  obs?: string | null;
  site?: ApiFlag;
  lancamento?: ApiFlag;
  promocao?: ApiFlag;
  premium?: ApiFlag;
  habilitado?: ApiFlag;
  cod_forn?: string | null;
  video?: string | null;
  imagens?: ProdutoImageApi[];
  id_categoria?: number | null;
  categoria?: string | null;
  categorias?: CatalogoCategoria[];
  subcategorias?: CatalogoSubcategoria[];
  publicos_alvos?: CatalogoPublicoAlvo[];
  datas_promocionais?: CatalogoDataPromocional[];
};

export type ProdutoRankingApi = {
  id_produto: number;
  codigo?: string | null;
  produto?: string | null;
  total_qtde?: number;
  total_registros?: number;
};

export type ApiMenuItem = {
  id: string;
  title: string;
  path: string;
};

export type ApiMenuGroup = {
  id: string;
  title: string;
  path?: string;
  items?: ApiMenuItem[];
};

export type BannerTipo = "home_mega" | "home_grande" | "banner_medio" | "mega_banner";

export type BannerApi = {
  id_empresa: number;
  id_banner: number;
  tipo: BannerTipo;
  titulo?: string | null;
  url?: string | null;
  id_tipo_produto?: number | null;
  data_inicial?: string | null;
  data_final?: string | null;
  ordem?: number | null;
  habilitado?: ApiFlag;
  cliques?: number | null;
  url_banner?: string | null;
  tamanho_tela?: "desktop" | "mobile" | string | null;
};

export type LandingPageApi = {
  id: number;
  title: string;
  slug?: string | null;
  description?: string | null;
  keywords: string;
  url: string;
  data_lp?: string | null;
};

export type LandingPage = LandingPageApi & {
  slug: string;
  path: string;
};

type BannersAtivosResponse = {
  items?: BannerApi[];
  grouped?: Partial<Record<BannerTipo | string, BannerApi[]>>;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

type ProdutoImageApi = {
  filename?: string;
  ordem?: number;
  ordem_imagem?: number;
  url?: string | null;
  url_imagem?: string | null;
  sources?: string[];
};

type PaginatedApiData<T> = {
  items: T[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

export type CatalogoCategoria = {
  id_empresa: number;
  id_categoria: number;
  categoria: string;
  descricao?: string | null;
  icon?: string | null;
  habilitado?: ApiFlag;
  url_capa?: string | null;
};

export type CatalogoSubcategoria = {
  id_empresa?: number;
  id_categoria?: number;
  id_subcategoria: number;
  subcategoria: string;
  descricao?: string | null;
  icon?: string | null;
  habilitado?: ApiFlag;
  ordem?: number | null;
  total?: number;
};

export type CatalogoPublicoAlvo = {
  id_publico_alvo: number;
  publico_alvo: string;
  total?: number;
};

export type CatalogoDataPromocional = {
  id_data_promocional: number;
  data_promocional: string;
  data?: string | null;
  total?: number;
};

export type CatalogoFiltros = {
  subcategorias: CatalogoSubcategoria[];
  publicos_alvos: CatalogoPublicoAlvo[];
  datas_promocionais: CatalogoDataPromocional[];
  quantidade_minima: {
    min: number;
    max: number;
  };
};

export type CatalogoProdutos = {
  categoria: CatalogoCategoria | null;
  parentCategoryId?: number;
  filtros: CatalogoFiltros;
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CatalogoProdutosQuery = {
  empresaId?: number;
  page?: number;
  limit?: number;
  subcategorias?: string;
  publicos_alvos?: string;
  quantidade_minima_min?: number;
  quantidade_minima_max?: number;
  data_promocional?: string;
  datas_promocionais?: string;
};

export type CatalogoTipoProduto = {
  tipo_produto: {
    id_empresa: number;
    id_tipo_produto: number;
    tipo_produto: string;
    descricao?: string | null;
    habilitado?: ApiFlag;
  } | null;
  parentCategoryId?: number;
  filtros: CatalogoFiltros;
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type CatalogoPublicoAlvoResponse = {
  publico_alvo?: {
    id_publico_alvo: number;
    publico_alvo: string;
    descricao?: string | null;
    ordem?: number | null;
    habilitado?: ApiFlag;
  } | null;
  filtros?: Partial<CatalogoFiltros>;
  items?: ProdutoApi[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

type CatalogoDataPromocionalResponse = {
  data_promocional?: {
    id_data_promocional: number;
    data_promocional: string;
    data?: string | null;
    descricao?: string | null;
    ordem?: number | null;
    habilitado?: ApiFlag;
  } | null;
  filtros?: Partial<CatalogoFiltros>;
  items?: ProdutoApi[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

export type CatalogoOption = {
  id: number;
  title: string;
};

export type SearchDestinationApi = {
  tipo?: "categoria" | "tipo_produto" | "subcategoria" | string | null;
  id_categoria?: number | null;
  id_subcategoria?: number | null;
  categoria?: string | null;
  subcategoria?: string | null;
  id_tipo_produto?: number | null;
  tipo_produto?: string | null;
  url_sugerida?: string | null;
};

export type SearchProdutosSiteResult = {
  products: Product[];
  destinoBusca: SearchDestinationApi | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  exactProduct?: Product | null;
  exactProductId?: number | null;
  exactProductCode?: string | null;
};

type SearchProdutosSiteApiData = {
  items?: ProdutoApi[];
  relatedItems?: ProdutoApi[];
  groups?: {
    primary?: ProdutoApi[];
    related?: ProdutoApi[];
  };
  total?: number;
  relatedTotal?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  nextCursor?: string | null;
  searchId?: string;
  rankingVersion?: string;
  mode?: "legacy" | "advanced";
  query?: string;
  destino_busca?: SearchDestinationApi | null;
  match_exato_codigo?: boolean;
  id_produto?: number;
  codigo?: string;
};

type DataPromocionalApi = {
  id_data_promocional: number;
  data_promocional: string;
  data?: string | null;
  descricao?: string | null;
  ordem?: number | null;
  habilitado?: ApiFlag;
};

const API_BASE_PATH = "/api/v1";
const categoryIcon = (index: number) =>
  categoryData[index % categoryData.length]?.img || "/images/categories/categories-01.png";

type TipoProdutoApi = {
  id_tipo_produto: number;
  tipo_produto: string;
  ordem?: number | null;
  habilitado?: ApiFlag;
};

type PublicoAlvoApi = {
  id_publico_alvo: number;
  publico_alvo: string;
  ordem?: number | null;
  habilitado?: ApiFlag;
};

const sortByOrderAndName = <T extends Record<string, unknown>>(
  titleKey: keyof T
) => (a: T, b: T) => {
  const orderA = Number(a.ordem ?? Number.MAX_SAFE_INTEGER);
  const orderB = Number(b.ordem ?? Number.MAX_SAFE_INTEGER);

  if (orderA !== orderB) {
    return orderA - orderB;
  }

  return String(a[titleKey]).localeCompare(String(b[titleKey]), "pt-BR", {
    sensitivity: "base",
  });
};

const isEnabled = (value?: ApiFlag) => !value || value === "S";
const isYes = (value?: ApiFlag) => value === "S" || value === "s";

const API_REQUEST_ATTEMPTS = 3;
const API_RETRY_DELAYS_MS = [250, 750];
const API_GET_TIMEOUT_MS = 12_000;
const API_WRITE_TIMEOUT_MS = 20_000;
const DEFAULT_API_WRITE_URL = "https://backend.maggenta.com.br";

class ApiRequestError extends Error {
  retryable: boolean;

  constructor(message: string, retryable = true) {
    super(message);
    this.name = "ApiRequestError";
    this.retryable = retryable;
  }
}

const apiRequestLabel = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.origin}${parsedUrl.pathname}`;
  } catch {
    return "API configurada";
  }
};

const waitForApiRetry = (delayMs: number) =>
  new Promise((resolve) => setTimeout(resolve, delayMs));

const normalizeApiBaseUrl = (value: string | undefined, fallback: string) => {
  const candidate = (value || "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\/$/, "");

  try {
    const url = new URL(candidate || fallback);
    if (url.protocol !== "https:" && url.protocol !== "http:") return fallback;
    url.pathname = url.pathname.replace(/\/api\/v1\/?$/, "") || "/";
    return url.toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
};

const apiBaseUrl = () =>
  normalizeApiBaseUrl(process.env.NEXT_API_URL, "");
export const getConfiguredApiOrigin = () => {
  const baseUrl = apiBaseUrl();
  return baseUrl ? new URL(baseUrl).origin : "unconfigured";
};
const apiWriteBaseUrl = () =>
  normalizeApiBaseUrl(process.env.NEXT_API_WRITE_URL, DEFAULT_API_WRITE_URL);
const landingPagesApiBaseUrl = () =>
  (
    process.env.NEXT_LANDING_PAGES_API_URL ||
    "https://backend-site.maggenta.com.br"
  ).replace(/\/$/, "");

const firstLandingPageKeyword = (keywords: string) =>
  keywords.split(/[,;\n]/).map((keyword) => keyword.trim()).find(Boolean) || "";

const landingPagePath = (
  apiSlug: string | null | undefined,
  targetUrl: string,
  keywords: string,
  title: string
) => {
  const explicitSlug = slugify(apiSlug || "");
  if (explicitSlug) return `/${explicitSlug}`;

  try {
    const url = new URL(targetUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    const segments = url.pathname
      .split("/")
      .map((segment) => decodeURIComponent(segment).trim())
      .filter(Boolean);
    const slug = slugify(
      segments.at(-1) || firstLandingPageKeyword(keywords) || title
    );
    return slug ? `/${slug}` : null;
  } catch {
    return null;
  }
};

const mapLandingPage = (landingPage: LandingPageApi): LandingPage | null => {
  const path = landingPagePath(
    landingPage.slug,
    landingPage.url,
    landingPage.keywords,
    landingPage.title
  );
  if (!path || !landingPage.title?.trim() || !landingPage.keywords?.trim()) return null;

  return {
    ...landingPage,
    title: landingPage.title.trim(),
    description: landingPage.description?.trim() || null,
    keywords: landingPage.keywords.trim(),
    path,
    slug: path.slice(1),
  };
};

export const buildRawApiUrl = (path: string) => {
  const base = apiBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return base ? `${base}${cleanPath}` : cleanPath;
};

export const buildApiUrl = (path: string, baseUrl?: string) => {
  const base = (baseUrl || apiBaseUrl()).replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (!base) {
    return "";
  }

  if (cleanPath === "/health" || cleanPath.startsWith(API_BASE_PATH)) {
    return `${base}${cleanPath}`;
  }

  return `${base}${API_BASE_PATH}${cleanPath}`;
};

const requestApiUrl = async (
  url: string,
  init: RequestInit = {},
  includeAuth = true
) => {
  const method = (init.method || "GET").toUpperCase();
  const isGet = method === "GET";
  const attempts = isGet ? API_REQUEST_ATTEMPTS : 1;
  const requestLabel = apiRequestLabel(url);
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchWithTimeout(
        url,
        {
          ...init,
          // O cache de pagina/rota controla a performance. A resposta bruta da
          // API nao pode ser armazenada antes de validarmos que ela e JSON.
          cache: "no-store",
          headers: {
            Accept: "application/json",
            ...(isGet ? {} : { "Content-Type": "application/json" }),
            ...(includeAuth ? authHeaders() : {}),
            ...(init.headers || {}),
          },
        },
        isGet ? API_GET_TIMEOUT_MS : API_WRITE_TIMEOUT_MS
      );

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new ApiRequestError(
          `A API respondeu HTTP ${response.status} em ${requestLabel}.`,
          response.status === 408 || response.status === 429 || response.status >= 500
        );
      }

      const contentType = response.headers.get("content-type")?.toLowerCase() || "";
      if (!contentType.includes("json")) {
        throw new ApiRequestError(
          `A API respondeu ${contentType || "um formato desconhecido"} em ${requestLabel}; JSON era esperado.`
        );
      }

      let payload: unknown;
      try {
        payload = JSON.parse(await response.text()) as unknown;
      } catch {
        throw new ApiRequestError(
          `A API respondeu JSON invalido em ${requestLabel}.`
        );
      }

      if (
        payload &&
        typeof payload === "object" &&
        "success" in payload &&
        payload.success === false
      ) {
        throw new ApiRequestError(
          `A API recusou a consulta em ${requestLabel}.`
        );
      }

      return payload;
    } catch (error) {
      lastError = error;
      const canRetry =
        isGet &&
        attempt < attempts &&
        (!(error instanceof ApiRequestError) || error.retryable);

      const reason = error instanceof Error ? error.message : "falha desconhecida";
      console.warn(
        `[api] ${method} ${requestLabel} falhou na tentativa ${attempt}/${attempts}: ${reason}`
      );

      if (!canRetry) {
        throw error;
      }

      await waitForApiRetry(API_RETRY_DELAYS_MS[attempt - 1] || 750);
    }
  }

  throw lastError;
};

const apiRequest = async (
  path: string,
  init: RequestInit = {},
  includeAuth = true,
  baseUrl?: string
) => {
  const method = (init.method || "GET").toUpperCase();
  // NEXT_API_URL e a unica origem das leituras publicas. Uma configuracao
  // ausente ou invalida deve falhar explicitamente, sem trocar de backend.
  const requestBaseUrl =
    baseUrl || (method === "GET" ? apiBaseUrl() : apiWriteBaseUrl());
  const url = buildApiUrl(path, requestBaseUrl);

  if (!url) {
    throw new ApiRequestError(
      "A URL da API nao foi configurada para as chamadas do servidor.",
      false
    );
  }

  // O cache pertence às páginas e rotas que conhecem o contexto da resposta.
  // Não retenha aqui um catálogo vazio ou uma busca transitória por 5 minutos.
  return requestApiUrl(url, init, includeAuth);
};

const authHeaders = () => {
  const token = process.env.NEXT_API_TOKEN || process.env.API_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const unwrapEnvelope = <T>(payload: unknown): T => {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data &&
    typeof payload.data === "object" &&
    "items" in payload.data
  ) {
    return payload.data.items as T;
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
};

const unwrapItemEnvelope = <T>(payload: unknown): T | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if ("data" in payload) {
    const data = payload.data;

    if (data && typeof data === "object" && "item" in data) {
      return data.item as T;
    }

    return data as T;
  }

  if ("item" in payload) {
    return payload.item as T;
  }

  return payload as T;
};

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T | null> {
  const payload = await apiRequest(path, init);
  return payload ? unwrapEnvelope<T>(payload) : null;
}

async function apiFetchItem<T>(path: string, init: RequestInit = {}): Promise<T | null> {
  const payload = await apiRequest(path, init);
  return unwrapItemEnvelope<T>(payload);
}

async function apiFetchAllPages<T>(
  path: string,
  pageSize = 100,
  maxPages = 80,
  init: RequestInit = {},
  includeAuth = true,
  baseUrl?: string
): Promise<T[] | null> {
  const separator = path.includes("?") ? "&" : "?";
  const firstPayload = await apiRequest(
    `${path}${separator}page=1&limit=${pageSize}`,
    init,
    includeAuth,
    baseUrl
  );

  if (!firstPayload) {
    return null;
  }

  const firstData =
    firstPayload &&
    typeof firstPayload === "object" &&
    "data" in firstPayload
      ? (firstPayload.data as PaginatedApiData<T> | T[])
      : (firstPayload as PaginatedApiData<T> | T[]);

  if (Array.isArray(firstData)) {
    return firstData;
  }

  const firstItems = firstData.items || [];
  const totalPages = Math.min(firstData.totalPages || 1, maxPages);
  const pages = Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => index + 2);
  const rest = await Promise.all(
    pages.map(async (page) => {
      const payload = await apiRequest(
        `${path}${separator}page=${page}&limit=${pageSize}`,
        init,
        includeAuth,
        baseUrl
      );
      const data =
        payload && typeof payload === "object" && "data" in payload
          ? (payload.data as PaginatedApiData<T> | T[])
          : (payload as PaginatedApiData<T> | T[] | null);

      if (Array.isArray(data)) {
        return data;
      }

      return data?.items || [];
    })
  );

  return [...firstItems, ...rest.flat()];
}

async function fetchFirstAvailable<T>(paths: string[]): Promise<T | null> {
  for (const path of paths) {
    const data = await apiFetch<T>(path);
    if (Array.isArray(data) ? data.length > 0 : Boolean(data)) {
      return data;
    }
  }

  return null;
}

async function fetchAllFirstAvailable<T>(
  paths: string[],
  pageSize = 100,
  init: RequestInit = {}
): Promise<T[] | null> {
  for (const path of paths) {
    const data = await apiFetchAllPages<T>(path, pageSize, 80, init);

    if (data?.length) {
      return data;
    }
  }

  return null;
}

export const productImageProxy = (
  idProduto: number,
  filename: string,
  folder: "thumb" | "alta" = "alta"
) =>
  buildRawApiUrl(
    `/api/produto-imagem?id=${idProduto}&filename=${encodeURIComponent(
      filename
    )}&folder=${folder}`
  );

const normalizeImage = (product: ProdutoApi, folder: "thumb" | "alta") => {
  if (isValidImageSrc(product.imagem_url)) {
    return product.imagem_url;
  }

  if (!isValidImageSrc(product.imagem)) {
    return "";
  }

  if (product.imagem.startsWith("/") || product.imagem.startsWith("http")) {
    return product.imagem;
  }

  return productImageProxy(product.id_produto, product.imagem, folder);
};

const imageOrder = (image: ProdutoImageApi) =>
  image.ordem_imagem ?? image.ordem ?? Number.MAX_SAFE_INTEGER;

const normalizeProductImages = (
  product: ProdutoApi,
  images: ProdutoImageApi[],
  folder: "thumb" | "alta"
) =>
  [...images]
    .sort((a, b) => imageOrder(a) - imageOrder(b))
    .flatMap((image) => {
      if (isValidImageSrc(image.url_imagem)) {
        return image.url_imagem;
      }

      if (isValidImageSrc(image.url)) {
        return image.url;
      }

      if (image.filename) {
        return productImageProxy(product.id_produto, image.filename, folder);
      }

      return [];
    });

const uniqueValidImages = (images: string[]) =>
  images.filter(
    (image, index, items) => isValidImageSrc(image) && items.indexOf(image) === index
  );

const ensureProductImages = (images: string[], fallback: string) => {
  const validImages = uniqueValidImages(images);
  const safeFallback = isValidImageSrc(fallback)
    ? fallback
    : "/images/logo/NOVO_LOGO_MAGG_HORIZONTAL_COR.png";

  if (validImages.length >= 2) {
    return validImages;
  }

  if (validImages.length === 1) {
    return [validImages[0], validImages[0]];
  }

  return [safeFallback, safeFallback];
};

const withUnit = (value: string | number | null | undefined, unit: string) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  const text = String(value).trim();
  return text.toLowerCase().endsWith(unit.toLowerCase()) ? text : `${text} ${unit}`;
};

const decimalText = (value: string | number | null | undefined) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numeric = Number(String(value).replace(",", "."));

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return undefined;
  }

  return numeric.toFixed(1);
};

const integerText = (value: string | number | null | undefined) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numeric = Number(String(value).replace(",", "."));

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return undefined;
  }

  return String(Math.round(numeric));
};

export const mapApiProdutoToProduct = (
  product: ProdutoApi,
  images: ProdutoImageApi[] = [],
  categoryName?: string
): Product => {
  const productImages = product.imagens?.length ? product.imagens : images;
  const apiPreviews = normalizeProductImages(product, productImages, "alta");
  const apiThumbs = normalizeProductImages(product, productImages, "thumb");
  const mainImage = normalizeImage(product, "alta");
  const mainThumb = normalizeImage(product, "thumb");
  const previews = ensureProductImages(
    [mainImage, ...apiPreviews],
    mainImage
  );
  const thumbnails = ensureProductImages(
    [mainThumb, ...apiThumbs],
    mainThumb || mainImage
  );
  const title = product.produto || `Produto ${product.id_produto}`;
  const codigo = product.codigo || `PEP-${product.id_produto}`;
  const apiCategoryName =
    categoryName ||
    product.categorias?.find((category) => category?.categoria)?.categoria ||
    product.categoria ||
    "Brinde";
  const quantidadeMinima =
    product.quantidade_minima !== undefined && product.quantidade_minima !== null
      ? String(product.quantidade_minima)
      : "";
  const badge = isYes(product.promocao)
    ? "Promoção"
    : isYes(product.lancamento)
      ? "Lançamento"
      : isYes(product.premium)
        ? "Premium"
        : undefined;

  return {
    id: product.id_produto,
    codigo,
    idTipoProduto: product.id_tipo_produto,
    categoryId:
      product.categorias?.find((category) => Number.isFinite(Number(category?.id_categoria)))
        ?.id_categoria ||
      (Number.isFinite(Number(product.id_categoria)) ? Number(product.id_categoria) : undefined),
    quantidadeMinima: Number(quantidadeMinima) || undefined,
    title,
    slug: `${product.id_produto}-${slugify(title)}`,
    category: apiCategoryName,
    shortDescription: product.descricao || product.obs || "",
    description: product.descricao || product.obs || "",
    features: [
      product.codigo ? `Código ${product.codigo}` : "",
      product.altura ? `Altura: ${withUnit(product.altura, "cm")}` : "",
      product.largura ? `Largura: ${withUnit(product.largura, "cm")}` : "",
      product.profundidade ? `Profundidade: ${withUnit(product.profundidade, "cm")}` : "",
      product.peso ? `Peso: ${withUnit(product.peso, "g")}` : "",
      quantidadeMinima ? `Quantidade mínima: ${withUnit(quantidadeMinima, "un")}` : "",
    ].filter(Boolean),
    specs: [
      { label: "Código", value: codigo },
      product.altura ? { label: "Altura", value: withUnit(product.altura, "cm") } : null,
      product.largura ? { label: "Largura", value: withUnit(product.largura, "cm") } : null,
      product.profundidade
        ? { label: "Profundidade", value: withUnit(product.profundidade, "cm") }
        : null,
      product.peso ? { label: "Peso", value: withUnit(product.peso, "g") } : null,
      quantidadeMinima
        ? { label: "Quantidade mínima", value: withUnit(quantidadeMinima, "un") }
        : null,
      product.ncm ? { label: "NCM", value: product.ncm } : null,
    ].filter(Boolean) as Product["specs"],
    reviews: 0,
    price: 0,
    discountedPrice: 0,
    dimensions: {
      altura: decimalText(product.altura),
      largura: decimalText(product.largura),
      profundidade: decimalText(product.profundidade),
      peso: integerText(product.peso),
    },
    badge,
    dataInclusao: product.data_inclusao || undefined,
    updatedAt: product.data_modificacao || product.updated_at || undefined,
    seoTaxonomy: {
      subcategories: (product.subcategorias || [])
        .map((item) => ({ id: Number(item.id_subcategoria), title: item.subcategoria }))
        .filter((item) => Number.isFinite(item.id) && Boolean(item.title)),
      audiences: (product.publicos_alvos || [])
        .map((item) => ({ id: Number(item.id_publico_alvo), title: item.publico_alvo }))
        .filter((item) => Number.isFinite(item.id) && Boolean(item.title)),
      promotionalDates: (product.datas_promocionais || [])
        .map((item) => ({
          id: Number(item.id_data_promocional),
          title: item.data_promocional,
        }))
        .filter((item) => Number.isFinite(item.id) && Boolean(item.title)),
    },
    lancamento: isYes(product.lancamento),
    promocao: isYes(product.promocao),
    premium: isYes(product.premium),
    video: product.video || undefined,
    imgs: {
      thumbnails: thumbnails.slice(0, 6),
      previews: previews.slice(0, 6),
    },
  };
};

export async function getProdutos(limit = 100): Promise<Product[]> {
  const pageSize = Math.min(Math.max(limit, 1), 100);
  const maxPages = Math.max(1, Math.ceil(limit / pageSize));
  const produtos =
    (await apiFetchAllPages<ProdutoApi>("/produtos", pageSize, maxPages)) || [];

  return produtos
    .filter((product) => isEnabled(product.habilitado) && isEnabled(product.site))
    .map((product) => mapApiProdutoToProduct(product))
    .slice(0, limit);
}

const emptyCatalogoFiltros: CatalogoFiltros = {
  subcategorias: [],
  publicos_alvos: [],
  datas_promocionais: [],
  quantidade_minima: {
    min: 0,
    max: 0,
  },
};

const emptyCatalogoProdutos = (page: number, limit: number): CatalogoProdutos => ({
  categoria: null,
  filtros: emptyCatalogoFiltros,
  items: [],
  total: 0,
  page,
  limit,
  totalPages: 0,
});

const emptyCatalogoTipoProduto = (
  page: number,
  limit: number
): CatalogoTipoProduto => ({
  tipo_produto: null,
  filtros: emptyCatalogoFiltros,
  items: [],
  total: 0,
  page,
  limit,
  totalPages: 0,
});

const sanitizeCatalogPage = (value?: number) =>
  Number.isFinite(value) && Number(value) > 0 ? Math.floor(Number(value)) : 1;

const sanitizeCatalogLimit = (value?: number) => {
  const limit = Number.isFinite(value) && Number(value) > 0 ? Math.floor(Number(value)) : 100;
  return Math.min(Math.max(limit, 1), 500);
};

const sanitizeWideCatalogLimit = (value?: number) => {
  const limit = Number.isFinite(value) && Number(value) > 0 ? Math.floor(Number(value)) : 100;
  return Math.min(Math.max(limit, 1), 500);
};

const appendCatalogParam = (
  params: URLSearchParams,
  key: string,
  value: string | number | undefined
) => {
  if (value === undefined || value === null || value === "") {
    return;
  }

  params.set(key, String(value));
};

export async function getCatalogoCategoria(
  idCategoria = 1,
  query: CatalogoProdutosQuery = {}
): Promise<CatalogoProdutos> {
  const page = sanitizeCatalogPage(query.page);
  const limit = sanitizeCatalogLimit(query.limit);
  const params = new URLSearchParams({
    empresaId: String(query.empresaId || 1),
    page: String(page),
    limit: String(limit),
  });

  appendCatalogParam(params, "subcategorias", query.subcategorias);
  appendCatalogParam(params, "publicos_alvos", query.publicos_alvos);
  appendCatalogParam(params, "quantidade_minima_min", query.quantidade_minima_min);
  appendCatalogParam(params, "quantidade_minima_max", query.quantidade_minima_max);
  appendCatalogParam(
    params,
    "datas_promocionais",
    query.datas_promocionais || query.data_promocional
  );
  appendCatalogParam(params, "data_promocional", query.data_promocional);

  const payload = await apiRequest(
    `/categorias/${encodeURIComponent(String(idCategoria))}/catalogo?${params.toString()}`
  );

  const data =
    payload && typeof payload === "object" && "data" in payload
      ? (payload.data as {
          categoria?: CatalogoCategoria | null;
          filtros?: Partial<CatalogoFiltros>;
          items?: ProdutoApi[];
          total?: number;
          page?: number;
          limit?: number;
          totalPages?: number;
        })
      : null;

  if (!data) {
    return emptyCatalogoProdutos(page, limit);
  }

  const categoryName = data.categoria?.categoria;
  const categoryId = data.categoria?.id_categoria || idCategoria;
  const sourceItems = data.items || [];

  return {
    categoria: data.categoria || null,
    filtros: {
      subcategorias: data.filtros?.subcategorias || [],
      publicos_alvos: data.filtros?.publicos_alvos || [],
      datas_promocionais: data.filtros?.datas_promocionais || [],
      quantidade_minima:
        data.filtros?.quantidade_minima || emptyCatalogoFiltros.quantidade_minima,
    },
    items: sourceItems.map((product) => {
      const mappedProduct = mapApiProdutoToProduct(product, [], categoryName);

      return {
        ...mappedProduct,
        categoryId: mappedProduct.categoryId || categoryId,
      };
    }),
    total: Number(data.total || sourceItems.length || 0),
    page: Number(data.page || page),
    limit: Number(data.limit || limit),
    totalPages: Math.max(Number(data.totalPages || 1), 1),
  };
}

const mapCatalogDataToProdutos = ({
  data,
  page,
  limit,
  fallbackTitle,
  fallbackDescription = null,
  fallbackId = 0,
}: {
  data: {
    filtros?: Partial<CatalogoFiltros>;
    items?: ProdutoApi[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  } | null;
  page: number;
  limit: number;
  fallbackTitle: string;
  fallbackDescription?: string | null;
  fallbackId?: number;
}): CatalogoProdutos | null => {
  if (!data) {
    return null;
  }

  const items = data.items || [];

  return {
    categoria: {
      id_empresa: 1,
      id_categoria: fallbackId,
      categoria: fallbackTitle,
      descricao: fallbackDescription,
      icon: null,
      habilitado: "S",
      url_capa: null,
    },
    filtros: {
      subcategorias: data.filtros?.subcategorias || [],
      publicos_alvos: data.filtros?.publicos_alvos || [],
      datas_promocionais: data.filtros?.datas_promocionais || [],
      quantidade_minima:
        data.filtros?.quantidade_minima || emptyCatalogoFiltros.quantidade_minima,
    },
    items: items.map((product) => mapApiProdutoToProduct(product, [], fallbackTitle)),
    total: Number(data.total || items.length || 0),
    page: Number(data.page || page),
    limit: Number(data.limit || limit),
    totalPages: Number(data.totalPages || 0),
  };
};

export async function getCatalogoPublicoAlvo(
  idPublicoAlvo = 1,
  query: CatalogoProdutosQuery = {}
): Promise<CatalogoProdutos> {
  const page = sanitizeCatalogPage(query.page);
  const limit = sanitizeWideCatalogLimit(query.limit);
  const params = new URLSearchParams({
    empresaId: String(query.empresaId || 1),
    page: String(page),
    limit: String(limit),
  });

  appendCatalogParam(params, "subcategorias", query.subcategorias);
  appendCatalogParam(params, "publicos_alvos", query.publicos_alvos);
  appendCatalogParam(params, "datas_promocionais", query.datas_promocionais);
  appendCatalogParam(params, "quantidade_minima_min", query.quantidade_minima_min);
  appendCatalogParam(params, "quantidade_minima_max", query.quantidade_minima_max);

  const payload = await apiRequest(
    `/publicos-alvos/${encodeURIComponent(String(idPublicoAlvo))}/catalogo?${params.toString()}`
  );
  const data =
    payload && typeof payload === "object" && "data" in payload
      ? (payload.data as CatalogoPublicoAlvoResponse)
      : null;
  if (!data?.publico_alvo) {
    return emptyCatalogoProdutos(page, limit);
  }

  const titulo = data.publico_alvo.publico_alvo;
  const mapped = mapCatalogDataToProdutos({
    data,
    page,
    limit,
    fallbackTitle: titulo,
    fallbackDescription: data?.publico_alvo?.descricao || null,
    fallbackId: idPublicoAlvo,
  });

  if (mapped) {
    return mapped;
  }

  return emptyCatalogoProdutos(page, limit);
}

export async function getCatalogoDataPromocional(
  idDataPromocional = 1,
  query: CatalogoProdutosQuery = {}
): Promise<CatalogoProdutos> {
  const page = sanitizeCatalogPage(query.page);
  const limit = sanitizeWideCatalogLimit(query.limit);
  const params = new URLSearchParams({
    empresaId: String(query.empresaId || 1),
    page: String(page),
    limit: String(limit),
  });

  appendCatalogParam(params, "subcategorias", query.subcategorias);
  appendCatalogParam(params, "publicos_alvos", query.publicos_alvos);
  appendCatalogParam(params, "datas_promocionais", query.datas_promocionais);
  appendCatalogParam(params, "quantidade_minima_min", query.quantidade_minima_min);
  appendCatalogParam(params, "quantidade_minima_max", query.quantidade_minima_max);

  const payload = await apiRequest(
    `/datas-promocionais/${encodeURIComponent(String(idDataPromocional))}/catalogo?${params.toString()}`
  );
  const data =
    payload && typeof payload === "object" && "data" in payload
      ? (payload.data as CatalogoDataPromocionalResponse)
      : null;
  if (!data?.data_promocional) {
    return emptyCatalogoProdutos(page, limit);
  }

  const titulo = data.data_promocional.data_promocional;
  const mapped = mapCatalogDataToProdutos({
    data,
    page,
    limit,
    fallbackTitle: titulo,
    fallbackDescription: data?.data_promocional?.descricao || null,
    fallbackId: idDataPromocional,
  });

  if (mapped) {
    return mapped;
  }

  return emptyCatalogoProdutos(page, limit);
}

export async function getCatalogoTipoProduto(
  idTipoProduto = 12,
  query: Pick<CatalogoProdutosQuery, "empresaId" | "page" | "limit"> = {}
): Promise<CatalogoTipoProduto> {
  const page = sanitizeCatalogPage(query.page);
  const limit = sanitizeWideCatalogLimit(query.limit);
  const params = new URLSearchParams({
    empresaId: String(query.empresaId || 1),
    page: String(page),
    limit: String(limit),
  });
  const firstPayload = await apiRequest(
    `/tipos-produtos/${encodeURIComponent(String(idTipoProduto))}/catalogo?${params.toString()}`
  );
  const firstData =
    firstPayload && typeof firstPayload === "object" && "data" in firstPayload
      ? (firstPayload.data as {
          tipo_produto?: CatalogoTipoProduto["tipo_produto"];
          filtros?: Partial<CatalogoFiltros>;
          items?: ProdutoApi[];
          total?: number;
          page?: number;
          limit?: number;
          totalPages?: number;
        })
      : null;

  if (!firstData?.tipo_produto) {
    return emptyCatalogoTipoProduto(page, limit);
  }

  const tipoNome = firstData.tipo_produto?.tipo_produto;
  const items = firstData.items || [];

  return {
    tipo_produto: firstData.tipo_produto || null,
    filtros: {
      subcategorias: firstData.filtros?.subcategorias || [],
      publicos_alvos: firstData.filtros?.publicos_alvos || [],
      datas_promocionais: firstData.filtros?.datas_promocionais || [],
      quantidade_minima:
        firstData.filtros?.quantidade_minima || emptyCatalogoFiltros.quantidade_minima,
    },
    items: items.map((product) => mapApiProdutoToProduct(product, [], tipoNome)),
    total: Number(firstData.total || items.length),
    page: Number(firstData.page || page),
    limit: Number(firstData.limit || limit),
    totalPages: Math.max(Number(firstData.totalPages || 1), 1),
  };
}

export async function getCatalogoCategorias(
  init: RequestInit = {}
): Promise<CatalogoOption[]> {
  const categorias =
    (await fetchAllFirstAvailable<CatalogoCategoria>([
      "/categorias",
      "/produtos/categorias",
    ], 100, init)) || [];

  return categorias
    .filter((category) => isEnabled(category.habilitado))
    .sort(sortByOrderAndName("categoria"))
    .map((category) => ({
      id: Number(category.id_categoria),
      title: String(category.categoria),
    }))
    .filter((category) => Number.isFinite(category.id) && category.title);
}

export async function getCatalogoTiposProdutos(
  init: RequestInit = {}
): Promise<CatalogoOption[]> {
  const tipos =
    (await fetchAllFirstAvailable<TipoProdutoApi>([
      "/tipos-produtos/habilitados",
      "/tipos_produtos/habilitados",
      "/tiposProdutos/habilitados",
    ], 100, init)) || [];

  return tipos
    .filter((tipo) => isEnabled(tipo.habilitado))
    .sort(sortByOrderAndName("tipo_produto"))
    .map((tipo) => ({
      id: Number(tipo.id_tipo_produto),
      title: String(tipo.tipo_produto),
    }))
    .filter((tipo) => Number.isFinite(tipo.id) && tipo.title);
}

export async function getDatasPromocionais(
  init: RequestInit = {}
): Promise<CatalogoOption[]> {
  const datas =
    (await fetchAllFirstAvailable<DataPromocionalApi>([
      "/datas-promocionais",
    ], 10, init)) || [];

  return datas
    .filter((data) => isEnabled(data.habilitado))
    .sort(sortByOrderAndName("data_promocional"))
    .map((data) => ({
      id: Number(data.id_data_promocional),
      title: String(data.data_promocional),
    }))
    .filter((data) => Number.isFinite(data.id) && data.title);
}

export async function getPublicosAlvos(
  init: RequestInit = {}
): Promise<CatalogoOption[]> {
  const publicos =
    (await fetchAllFirstAvailable<PublicoAlvoApi>([
      "/publicos-alvos",
      "/publicos_alvos",
      "/publicos-alvo",
    ], 100, init)) || [];

  return publicos
    .filter((publico) => isEnabled(publico.habilitado))
    .sort(sortByOrderAndName("publico_alvo"))
    .map((publico) => ({
      id: Number(publico.id_publico_alvo),
      title: String(publico.publico_alvo),
    }))
    .filter((publico) => Number.isFinite(publico.id) && publico.title);
}

export async function getProdutosForSitemap(limit = 10000): Promise<Product[]> {
  const pageSize = 500;
  const maxPages = Math.max(1, Math.ceil(limit / pageSize));
  const produtos =
    (await apiFetchAllPages<ProdutoApi>("/produtos/site?empresaId=1", pageSize, maxPages)) || [];

  return produtos
    .filter((product) => isEnabled(product.habilitado) && isEnabled(product.site))
    .map((product) => mapApiProdutoToProduct(product))
    .slice(0, limit);
}

export async function getProdutosSite(limit = 12): Promise<Product[]> {
  const pageSize = Math.min(Math.max(limit, 1), 100);
  const maxPages = Math.max(1, Math.ceil(limit / pageSize));
  const produtos =
    (await apiFetchAllPages<ProdutoApi>(
      "/produtos/site?empresaId=1",
      pageSize,
      maxPages
    )) || [];

  const products = produtos
    .filter((product) => isEnabled(product.habilitado) && isEnabled(product.site))
    .map((product) => mapApiProdutoToProduct(product))
    .slice(0, limit);

  if (!products.length) {
    throw new ApiRequestError(
      "A API configurada em NEXT_API_URL retornou o catálogo público vazio.",
      true
    );
  }

  return products;
}

export async function getLandingPages(): Promise<LandingPage[]> {
  const landingPages =
    (await apiFetchAllPages<LandingPageApi>(
      "/landing-pages",
      100,
      80,
      {},
      false,
      landingPagesApiBaseUrl()
    )) || [];

  return landingPages
    .map(mapLandingPage)
    .filter((landingPage): landingPage is LandingPage => Boolean(landingPage));
}

export async function getLandingPageByPath(path: string): Promise<LandingPage | null> {
  const slug = slugify(path.split("/").filter(Boolean).at(-1) || "");
  if (!slug) return null;

  // O contrato de pesquisa não garante busca pelo campo slug. A listagem é
  // cacheada pelo Next e pelo backend, evitando falsos 404 sem criar uma
  // chamada por registro.
  const landingPages = await getLandingPages();

  return landingPages.find((landingPage) => landingPage.slug === slug) || null;
}

export async function getProdutosSitePaginated(
  query: Pick<CatalogoProdutosQuery, "empresaId" | "page" | "limit"> = {}
): Promise<Omit<CatalogoProdutos, "categoria" | "filtros">> {
  const page = sanitizeCatalogPage(query.page);
  const limit = sanitizeWideCatalogLimit(query.limit);
  const payload = await apiRequest(
    `/produtos/site?empresaId=${encodeURIComponent(
      String(query.empresaId || 1)
    )}&page=${encodeURIComponent(String(page))}&limit=${encodeURIComponent(String(limit))}`
  );
  const data =
    payload && typeof payload === "object" && "data" in payload
      ? (payload.data as PaginatedApiData<ProdutoApi>)
      : null;
  const items = data?.items || [];

  if (page === 1 && !items.length) {
    throw new ApiRequestError(
      "A API configurada em NEXT_API_URL retornou a primeira página do catálogo vazia.",
      true
    );
  }

  return {
    items: items
      .filter((product) => isEnabled(product.habilitado) && isEnabled(product.site))
      .map((product) => mapApiProdutoToProduct(product)),
    total: Number(data?.total || items.length || 0),
    page: Number(data?.page || page),
    limit: Number(data?.limit || limit),
    totalPages: Math.max(Number(data?.totalPages || 1), 1),
  };
}

export async function searchProdutosSite(query: string, limit = 10): Promise<Product[]> {
  const result = await searchProdutosSiteWithDestination(query, limit);
  return result.products;
}

export async function getProdutoById(id: number): Promise<Product | null> {
  const product =
    (await apiFetchItem<ProdutoApi>(`/produtos/${id}`)) ||
    (await apiFetchItem<ProdutoApi>(`/produtos/site/${id}`));

  if (!product?.id_produto) {
    return null;
  }

  const images = product.imagens?.length
    ? product.imagens
    : (await apiFetch<ProdutoImageApi[]>(`/produtos/${id}/images`)) || [];

  return mapApiProdutoToProduct(product, images);
}

export async function getSubcategoriaById(
  idSubcategoria: number
): Promise<CatalogoSubcategoria | null> {
  if (!Number.isFinite(idSubcategoria) || idSubcategoria <= 0) {
    return null;
  }

  const subcategoria = await apiFetchItem<CatalogoSubcategoria>(
    `/subcategorias/${encodeURIComponent(String(idSubcategoria))}`
  );

  if (
    Number(subcategoria?.id_subcategoria) !== idSubcategoria ||
    !Number(subcategoria?.id_categoria) ||
    !String(subcategoria?.subcategoria || "").trim() ||
    !isEnabled(subcategoria?.habilitado)
  ) {
    return null;
  }

  return subcategoria;
}

export async function getCatalogoSubcategoriaProdutos(
  idSubcategoria: number,
  subcategoriaNome = "Subcategoria",
  query: CatalogoProdutosQuery & { idCategoria?: number } = {}
): Promise<CatalogoProdutos> {
  const page = sanitizeCatalogPage(query.page);
  const limit = sanitizeWideCatalogLimit(query.limit);
  const catalogo = await getCatalogoSubcategoria(idSubcategoria, query);

  if (!catalogo.tipo_produto) {
    return emptyCatalogoProdutos(page, limit);
  }

  return {
    categoria: {
      id_empresa: 1,
      id_categoria: idSubcategoria,
      categoria: catalogo.tipo_produto?.tipo_produto || subcategoriaNome,
      descricao: catalogo.tipo_produto?.descricao || null,
      icon: null,
      habilitado: "S",
      url_capa: null,
    },
    parentCategoryId: catalogo.parentCategoryId,
    filtros: catalogo.filtros,
    items: catalogo.items,
    total: catalogo.total,
    page: catalogo.page,
    limit: catalogo.limit,
    totalPages: catalogo.totalPages,
  };
}

export async function getCatalogoSubcategoria(
  idSubcategoria: number,
  query: CatalogoProdutosQuery & { idCategoria?: number } = {}
): Promise<CatalogoTipoProduto> {
  const page = sanitizeCatalogPage(query.page);
  const limit = sanitizeWideCatalogLimit(query.limit);
  const subcategoria = await getSubcategoriaById(idSubcategoria);
  const parentCategoryId = Number(subcategoria?.id_categoria || 0);

  if (!subcategoria || !parentCategoryId) {
    return emptyCatalogoTipoProduto(page, limit);
  }

  const catalogo = await getCatalogoCategoria(parentCategoryId, {
    empresaId: query.empresaId || 1,
    page,
    limit,
    subcategorias: String(idSubcategoria),
    publicos_alvos: query.publicos_alvos,
    quantidade_minima_min: query.quantidade_minima_min,
    quantidade_minima_max: query.quantidade_minima_max,
    data_promocional: query.data_promocional,
    datas_promocionais: query.datas_promocionais,
  });

  if (!catalogo.categoria) {
    return emptyCatalogoTipoProduto(page, limit);
  }

  return {
    tipo_produto: {
      id_empresa: Number(subcategoria.id_empresa || 1),
      id_tipo_produto: idSubcategoria,
      tipo_produto: subcategoria.subcategoria,
      descricao: subcategoria.descricao || null,
      habilitado: subcategoria.habilitado || "S",
    },
    parentCategoryId,
    filtros: catalogo.filtros,
    items: catalogo.items,
    total: catalogo.total,
    page: catalogo.page,
    limit: catalogo.limit,
    totalPages: catalogo.totalPages,
  };
}

export async function searchProdutosSiteWithDestination(
  query: string,
  limit = 10,
  page = 1
): Promise<SearchProdutosSiteResult> {
  // Envia sempre a mesma forma canônica à API para que a busca textual não
  // dependa das maiúsculas/minúsculas digitadas pelo usuário.
  const search = query.trim().toLocaleLowerCase("pt-BR");
  const safePage = sanitizeCatalogPage(page);
  const safeLimit = sanitizeWideCatalogLimit(limit);

  if (!search) {
    return { products: [], destinoBusca: null, total: 0, page: 1, limit: safeLimit, totalPages: 0 };
  }

  const parseSearchData = (payload: unknown) =>
    payload && typeof payload === "object" && "data" in payload
      ? (payload.data as SearchProdutosSiteApiData)
      : null;
  const resolveExactProduct = async (
    data: SearchProdutosSiteApiData | null
  ): Promise<SearchProdutosSiteResult | null> => {
    if (!data?.match_exato_codigo || !data.id_produto) {
      return null;
    }

    const exactProductId = Number(data.id_produto);
    const exactProduct = await getProdutoById(Number(data.id_produto));

    return {
      products: exactProduct ? [exactProduct] : [],
      destinoBusca: null,
      total: exactProduct ? 1 : 0,
      page: 1,
      limit: 1,
      totalPages: exactProduct ? 1 : 0,
      exactProduct,
      exactProductId: Number.isFinite(exactProductId) ? exactProductId : null,
      exactProductCode: data.codigo || null,
    };
  };
  const codeSearchVariants = (term: string) => {
    const normalized = term.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (normalized.length < 5 || !/\d/.test(normalized)) {
      return [];
    }

    const collapsed = normalized.replace(/(.)\1+/g, "$1");
    const candidates = [normalized, collapsed]
      .filter(Boolean)
      .flatMap((value) => (value.startsWith("PEP") ? [value] : [`PEP${value}`, value]));

    return Array.from(new Set(candidates)).filter(
      (value) => value.toLowerCase() !== search.toLowerCase()
    );
  };

  const payload = await apiRequest(
    `/produtos/site/busca?q=${encodeURIComponent(
      search
    )}&empresaId=1&page=${safePage}&limit=${safeLimit}`
  );
  let data = parseSearchData(payload);

  // A rota inteligente e canonica. Enquanto o mesmo backend estiver em modo
  // legado, a rota compativel ?busca= evita falsos negativos sem trocar a
  // origem definida em NEXT_API_URL nem alterar a ordem retornada pela API.
  if (!data?.items?.length && !data?.destino_busca && data?.mode !== "advanced") {
    const legacyParams = new URLSearchParams({
      busca: search,
      empresaId: "1",
      page: String(safePage),
      limit: String(safeLimit),
    });
    const legacyData = parseSearchData(
      await apiRequest(`/produtos/site?${legacyParams.toString()}`)
    );

    if (legacyData?.items?.length || legacyData?.destino_busca) {
      data = legacyData;
    }
  }
  const exactResult = await resolveExactProduct(data);

  if (exactResult) {
    return exactResult;
  }

  const produtos = data?.items || [];

  if (!produtos.length && !data?.destino_busca) {
    for (const variant of codeSearchVariants(search)) {
      const variantPayload = await apiRequest(
        `/produtos/site/busca?q=${encodeURIComponent(
          variant
        )}&empresaId=1&page=1&limit=1`
      );
      const variantExactResult = await resolveExactProduct(parseSearchData(variantPayload));

      if (variantExactResult) {
        return variantExactResult;
      }
    }
  }

  // O backend e a fonte de verdade da relevancia: preserve todos os itens,
  // exatamente na ordem e na paginacao retornadas pela busca inteligente.
  const products = produtos.map((product) => mapApiProdutoToProduct(product));

  return {
    products,
    destinoBusca: data?.destino_busca || null,
    total: Number(data?.total || products.length || 0),
    page: Number(data?.page || safePage),
    limit: Number(data?.limit || safeLimit),
    totalPages: Math.max(Number(data?.totalPages || (products.length ? 1 : 0)), 0),
  };
}

export async function searchProdutosSiteCatalogo(
  query: string,
  options: Pick<CatalogoProdutosQuery, "page" | "limit"> = {}
): Promise<CatalogoTipoProduto> {
  const term = query.trim();
  const result = await searchProdutosSiteWithDestination(
    term,
    options.limit || 24,
    options.page || 1
  );

  return {
    tipo_produto: {
      id_empresa: 1,
      id_tipo_produto: 0,
      tipo_produto: term,
      descricao: `Resultados encontrados para "${term}" com base no nome do produto.`,
      habilitado: "S",
    },
    filtros: emptyCatalogoFiltros,
    items: result.products,
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  };
}

export async function getProdutoBySlug(slug: string): Promise<Product | null> {
  const id = Number(slug.match(/^(\d+)(?:-|$)/)?.[1] || slug.match(/-(\d+)$/)?.[1]);
  const normalizedSlug = slugify(slug.replace(/^\d+-?/, ""));

  if (id) {
    return getProdutoById(id);
  }

  return null;
}

export async function getRelatedProducts(product: Product, limit = 5) {
  if (!product.categoryId || limit <= 0) {
    return [];
  }

  // Fetch one extra item because the current product may be among the first
  // results returned by the category catalog.
  const catalog = await getCatalogoCategoria(product.categoryId, {
    page: 1,
    limit: limit + 1,
  });

  return catalog.items
    .filter(
      (item) => item.id !== product.id && item.categoryId === product.categoryId
    )
    .slice(0, limit);
}

export async function getProductSections() {
  const products = await getProdutosSite(100);
  let stats: { mais_orcados?: ProdutoRankingApi[] } | null = null;
  try {
    stats = await fetchFirstAvailable<{ mais_orcados?: ProdutoRankingApi[] }>([
      "/estatisticas/produtos",
      "/produtos/estatisticas",
      "/estatisticas-produtos",
    ]);
  } catch (error) {
    // Ranking e opcional. Uma falha nele nao pode esconder os produtos reais
    // que ja foram recebidos e validados pela API principal.
    console.warn(
      `[api] Ranking de produtos indisponivel; mantendo catalogo valido: ${
        error instanceof Error ? error.message : "falha desconhecida"
      }`
    );
  }
  const byId = new Map(products.map((product) => [product.id, product]));
  const mostQuoted =
    stats?.mais_orcados
      ?.map((item) => {
        const product = byId.get(item.id_produto);
        return product
          ? { ...product, totalOrcamentos: item.total_registros || item.total_qtde || 0 }
          : null;
      })
      .filter(Boolean) as Product[] | undefined;
  const mostQuotedItems = mostQuoted || [];
  const mostQuotedFallbackProducts =
    mostQuotedItems.length < 10 ? await getProdutos(30) : [];

  const recent = [...products].sort(
    (a, b) =>
      new Date(b.dataInclusao || 0).getTime() -
      new Date(a.dataInclusao || 0).getTime()
  );

  const uniqueProducts = (items: Product[]) => {
    const seen = new Set<number>();

    return items.filter((product) => {
      if (seen.has(product.id)) {
        return false;
      }

      seen.add(product.id);
      return true;
    });
  };
  const fillSectionProducts = (
    items: Product[],
    target = 8,
    fallbackOffset = 0,
    extraFallback: Product[] = []
  ) =>
    uniqueProducts([
      ...items,
      ...extraFallback,
      ...products.slice(fallbackOffset),
    ]).slice(0, target);

  return [
    {
      id: "recentes",
      eyebrow: "Novidades",
      title: "Produtos mais recentes",
      products: fillSectionProducts(recent),
    },
    {
      id: "mais-orcados",
      eyebrow: "Mais Pedidos",
      title: "Mais Procurados",
      products: fillSectionProducts(mostQuotedItems, 10, 1, mostQuotedFallbackProducts),
    },
    {
      id: "lancamentos",
      eyebrow: "Lançamentos",
      title: "Lançamentos",
      products: fillSectionProducts(products.filter((product) => product.lancamento), 8, 2),
    },
    {
      id: "promocao",
      eyebrow: "Promoção",
      title: "Produtos em promoção",
      products: fillSectionProducts(products.filter((product) => product.promocao), 8, 3),
    },
    {
      id: "premium",
      eyebrow: "Linha premium",
      title: "Produtos premium",
      products: fillSectionProducts(products.filter((product) => product.premium), 8, 4),
    },
  ];
}

export async function getHomeCategories(): Promise<Category[]> {
  const categorias =
    (await fetchAllFirstAvailable<CatalogoCategoria>([
      "/categorias",
      "/produtos/categorias",
    ], 100)) || [];

  const categories = categorias
    .filter((category) => isEnabled(category.habilitado))
    .map((category, index) => ({
      id: Number(category.id_categoria),
      title: String(category.categoria),
      img: safeImageSrc(category.url_capa, categoryIcon(index)),
    }));

  if (!categories.length) {
    throw new ApiRequestError(
      "A API configurada em NEXT_API_URL retornou as categorias públicas vazias.",
      true
    );
  }

  return categories;
}

export async function getActiveBanners(tipo?: BannerTipo): Promise<BannerApi[]> {
  const payload = await apiRequest("/banners/ativos?page=1&limit=100");
  const data =
    payload && typeof payload === "object" && "data" in payload
      ? (payload.data as BannersAtivosResponse)
      : null;
  const banners = tipo
    ? data?.grouped?.[tipo] || data?.items?.filter((banner) => banner.tipo === tipo) || []
    : data?.items || [];

  return banners
    .filter((banner) => banner.habilitado === "S" && isValidImageSrc(banner.url_banner))
    .filter((banner) => (tipo ? banner.tipo === tipo : true))
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
}

export const getMenuGroups = async (): Promise<ApiMenuGroup[]> => {
  const menuRequestInit: RequestInit = {};
  const [categorias, tipos, publicos, datas] = await Promise.all([
    getCatalogoCategorias(menuRequestInit),
    getCatalogoTiposProdutos(menuRequestInit),
    getPublicosAlvos(menuRequestInit),
    getDatasPromocionais(menuRequestInit),
  ]);

  if (!categorias.length || !tipos.length) {
    throw new ApiRequestError(
      "A API configurada em NEXT_API_URL retornou o menu comercial incompleto.",
      true
    );
  }

  return [
    { id: "inicio", title: "Inicio", path: "/" },
    {
      id: "categorias",
      title: "Categorias",
      items: categorias.map((category) => ({
        id: String(category.id),
        title: category.title,
        path: `/categorias/${encodeURIComponent(
          friendlyPersonalizedParam(category.id, category.title)
        )}`,
      })),
    },
    {
      id: "brindes",
      title: "Tipos de produtos",
      path: "/brindes-para-empresas",
      items: tipos.map((tipo) => ({
        id: String(tipo.id),
        title: tipo.title,
        path: `/brindes-para-empresas/${encodeURIComponent(
          friendlyPersonalizedParam(tipo.id, tipo.title)
        )}`,
      })),
    },
    {
      id: "lancamentos",
      title: "Lançamentos",
      path: "/lancamentos",
    },
    {
      id: "publicos",
      title: "Publicos alvos",
      items: publicos.map((publico) => ({
        id: String(publico.id),
        title: publico.title,
        path: `/publicos-alvos/${encodeURIComponent(
          friendlyParam(publico.id, publico.title)
        )}`,
      })),
    },
    {
      id: "datas",
      title: "Datas promocionais",
      items: datas.map((data) => ({
        id: String(data.id),
        title: data.title,
        path: `/datas-promocionais/${encodeURIComponent(
          friendlyParam(data.id, data.title)
        )}`,
      })),
    },
  ];
};
