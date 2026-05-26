import shopData from "@/components/Shop/shopData";
import categoryData from "@/components/Home/Categories/categoryData";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
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
  id_subcategoria: number;
  subcategoria: string;
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
  exactProduct?: Product | null;
};

type DataPromocionalApi = {
  id_data_promocional: number;
  data_promocional: string;
  data?: string | null;
  descricao?: string | null;
  ordem?: number | null;
  habilitado?: ApiFlag;
};

type DataPromocionalProdutoApi = {
  id_data_promocional: number;
  id_produto: number;
};

type SubcategoriaProdutoApi = {
  id_empresa?: number;
  id_subcategoria: number;
  id_produto: number;
};

const API_BASE_PATH = "/api/v1";
const mockProdutos: ProdutoApi[] = shopData.map((product, index) => ({
  id_produto: product.id,
  id_tipo_produto: index % 4,
  produto: product.title,
  descricao: product.description,
  codigo: `PEP-${String(product.id).padStart(4, "0")}`,
  altura: product.specs.find((spec) => /altura|capacidade/i.test(spec.label))?.value,
  largura: product.specs.find((spec) => /largura/i.test(spec.label))?.value,
  profundidade: product.specs.find((spec) => /profundidade/i.test(spec.label))?.value,
  peso: product.specs.find((spec) => /peso/i.test(spec.label))?.value,
  imagem: product.imgs.previews[0],
  data_inclusao: new Date(Date.UTC(2026, 0, 1) - index * 86400000).toISOString(),
  obs: product.shortDescription,
  site: "S",
  lancamento: index < 3 ? "S" : "N",
  promocao: index % 3 === 0 ? "S" : "N",
  premium: product.badge === "Premium" || index % 5 === 0 ? "S" : "N",
  habilitado: "S",
}));

const mockCategorias = categoryData.map((category, index) => ({
  id_categoria: index + 1,
  categoria: category.title,
  descricao: null,
  habilitado: "S",
}));

const categoryIcon = (index: number) =>
  categoryData[index % categoryData.length]?.img || "/images/categories/categories-01.png";

const mockTiposProdutos = [
  { id_tipo_produto: 1, tipo_produto: "Mochilas e bolsas", habilitado: "S" },
  { id_tipo_produto: 2, tipo_produto: "Garrafas e copos", habilitado: "S" },
  { id_tipo_produto: 3, tipo_produto: "Escritorio", habilitado: "S" },
  { id_tipo_produto: 4, tipo_produto: "Tecnologia", habilitado: "S" },
];

const mockPublicosAlvos = [
  { id_publico_alvo: 1, publico_alvo: "Corporativo", ordem: 1, habilitado: "S" },
  { id_publico_alvo: 2, publico_alvo: "Eventos", ordem: 2, habilitado: "S" },
  { id_publico_alvo: 3, publico_alvo: "Colaboradores", ordem: 3, habilitado: "S" },
];

const mockDatasPromocionais = [
  { id_data_promocional: 1, data_promocional: "Dia das Maes", ordem: 1, habilitado: "S" },
  { id_data_promocional: 2, data_promocional: "Dia dos Pais", ordem: 2, habilitado: "S" },
  { id_data_promocional: 3, data_promocional: "Black Friday", ordem: 3, habilitado: "S" },
];

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
const parseIdList = (value?: string) =>
  (value || "")
    .split(",")
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0);

const apiBaseUrl = () => (process.env.NEXT_API_URL || "").replace(/\/$/, "");

export const buildRawApiUrl = (path: string) => {
  const base = apiBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return base ? `${base}${cleanPath}` : cleanPath;
};

export const buildApiUrl = (path: string) => {
  const base = apiBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (!base) {
    return "";
  }

  if (cleanPath === "/health" || cleanPath.startsWith(API_BASE_PATH)) {
    return `${base}${cleanPath}`;
  }

  return `${base}${API_BASE_PATH}${cleanPath}`;
};

const apiRequest = async (path: string, init: RequestInit = {}) => {
  const url = buildApiUrl(path);

  if (!url) {
    return null;
  }

  try {
    const method = (init.method || "GET").toUpperCase();
    const isGet = method === "GET";
    const response = await fetch(url, {
      ...init,
      cache: isGet ? undefined : "no-store",
      next: isGet ? { revalidate: 300 } : undefined,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
        ...(init.headers || {}),
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
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
  maxPages = 80
): Promise<T[] | null> {
  const separator = path.includes("?") ? "&" : "?";
  const firstPayload = await apiRequest(`${path}${separator}page=1&limit=${pageSize}`);

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
      const payload = await apiRequest(`${path}${separator}page=${page}&limit=${pageSize}`);
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
  pageSize = 100
): Promise<T[] | null> {
  for (const path of paths) {
    const data = await apiFetchAllPages<T>(path, pageSize);

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
    : "/images/logo/logo.svg";

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
      ? "Lancamento"
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
    badge,
    dataInclusao: product.data_inclusao || undefined,
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

const fetchRemainingCatalogItems = async (
  endpoint: string,
  params: URLSearchParams,
  firstItems: ProdutoApi[],
  total = firstItems.length,
  totalPages = 1,
  limit = 100
) => {
  let items = firstItems;
  const safeTotalPages = Math.max(Number(totalPages || 1), 1);
  const restPages = Array.from(
    { length: Math.max(safeTotalPages - 1, 0) },
    (_, index) => index + 2
  );

  if (restPages.length) {
    const restItems = await Promise.all(
      restPages.map(async (nextPage) => {
        const pageParams = new URLSearchParams(params);
        pageParams.set("page", String(nextPage));
        const pagePayload = await apiRequest(`${endpoint}?${pageParams.toString()}`);
        const pageData =
          pagePayload && typeof pagePayload === "object" && "data" in pagePayload
            ? (pagePayload.data as { items?: ProdutoApi[] })
            : null;

        return pageData?.items || [];
      })
    );

    items = [...items, ...restItems.flat()];
  }

  if (Number(total || 0) > items.length && safeTotalPages <= 1) {
    const wideParams = new URLSearchParams(params);
    wideParams.set("page", "1");
    wideParams.set("limit", String(Math.min(Math.max(Number(total), limit), 500)));
    const widePayload = await apiRequest(`${endpoint}?${wideParams.toString()}`);
    const wideData =
      widePayload && typeof widePayload === "object" && "data" in widePayload
        ? (widePayload.data as { items?: ProdutoApi[] })
        : null;

    if ((wideData?.items?.length || 0) > items.length) {
      items = wideData?.items || items;
    }
  }

  return items;
};

export async function getCatalogoCategoria(
  idCategoria = 1,
  query: CatalogoProdutosQuery = {}
): Promise<CatalogoProdutos> {
  const page = 1;
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
    const fallback = await getProdutos(limit);

    return {
      categoria: {
        id_empresa: 1,
        id_categoria: idCategoria,
        categoria: "Brindes",
        descricao: null,
        icon: null,
        habilitado: "S",
        url_capa: null,
      },
      filtros: emptyCatalogoFiltros,
      items: fallback,
      total: fallback.length,
      page,
      limit,
      totalPages: 1,
    };
  }

  const categoryName = data.categoria?.categoria;
  const reportedTotal = Number(data.total || 0);
  const allItems = await fetchRemainingCatalogItems(
    `/categorias/${encodeURIComponent(String(idCategoria))}/catalogo`,
    params,
    data.items || [],
    reportedTotal,
    Number(data.totalPages || 1),
    limit
  );
  const selectedDataIds = parseIdList(query.datas_promocionais || query.data_promocional);
  const dataProductIds = selectedDataIds.length
    ? await getProdutosIdsByDatasPromocionais(selectedDataIds)
    : null;
  const dataProductSet = dataProductIds ? new Set(dataProductIds) : null;
  const sourceItems =
    dataProductSet && allItems.length
      ? allItems.filter((product) => dataProductSet.has(product.id_produto))
      : allItems;

  return {
    categoria: data.categoria || null,
    filtros: {
      subcategorias: data.filtros?.subcategorias || [],
      publicos_alvos: data.filtros?.publicos_alvos || [],
      datas_promocionais: data.filtros?.datas_promocionais || [],
      quantidade_minima:
        data.filtros?.quantidade_minima || emptyCatalogoFiltros.quantidade_minima,
    },
    items: sourceItems.map((product) =>
      mapApiProdutoToProduct(product, [], categoryName)
    ),
    total:
      dataProductSet && allItems.length
        ? sourceItems.length
        : Number(reportedTotal || sourceItems.length || 0),
    page,
    limit: sourceItems.length || Number(data.limit || limit),
    totalPages: 1,
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
  const titulo = data?.publico_alvo?.publico_alvo || "Publico-alvo";
  const dataWithAllItems = data
    ? {
        ...data,
        items: await fetchRemainingCatalogItems(
          `/publicos-alvos/${encodeURIComponent(String(idPublicoAlvo))}/catalogo`,
          params,
          data.items || [],
          Number(data.total || 0),
          Number(data.totalPages || 1),
          limit
        ),
        page: 1,
        totalPages: 1,
      }
    : null;
  const mapped = mapCatalogDataToProdutos({
    data: dataWithAllItems,
    page: 1,
    limit,
    fallbackTitle: titulo,
    fallbackDescription: data?.publico_alvo?.descricao || null,
    fallbackId: idPublicoAlvo,
  });

  if (mapped) {
    return mapped;
  }

  const fallback = await getProdutos(limit);

  return {
    categoria: {
      id_empresa: 1,
      id_categoria: idPublicoAlvo,
      categoria: titulo,
      descricao: null,
      icon: null,
      habilitado: "S",
      url_capa: null,
    },
    filtros: emptyCatalogoFiltros,
    items: fallback,
    total: fallback.length,
    page,
    limit,
    totalPages: 1,
  };
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
  const titulo = data?.data_promocional?.data_promocional || "Data promocional";
  const dataWithAllItems = data
    ? {
        ...data,
        items: await fetchRemainingCatalogItems(
          `/datas-promocionais/${encodeURIComponent(String(idDataPromocional))}/catalogo`,
          params,
          data.items || [],
          Number(data.total || 0),
          Number(data.totalPages || 1),
          limit
        ),
        page: 1,
        totalPages: 1,
      }
    : null;
  const mapped = mapCatalogDataToProdutos({
    data: dataWithAllItems,
    page: 1,
    limit,
    fallbackTitle: titulo,
    fallbackDescription: data?.data_promocional?.descricao || null,
    fallbackId: idDataPromocional,
  });

  if (mapped) {
    return mapped;
  }

  const fallback = await getProdutos(limit);

  return {
    categoria: {
      id_empresa: 1,
      id_categoria: idDataPromocional,
      categoria: titulo,
      descricao: null,
      icon: null,
      habilitado: "S",
      url_capa: null,
    },
    filtros: emptyCatalogoFiltros,
    items: fallback,
    total: fallback.length,
    page,
    limit,
    totalPages: 1,
  };
}

export async function getCatalogoTipoProduto(
  idTipoProduto = 12,
  query: Pick<CatalogoProdutosQuery, "empresaId"> = {}
): Promise<CatalogoTipoProduto> {
  const limit = 100;
  const params = new URLSearchParams({
    empresaId: String(query.empresaId || 1),
    page: "1",
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

  if (!firstData) {
    const fallback = await getProdutos(limit);

    return {
      tipo_produto: {
        id_empresa: 1,
        id_tipo_produto: idTipoProduto,
        tipo_produto: "Brindes para empresas",
        descricao: null,
        habilitado: "S",
      },
      filtros: emptyCatalogoFiltros,
      items: fallback,
      total: fallback.length,
      page: 1,
      limit,
      totalPages: 1,
    };
  }

  const totalPages = Math.max(Number(firstData.totalPages || 1), 1);
  const restPages = Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => index + 2);
  const restItems = await Promise.all(
    restPages.map(async (page) => {
      const pageParams = new URLSearchParams(params);
      pageParams.set("page", String(page));
      const payload = await apiRequest(
        `/tipos-produtos/${encodeURIComponent(String(idTipoProduto))}/catalogo?${pageParams.toString()}`
      );
      const data =
        payload && typeof payload === "object" && "data" in payload
          ? (payload.data as { items?: ProdutoApi[] })
          : null;

      return data?.items || [];
    })
  );
  const tipoNome = firstData.tipo_produto?.tipo_produto;
  const items = [...(firstData.items || []), ...restItems.flat()];

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
    page: 1,
    limit: items.length || limit,
    totalPages: 1,
  };
}

export async function getCatalogoCategorias(): Promise<CatalogoOption[]> {
  const categorias =
    (await fetchAllFirstAvailable<(typeof mockCategorias)[number]>([
      "/categorias",
      "/produtos/categorias",
    ], 100)) || mockCategorias;

  return categorias
    .filter((category) => isEnabled(category.habilitado))
    .sort(sortByOrderAndName("categoria"))
    .map((category) => ({
      id: Number(category.id_categoria),
      title: String(category.categoria),
    }))
    .filter((category) => Number.isFinite(category.id) && category.title);
}

export async function getDatasPromocionais(): Promise<CatalogoOption[]> {
  const datas =
    (await fetchAllFirstAvailable<DataPromocionalApi>([
      "/datas-promocionais",
    ], 10)) || mockDatasPromocionais;

  return datas
    .filter((data) => isEnabled(data.habilitado))
    .sort(sortByOrderAndName("data_promocional"))
    .map((data) => ({
      id: Number(data.id_data_promocional),
      title: String(data.data_promocional),
    }))
    .filter((data) => Number.isFinite(data.id) && data.title);
}

export async function getPublicosAlvos(): Promise<CatalogoOption[]> {
  const publicos =
    (await fetchAllFirstAvailable<(typeof mockPublicosAlvos)[number]>([
      "/publicos-alvos",
      "/publicos_alvos",
      "/publicos-alvo",
    ], 100)) || mockPublicosAlvos;

  return publicos
    .filter((publico) => isEnabled(publico.habilitado))
    .sort(sortByOrderAndName("publico_alvo"))
    .map((publico) => ({
      id: Number(publico.id_publico_alvo),
      title: String(publico.publico_alvo),
    }))
    .filter((publico) => Number.isFinite(publico.id) && publico.title);
}

export async function getProdutosIdsByDatasPromocionais(
  ids: number[]
): Promise<number[]> {
  const uniqueIds = Array.from(new Set(ids)).filter((id) => Number.isFinite(id) && id > 0);

  if (!uniqueIds.length) {
    return [];
  }

  const groups = await Promise.all(
    uniqueIds.map(async (id) => {
      const produtos = await apiFetchAllPages<DataPromocionalProdutoApi>(
        `/datas-promocionais/${encodeURIComponent(String(id))}/produtos`,
        100,
        50
      );

      return produtos || [];
    })
  );

  return Array.from(
    new Set(
      groups
        .flat()
        .map((item) => Number(item.id_produto))
        .filter((id) => Number.isFinite(id) && id > 0)
    )
  );
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

  return produtos
    .filter((product) => isEnabled(product.habilitado) && isEnabled(product.site))
    .map((product) => mapApiProdutoToProduct(product))
    .slice(0, limit);
}

export async function searchProdutosSite(query: string, limit = 10): Promise<Product[]> {
  const result = await searchProdutosSiteWithDestination(query, limit);
  return result.products;
}

export async function searchProdutosSiteAll(query: string): Promise<Product[]> {
  const search = query.trim();

  if (!search) {
    return [];
  }

  const produtos =
    (await apiFetchAllPages<ProdutoApi>(
      `/produtos/site/busca?q=${encodeURIComponent(search)}`,
      100,
      80
    )) || [];

  return produtos
    .filter((product) => isEnabled(product.habilitado) && isEnabled(product.site))
    .map((product) => mapApiProdutoToProduct(product));
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

export async function getProdutosIdsBySubcategoria(idSubcategoria: number): Promise<number[]> {
  const produtos = await apiFetchAllPages<SubcategoriaProdutoApi>(
    `/subcategorias/${encodeURIComponent(String(idSubcategoria))}/produtos`,
    100,
    50
  );

  return Array.from(
    new Set(
      (produtos || [])
        .map((item) => Number(item.id_produto))
        .filter((id) => Number.isFinite(id) && id > 0)
    )
  );
}

export async function getCatalogoSubcategoriaProdutos(
  idSubcategoria: number,
  subcategoriaNome = "Subcategoria"
): Promise<CatalogoProdutos> {
  const ids = await getProdutosIdsBySubcategoria(idSubcategoria);
  const allProducts = await getProdutosForSitemap(10000);
  const byId = new Map(allProducts.map((product) => [product.id, product]));
  const missingIds = ids.filter((id) => !byId.has(id));
  const missingProducts = await Promise.all(missingIds.map((id) => getProdutoById(id)));

  missingProducts.forEach((product) => {
    if (product) {
      byId.set(product.id, product);
    }
  });

  const items = ids.map((id) => byId.get(id)).filter(Boolean) as Product[];
  const quantities = items
    .map((item) => Number(item.quantidadeMinima || 0))
    .filter((value) => Number.isFinite(value) && value > 0);

  return {
    categoria: {
      id_empresa: 1,
      id_categoria: idSubcategoria,
      categoria: subcategoriaNome,
      descricao: null,
      icon: null,
      habilitado: "S",
      url_capa: null,
    },
    filtros: {
      subcategorias: [
        {
          id_subcategoria: idSubcategoria,
          subcategoria: subcategoriaNome,
          total: ids.length || items.length,
        },
      ],
      publicos_alvos: [],
      datas_promocionais: [],
      quantidade_minima: {
        min: quantities.length ? Math.min(...quantities) : 0,
        max: quantities.length ? Math.max(...quantities) : 0,
      },
    },
    items,
    total: ids.length || items.length,
    page: 1,
    limit: items.length || 100,
    totalPages: 1,
  };
}

export async function getCatalogoSubcategoria(
  idSubcategoria: number,
  query: Pick<CatalogoProdutosQuery, "empresaId"> & { idCategoria?: number } = {}
): Promise<CatalogoTipoProduto> {
  const limit = 100;
  const params = new URLSearchParams({
    empresaId: String(query.empresaId || 1),
    page: "1",
    limit: String(limit),
  });
  const firstPayload = await apiRequest(
    `/subcategorias/${encodeURIComponent(String(idSubcategoria))}/catalogo?${params.toString()}`
  );
  const firstData =
    firstPayload && typeof firstPayload === "object" && "data" in firstPayload
      ? (firstPayload.data as {
          subcategoria?: CatalogoSubcategoria | null;
          filtros?: Partial<CatalogoFiltros>;
          items?: ProdutoApi[];
          total?: number;
          page?: number;
          limit?: number;
          totalPages?: number;
        })
      : null;

  if (firstData) {
    const totalPages = Math.max(Number(firstData.totalPages || 1), 1);
    const restPages = Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => index + 2);
    const restItems = await Promise.all(
      restPages.map(async (page) => {
        const pageParams = new URLSearchParams(params);
        pageParams.set("page", String(page));
        const payload = await apiRequest(
          `/subcategorias/${encodeURIComponent(String(idSubcategoria))}/catalogo?${pageParams.toString()}`
        );
        const data =
          payload && typeof payload === "object" && "data" in payload
            ? (payload.data as { items?: ProdutoApi[] })
            : null;

        return data?.items || [];
      })
    );
    const subcategoriaNome = firstData.subcategoria?.subcategoria || "Subcategoria";
    const items = [...(firstData.items || []), ...restItems.flat()];

    return {
      tipo_produto: {
        id_empresa: 1,
        id_tipo_produto: idSubcategoria,
        tipo_produto: subcategoriaNome,
        descricao: null,
        habilitado: "S",
      },
      filtros: {
        subcategorias: firstData.filtros?.subcategorias || [],
        publicos_alvos: firstData.filtros?.publicos_alvos || [],
        datas_promocionais: firstData.filtros?.datas_promocionais || [],
        quantidade_minima:
          firstData.filtros?.quantidade_minima || emptyCatalogoFiltros.quantidade_minima,
      },
      items: items.map((product) => mapApiProdutoToProduct(product, [], subcategoriaNome)),
      total: Number(firstData.total || items.length),
      page: 1,
      limit: items.length || limit,
      totalPages: 1,
    };
  }

  if (query.idCategoria) {
    const catalogo = await getCatalogoCategoria(query.idCategoria, {
      empresaId: query.empresaId || 1,
      page: 1,
      limit,
      subcategorias: String(idSubcategoria),
    });
    const subcategoriaNome =
      catalogo.filtros.subcategorias.find((item) => item.id_subcategoria === idSubcategoria)
        ?.subcategoria || catalogo.items[0]?.category || "Subcategoria";

    return {
      tipo_produto: {
        id_empresa: 1,
        id_tipo_produto: idSubcategoria,
        tipo_produto: subcategoriaNome,
        descricao: catalogo.categoria?.descricao || null,
        habilitado: "S",
      },
      filtros: catalogo.filtros,
      items: catalogo.items,
      total: catalogo.total,
      page: catalogo.page,
      limit: catalogo.limit,
      totalPages: catalogo.totalPages,
    };
  }

  const fallback = await getProdutos(limit);

  return {
    tipo_produto: {
      id_empresa: 1,
      id_tipo_produto: idSubcategoria,
      tipo_produto: "Brindes para empresas",
      descricao: null,
      habilitado: "S",
    },
    filtros: emptyCatalogoFiltros,
    items: fallback,
    total: fallback.length,
    page: 1,
    limit,
    totalPages: 1,
  };
}

export async function searchProdutosSiteWithDestination(
  query: string,
  limit = 10
): Promise<SearchProdutosSiteResult> {
  const search = query.trim();

  if (!search) {
    return { products: [], destinoBusca: null };
  }

  const payload = await apiRequest(
    `/produtos/site/busca?q=${encodeURIComponent(
      search
    )}&empresaId=1&page=1&limit=${limit}`
  );
  const data =
    payload && typeof payload === "object" && "data" in payload
      ? (payload.data as {
          items?: ProdutoApi[];
          destino_busca?: SearchDestinationApi | null;
          match_exato_codigo?: boolean;
          id_produto?: number;
          codigo?: string;
        })
      : null;

  if (data?.match_exato_codigo && data.id_produto) {
    const exactProduct = await getProdutoById(Number(data.id_produto));

    return {
      products: exactProduct ? [exactProduct] : [],
      destinoBusca: null,
      exactProduct,
    };
  }

  const produtos = data?.items || [];
  const normalizedSearch = slugify(search);

  const products = produtos
    .map((product) => mapApiProdutoToProduct(product))
    .sort((a, b) => {
      const aTitle = slugify(a.title);
      const bTitle = slugify(b.title);
      const aStartsWithTitle = aTitle.startsWith(normalizedSearch);
      const bStartsWithTitle = bTitle.startsWith(normalizedSearch);

      if (aStartsWithTitle !== bStartsWithTitle) {
        return aStartsWithTitle ? -1 : 1;
      }

      return a.title.localeCompare(b.title, "pt-BR", { sensitivity: "base" });
    })
    .slice(0, limit);

  return {
    products,
    destinoBusca: data?.destino_busca || null,
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

export async function getRelatedProducts(product: Product, limit = 4) {
  const products = await getProdutosSite(100);

  return products
    .filter((item) => item.id !== product.id)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, limit);
}

export async function getProductSections() {
  const products = await getProdutosSite(100);
  const stats = await fetchFirstAvailable<{ mais_orcados?: ProdutoRankingApi[] }>([
    "/estatisticas/produtos",
    "/produtos/estatisticas",
    "/estatisticas-produtos",
  ]);
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

  const recent = [...products].sort(
    (a, b) =>
      new Date(b.dataInclusao || 0).getTime() -
      new Date(a.dataInclusao || 0).getTime()
  );

  const sectionFallback = (items: Product[], offset = 0) =>
    (items.length ? items : products.slice(offset, offset + 8)).slice(0, 8);

  return [
    {
      id: "recentes",
      eyebrow: "Novidades",
      title: "Produtos mais recentes",
      products: sectionFallback(recent),
    },
    {
      id: "mais-orcados",
      eyebrow: "Mais Pedidos",
      title: "Mais Procurados",
      products: sectionFallback(mostQuoted || [], 1),
    },
    {
      id: "lancamentos",
      eyebrow: "Lançamentos",
      title: "Lançamentos",
      products: sectionFallback(products.filter((product) => product.lancamento), 2),
    },
    {
      id: "promocao",
      eyebrow: "Promoção",
      title: "Produtos em promoção",
      products: sectionFallback(products.filter((product) => product.promocao), 3),
    },
    {
      id: "premium",
      eyebrow: "Linha premium",
      title: "Produtos premium",
      products: sectionFallback(products.filter((product) => product.premium), 4),
    },
  ];
}

export async function getHomeCategories(): Promise<Category[]> {
  const categorias =
    (await fetchAllFirstAvailable<(typeof mockCategorias)[number]>([
      "/categorias",
      "/produtos/categorias",
    ], 100)) || mockCategorias;

  return categorias
    .filter((category) => isEnabled(category.habilitado))
    .map((category, index) => ({
      id: Number(category.id_categoria),
      title: String(category.categoria),
      img: safeImageSrc(
        "url_capa" in category ? category.url_capa : null,
        ""
      ),
    }));
}

export async function getActiveBanners(tipo?: BannerTipo): Promise<BannerApi[]> {
  const query = tipo ? `?tipo=${encodeURIComponent(tipo)}` : "";
  const banners = (await apiFetchAllPages<BannerApi>(`/banners/ativos${query}`, 100)) || [];

  return banners
    .filter((banner) => banner.habilitado === "S" && isValidImageSrc(banner.url_banner))
    .filter((banner) => (tipo ? banner.tipo === tipo : true))
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
}

const toMenuItems = <T extends Record<string, unknown>>(
  data: T[],
  idKey: keyof T,
  titleKey: keyof T,
  filterKey: string
) =>
  data
    .filter((item) => isEnabled(item.habilitado as ApiFlag))
    .map((item) => ({
      id: String(item[idKey]),
      title: String(item[titleKey]),
      path:
        filterKey === "categoria"
          ? `/categorias/${encodeURIComponent(
              friendlyParam(String(item[idKey]), String(item[titleKey]), "personalizados")
            )}`
        : filterKey === "publico"
            ? `/publicos-alvos/${encodeURIComponent(
                friendlyParam(String(item[idKey]), String(item[titleKey]))
              )}`
            : filterKey === "data"
              ? `/datas-promocionais/${encodeURIComponent(
                  friendlyParam(String(item[idKey]), String(item[titleKey]))
                )}`
              : filterKey === "tipo"
                ? `/brindes-para-empresas/${encodeURIComponent(
                    friendlyPersonalizedParam(String(item[idKey]), String(item[titleKey]))
                  )}`
              : "/brindes-personalizados",
    }));

export async function getMenuGroups(): Promise<ApiMenuGroup[]> {
  const [categorias, tipos, publicos, datas] = await Promise.all([
    getCatalogoCategorias(),
    fetchAllFirstAvailable<(typeof mockTiposProdutos)[number]>([
      "/tipos-produtos/habilitados",
      "/tipos_produtos/habilitados",
      "/tiposProdutos/habilitados",
    ], 100),
    getPublicosAlvos(),
    getDatasPromocionais(),
  ]);

  return [
    { id: "inicio", title: "Inicio", path: "/" },
    {
      id: "categorias",
      title: "Categorias",
      items: categorias.map((category) => ({
        id: String(category.id),
        title: category.title,
        path: `/categorias/${encodeURIComponent(
          friendlyParam(category.id, category.title, "personalizados")
        )}`,
      })),
    },
    {
      id: "brindes",
      title: "Brindes",
      path: "/brindes-para-empresas",
      items: toMenuItems(tipos || mockTiposProdutos, "id_tipo_produto", "tipo_produto", "tipo"),
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
}
