import { spawn } from "node:child_process";
import { createServer } from "node:http";

let apiPort = 0;
const sitePort = 32000 + Math.floor(Math.random() * 1000);
const requests = [];
let emptyCatalog = false;

const products = [
  {
    id_empresa: 1,
    id_produto: 1511,
    id_tipo_produto: 28,
    produto: "Garrafa de Metal com Parede Dupla de 350ml Personalizado",
    descricao: "Garrafa de metal com parede dupla e isolamento a vacuo.",
    codigo: "GT03",
    site: "S",
    habilitado: "S",
    quantidade_minima: 50,
    imagens: [],
  },
  {
    id_empresa: 1,
    id_produto: 7000,
    id_tipo_produto: 28,
    produto: "Garrafa Inox Parede Dupla 250ml para Brindes",
    descricao: "Garrafa inox com parede dupla.",
    codigo: "GT401",
    site: "S",
    habilitado: "S",
    quantidade_minima: 50,
    imagens: [],
  },
];

const umbrellaProducts = [
  ...Array.from({ length: 3 }, (_, index) => ({
    ...products[0],
    id_produto: 8000 + index,
    produto: `Guarda Chuva Personalizado ${index + 1}`,
    codigo: `GCH${index + 1}`,
  })),
  {
    ...products[0],
    id_produto: 9000,
    produto: "Mochila para Notebook Personalizada",
    descricao: "Possui bolso lateral para guarda chuva.",
    codigo: "MC405",
  },
];

const json = (response, status, payload) => {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
};

const api = createServer((request, response) => {
  const url = new URL(request.url || "/", `http://127.0.0.1:${apiPort}`);
  requests.push(url);

  if (url.pathname === "/api/v1/produtos/site/busca") {
    const query = url.searchParams.get("q");

    if (query === "falha tecnica") {
      return json(response, 503, {
        success: false,
        message: "falha controlada",
      });
    }

    if (query === "guarda chuva") {
      return json(response, 200, {
        success: true,
        data: {
          items: umbrellaProducts,
          total: 115,
          page: 1,
          limit: 40,
          totalPages: 3,
          mode: "advanced",
        },
      });
    }

    if (query === "catalogo amplo") {
      return json(response, 200, {
        success: true,
        data: {
          items: umbrellaProducts,
          total: 2040,
          page: 1,
          limit: 24,
          totalPages: 85,
          mode: "advanced",
        },
      });
    }

    if (query !== "compatibilidade legado") {
      return json(response, 200, {
        success: true,
        data: {
          items: products,
          total: products.length,
          page: 1,
          limit: 10,
          totalPages: 1,
          mode: "advanced",
        },
      });
    }

    return json(response, 200, {
      success: true,
      data: {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        mode: "legacy",
      },
    });
  }

  if (url.pathname === "/api/v1/produtos/site") {
    const items = emptyCatalog && !url.searchParams.has("busca") ? [] : products;

    return json(response, 200, {
      success: true,
      data: {
        items,
        total: items.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  }

  return json(response, 404, { success: false, message: "nao encontrado" });
});

const listen = (server, port) =>
  new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      const address = server.address();
      resolve(typeof address === "object" && address ? address.port : port);
    });
  });

const stopProcessTree = (child) => {
  if (!child?.pid) return;
  child.kill("SIGTERM");
};

const waitForSite = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(
        `http://127.0.0.1:${sitePort}/api/produtos/busca?q=health`,
      );
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("O servidor Next nao iniciou a tempo.");
};

let site;
let siteOutput = "";

try {
  apiPort = await listen(api, 0);
  site = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-p", String(sitePort)],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NEXT_API_URL: `http://127.0.0.1:${apiPort}`,
        NEXT_API_TOKEN: "",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  site.stdout?.on("data", (chunk) => {
    siteOutput += chunk.toString();
  });
  site.stderr?.on("data", (chunk) => {
    siteOutput += chunk.toString();
  });
  site.unref();

  await waitForSite();

  requests.length = 0;
  const response = await fetch(
    `http://127.0.0.1:${sitePort}/api/produtos/busca?q=Garrafa%20com%20parede%20dupla&limit=10`,
  );
  const payload = await response.json();
  const items = payload?.data?.items || [];
  const canonicalRequest = requests.find(
    (url) => url.pathname === "/api/v1/produtos/site/busca",
  );

  if (
    response.status !== 200 ||
    response.headers.get("cache-control") !== "no-store" ||
    response.headers.get("x-maggenta-data-source") !== `http://127.0.0.1:${apiPort}` ||
    items.length !== 2 ||
    items[0]?.codigo !== "GT03" ||
    items[1]?.codigo !== "GT401" ||
    canonicalRequest?.searchParams.get("q") !== "garrafa com parede dupla" ||
    canonicalRequest?.searchParams.get("limit") !== "10" ||
    requests.some((url) => url.pathname === "/api/v1/produtos/site")
  ) {
    throw new Error(
      `O contrato da busca falhou: status=${response.status} payload=${JSON.stringify(
        payload,
      )} requests=${requests.map((url) => url.toString()).join(",")} server=${siteOutput.slice(-2000)}`,
    );
  }
  requests.length = 0;
  const wideCatalogResponse = await fetch(
    `http://127.0.0.1:${sitePort}/api/produtos/catalogo?kind=search&q=catalogo%20amplo&page=1&limit=24`,
  );
  const wideCatalogPayload = await wideCatalogResponse.json();

  if (
    wideCatalogResponse.status !== 200 ||
    wideCatalogPayload?.items?.length !== umbrellaProducts.length ||
    wideCatalogPayload?.total !== 2040 ||
    wideCatalogPayload?.totalPages !== 85
  ) {
    throw new Error(
      `O frontend limitou o total devolvido pelo backend: status=${wideCatalogResponse.status} payload=${JSON.stringify(
        wideCatalogPayload,
      )}`,
    );
  }
  requests.length = 0;
  const relevantCatalogResponse = await fetch(
    `http://127.0.0.1:${sitePort}/api/produtos/catalogo?kind=search&q=guarda%20chuva&page=1&limit=40`,
  );
  const relevantCatalogPayload = await relevantCatalogResponse.json();
  const relevantRequest = requests.find(
    (url) =>
      url.pathname === "/api/v1/produtos/site/busca" &&
      url.searchParams.get("q") === "guarda chuva",
  );

  if (
    relevantCatalogResponse.status !== 200 ||
    relevantCatalogPayload?.items?.length !== 4 ||
    relevantCatalogPayload?.items?.[3]?.codigo !== "MC405" ||
    relevantCatalogPayload?.total !== 115 ||
    relevantCatalogPayload?.totalPages !== 3 ||
    relevantRequest?.searchParams.get("limit") !== "40"
  ) {
    throw new Error(
      `O espelhamento integral da busca falhou: status=${relevantCatalogResponse.status} payload=${JSON.stringify(
        relevantCatalogPayload,
      )}`,
    );
  }

  requests.length = 0;
  const legacyResponse = await fetch(
    `http://127.0.0.1:${sitePort}/api/produtos/busca?q=compatibilidade%20legado&limit=10`,
  );
  const legacyPayload = await legacyResponse.json();
  const legacyItems = legacyPayload?.data?.items || [];
  const legacyRequest = requests.find(
    (url) => url.pathname === "/api/v1/produtos/site",
  );

  if (
    legacyResponse.status !== 200 ||
    legacyItems.length !== 2 ||
    legacyRequest?.searchParams.get("busca") !== "compatibilidade legado"
  ) {
    throw new Error(
      `O fallback legado falhou: status=${legacyResponse.status} payload=${JSON.stringify(
        legacyPayload,
      )} requests=${requests.map((url) => url.toString()).join(",")}`,
    );
  }

  requests.length = 0;
  const catalogResponse = await fetch(
    `http://127.0.0.1:${sitePort}/api/produtos/catalogo?kind=products&page=1&limit=10`,
  );
  const catalogPayload = await catalogResponse.json();

  if (
    catalogResponse.status !== 200 ||
    catalogResponse.headers.get("cache-control") !== "no-store" ||
    catalogResponse.headers.get("x-maggenta-data-source") !==
      `http://127.0.0.1:${apiPort}` ||
    catalogPayload?.items?.length !== 2 ||
    catalogPayload?.total !== 2
  ) {
    throw new Error(
      `O catálogo não preservou os dados da API: status=${catalogResponse.status} payload=${JSON.stringify(
        catalogPayload,
      )}`,
    );
  }

  const failureResponse = await fetch(
    `http://127.0.0.1:${sitePort}/api/produtos/busca?q=falha%20tecnica&limit=10`,
  );
  const failurePayload = await failureResponse.json();

  if (
    failureResponse.status !== 502 ||
    failureResponse.headers.get("cache-control") !== "no-store" ||
    failurePayload?.success !== false
  ) {
    throw new Error(
      `A falha técnica da busca não foi propagada corretamente: status=${failureResponse.status} payload=${JSON.stringify(
        failurePayload,
      )}`,
    );
  }

  emptyCatalog = true;
  const emptyCatalogResponse = await fetch(
    `http://127.0.0.1:${sitePort}/api/produtos/catalogo?kind=products&page=1&limit=11`,
  );
  const emptyCatalogPayload = await emptyCatalogResponse.json();
  emptyCatalog = false;

  if (
    emptyCatalogResponse.status !== 502 ||
    emptyCatalogResponse.headers.get("cache-control") !== "no-store" ||
    emptyCatalogPayload?.success !== false
  ) {
    throw new Error(
      `O catálogo vazio foi tratado como sucesso: status=${emptyCatalogResponse.status} payload=${JSON.stringify(
        emptyCatalogPayload,
      )}`,
    );
  }

  console.log(
    "Search contract smoke passed: configured_origin_only=true advanced=2 legacy_fallback=2 catalog=2 backend_items_preserved=4 backend_total_preserved=115 total_above_250_preserved=2040 technical_failure=502 empty_catalog=502 no_store=true ranking_preserved=true",
  );
} finally {
  stopProcessTree(site);
  api.closeAllConnections?.();
  api.close();
}

process.exit(0);
