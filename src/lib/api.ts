import shopData from "@/components/Shop/shopData";
import categoryData from "@/components/Home/Categories/categoryData";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { isValidImageSrc, safeImageSrc } from "@/lib/images";

type ApiFlag = "S" | "N" | string | null | undefined;

export type ProdutoApi = {
  id_produto: number;
  id_tipo_produto?: number;
  produto: string;
  descricao?: string | null;
  codigo?: string | null;
  altura?: string | null;
  largura?: string | null;
  profundidade?: string | null;
  peso?: string | null;
  imagem?: string | null;
  data_inclusao?: string | null;
  obs?: string | null;
  site?: ApiFlag;
  lancamento?: ApiFlag;
  promocao?: ApiFlag;
  premium?: ApiFlag;
  habilitado?: ApiFlag;
  cod_forn?: string | null;
  imagens?: ProdutoImageApi[];
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

const API_BASE_PATH = "/api/v1";
const REQUEST_TIMEOUT_MS = 8000;

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
  data_inclusao: new Date(Date.now() - index * 86400000).toISOString(),
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

export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const isEnabled = (value?: ApiFlag) => !value || value === "S";
const isYes = (value?: ApiFlag) => value === "S" || value === "s";

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
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
        ...(init.headers || {}),
      },
      next: init.method && init.method !== "GET" ? undefined : { revalidate: 300 },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
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

export const mapApiProdutoToProduct = (
  product: ProdutoApi,
  images: ProdutoImageApi[] = []
): Product => {
  const mock = shopData[(product.id_produto - 1) % shopData.length];
  const productImages = product.imagens?.length ? product.imagens : images;
  const apiPreviews = normalizeProductImages(product, productImages, "alta");
  const apiThumbs = normalizeProductImages(product, productImages, "thumb");
  const mainImage = normalizeImage(product, "alta");
  const mainThumb = normalizeImage(product, "thumb");
  const previews = uniqueValidImages(
    apiPreviews.length
      ? apiPreviews
      : [mainImage, ...mock.imgs.previews]
  );
  const thumbnails = uniqueValidImages(
    apiThumbs.length
      ? apiThumbs
      : [mainThumb, ...mock.imgs.thumbnails]
  );
  const title = product.produto || mock.title;
  const codigo = product.codigo || `PEP-${product.id_produto}`;
  const badge = isYes(product.promocao)
    ? "Promocao"
    : isYes(product.lancamento)
      ? "Lancamento"
      : isYes(product.premium)
        ? "Premium"
        : mock.badge;

  return {
    id: product.id_produto,
    codigo,
    idTipoProduto: product.id_tipo_produto,
    title,
    slug: `${product.id_produto}-${slugify(title)}`,
    category: mock.category,
    shortDescription: product.obs || product.descricao || mock.shortDescription,
    description: product.descricao || product.obs || mock.description,
    features: [
      product.codigo ? `Codigo ${product.codigo}` : "",
      product.altura ? `Altura: ${product.altura}` : "",
      product.largura ? `Largura: ${product.largura}` : "",
      product.peso ? `Peso: ${product.peso}` : "",
    ].filter(Boolean),
    specs: [
      { label: "Codigo", value: codigo },
      product.altura ? { label: "Altura", value: product.altura } : null,
      product.largura ? { label: "Largura", value: product.largura } : null,
      product.profundidade
        ? { label: "Profundidade", value: product.profundidade }
        : null,
      product.peso ? { label: "Peso", value: product.peso } : null,
    ].filter(Boolean) as Product["specs"],
    reviews: mock.reviews,
    price: 0,
    discountedPrice: 0,
    badge,
    dataInclusao: product.data_inclusao || undefined,
    lancamento: isYes(product.lancamento),
    promocao: isYes(product.promocao),
    premium: isYes(product.premium),
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
    (await apiFetchAllPages<ProdutoApi>("/produtos", pageSize, maxPages)) ||
    mockProdutos;

  return produtos
    .filter((product) => isEnabled(product.habilitado) && isEnabled(product.site))
    .map((product) => mapApiProdutoToProduct(product))
    .slice(0, limit);
}

export async function getProdutosForSitemap(limit = 5000): Promise<Product[]> {
  const produtos =
    (await apiFetchAllPages<ProdutoApi>("/produtos/site?empresaId=1", 500, 10)) ||
    mockProdutos;

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
    )) || mockProdutos.slice(0, limit);

  return produtos.map((product) => mapApiProdutoToProduct(product)).slice(0, limit);
}

export async function searchProdutosSite(query: string, limit = 10): Promise<Product[]> {
  const search = query.trim();

  if (!search) {
    return [];
  }

  const produtos =
    (await apiFetch<ProdutoApi[]>(
      `/produtos/site/busca?q=${encodeURIComponent(
        search
      )}&empresaId=1&page=1&limit=${limit}`
    )) || [];
  const normalizedSearch = slugify(search);

  return produtos
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
}

export async function getProdutoBySlug(slug: string): Promise<Product | null> {
  const id = Number(slug.match(/^(\d+)(?:-|$)/)?.[1] || slug.match(/-(\d+)$/)?.[1]);
  const normalizedSlug = slugify(slug.replace(/^\d+-?/, ""));

  if (id) {
    const product =
      (await apiFetchItem<ProdutoApi>(`/produtos/${id}`)) ||
      (await apiFetchItem<ProdutoApi>(`/produtos/site/${id}`));

    if (product?.id_produto) {
      const images = product.imagens?.length
        ? product.imagens
        : (await apiFetch<ProdutoImageApi[]>(`/produtos/${id}/images`)) || [];

      return mapApiProdutoToProduct(product, images);
    }
  }

  const searchTerm = normalizedSlug.replace(/-/g, " ");
  const searchedProducts = searchTerm
    ? await searchProdutosSite(searchTerm, 8)
    : [];
  const searchedProduct = searchedProducts.find(
    (product) =>
      product.id === id ||
      product.slug === slug ||
      slugify(product.title) === normalizedSlug
  );

  if (searchedProduct) {
    return searchedProduct;
  }

  const products = await getProdutos(100);

  return (
    products.find(
      (product) =>
        product.slug === slug ||
        product.id === id ||
        product.slug === `${id}-${normalizedSlug}` ||
        slugify(product.title) === normalizedSlug
    ) || null
  );
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
      eyebrow: "Mais pedidos",
      title: "Mais orcados",
      products: sectionFallback(mostQuoted || [], 1),
    },
    {
      id: "lancamentos",
      eyebrow: "Lancamentos",
      title: "Lancamentos",
      products: sectionFallback(products.filter((product) => product.lancamento), 2),
    },
    {
      id: "promocao",
      eyebrow: "Promocao",
      title: "Produtos em promocao",
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
        "icon" in category ? category.icon : null,
        categoryIcon(index)
      ),
    }));
}

export async function getActiveBanners(tipo?: BannerTipo): Promise<BannerApi[]> {
  const query = tipo ? `?tipo=${encodeURIComponent(tipo)}` : "";
  const banners = (await apiFetch<BannerApi[]>(`/banners/ativos${query}`)) || [];

  return banners
    .filter((banner) => banner.habilitado === "S" && isValidImageSrc(banner.url_banner))
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
      path: `/shop-with-sidebar?${filterKey}=${encodeURIComponent(String(item[idKey]))}`,
    }));

export async function getMenuGroups(): Promise<ApiMenuGroup[]> {
  const [categorias, tipos, publicos, datas] = await Promise.all([
    fetchAllFirstAvailable<(typeof mockCategorias)[number]>([
      "/categorias",
      "/produtos/categorias",
    ], 100),
    fetchAllFirstAvailable<(typeof mockTiposProdutos)[number]>([
      "/tipos-produtos",
      "/tipos_produtos",
      "/tiposProdutos",
    ], 100),
    fetchAllFirstAvailable<(typeof mockPublicosAlvos)[number]>([
      "/publicos-alvos",
      "/publicos_alvos",
      "/publicos-alvo",
    ], 100),
    fetchAllFirstAvailable<(typeof mockDatasPromocionais)[number]>([
      "/datas-promocionais",
      "/datas_promocionais",
    ], 100),
  ]);

  return [
    { id: "inicio", title: "Inicio", path: "/" },
    {
      id: "categorias",
      title: "Categorias",
      items: toMenuItems(categorias || mockCategorias, "id_categoria", "categoria", "categoria"),
    },
    {
      id: "brindes",
      title: "Brindes",
      items: toMenuItems(tipos || mockTiposProdutos, "id_tipo_produto", "tipo_produto", "tipo"),
    },
    {
      id: "publicos",
      title: "Publicos alvos",
      items: toMenuItems(publicos || mockPublicosAlvos, "id_publico_alvo", "publico_alvo", "publico"),
    },
    {
      id: "datas",
      title: "Datas promocionais",
      items: toMenuItems(datas || mockDatasPromocionais, "id_data_promocional", "data_promocional", "data"),
    },
  ];
}
