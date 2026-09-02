import { spawn } from "node:child_process";
import { createServer } from "node:http";

let apiPort = 0;
const sitePort = 32000 + Math.floor(Math.random() * 1000);
const requestedPaths = [];

const json = (response, status, payload) => {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
};

const category = {
  id_empresa: 1,
  id_categoria: 48,
  categoria: "Fabricacao Propria",
  descricao: "Catalogo de teste",
  habilitado: "S",
};
const subcategory = {
  id_empresa: 1,
  id_categoria: 48,
  id_subcategoria: 195,
  subcategoria: "Baldes de Gelo",
  descricao: "Subcategoria de teste",
  habilitado: "S",
};
const product = {
  id_empresa: 1,
  id_produto: 8064,
  id_tipo_produto: 54,
  produto: "Balde de Gelo 5L Personalizavel",
  codigo: "BG001",
  quantidade_minima: 50,
  habilitado: "S",
  site: "S",
};
const filters = {
  subcategorias: [{ ...subcategory, total: 1 }],
  publicos_alvos: [],
  datas_promocionais: [],
  quantidade_minima: { min: 50, max: 50 },
};

const paginated = (items) => ({
  success: true,
  data: { items, total: items.length, page: 1, limit: 100, totalPages: 1 },
});

const api = createServer((request, response) => {
  const url = new URL(request.url || "/", `http://127.0.0.1:${apiPort}`);
  requestedPaths.push(`${url.pathname}${url.search}`);

  if (request.method === "GET" && url.pathname === "/api/v1/subcategorias/195") {
    return json(response, 200, { success: true, data: subcategory });
  }

  if (request.method === "GET" && url.pathname.startsWith("/api/v1/subcategorias/")) {
    return json(response, 404, { success: false, message: "Subcategoria nao encontrada" });
  }

  if (request.method === "GET" && url.pathname === "/api/v1/categorias/48/catalogo") {
    const selected = url.searchParams.get("subcategorias");
    const items = selected && selected !== "195" ? [] : [product];

    return json(response, 200, {
      success: true,
      data: {
        categoria: category,
        filtros: filters,
        items,
        total: items.length,
        page: Number(url.searchParams.get("page") || 1),
        limit: Number(url.searchParams.get("limit") || 24),
        totalPages: 1,
      },
    });
  }

  if (request.method === "GET" && url.pathname === "/api/v1/categorias") {
    return json(response, 200, paginated([category]));
  }

  if (request.method === "GET" && url.pathname === "/api/v1/publicos-alvos") {
    return json(response, 200, paginated([]));
  }

  if (request.method === "GET" && url.pathname === "/api/v1/datas-promocionais") {
    return json(response, 200, paginated([]));
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

const stopProcess = (child) => {
  if (child?.pid) child.kill("SIGTERM");
};

const waitForSite = async () => {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(
        `http://127.0.0.1:${sitePort}/api/produtos/catalogo?kind=category&categoria=48&page=1&limit=1`
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
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  site.stdout?.on("data", (chunk) => {
    siteOutput += chunk.toString();
  });
  site.stderr?.on("data", (chunk) => {
    siteOutput += chunk.toString();
  });
  site.unref();

  await waitForSite();

  const canonicalPath = "/subcategorias/195-baldes-de-gelo-personalizado";
  const pageResponse = await fetch(`http://127.0.0.1:${sitePort}${canonicalPath}`);
  const pageHtml = await pageResponse.text();

  if (
    pageResponse.status !== 200 ||
    !pageHtml.includes("Baldes de Gelo personalizado") ||
    !pageHtml.includes("Balde de Gelo 5L Personalizavel")
  ) {
    throw new Error(
      `A pagina da subcategoria nao renderizou o catalogo: status=${pageResponse.status} server=${siteOutput.slice(-2000)}`
    );
  }

  const filteredResponse = await fetch(
    `http://127.0.0.1:${sitePort}/api/produtos/catalogo?kind=category&categoria=48&subcategorias=195&page=1&limit=24`
  );
  const filteredPayload = await filteredResponse.json();

  if (
    filteredResponse.status !== 200 ||
    filteredPayload?.total !== 1 ||
    filteredPayload?.items?.[0]?.id !== 8064
  ) {
    throw new Error(`O endpoint interno nao preservou o filtro: ${JSON.stringify(filteredPayload)}`);
  }

  const oldSlugResponse = await fetch(
    `http://127.0.0.1:${sitePort}/subcategorias/195-slug-antigo?categoria=48`,
    { redirect: "manual" }
  );
  if (
    oldSlugResponse.status !== 308 ||
    oldSlugResponse.headers.get("location") !== `${canonicalPath}?categoria=48`
  ) {
    throw new Error("O slug antigo da subcategoria nao recebeu o redirect canonico esperado.");
  }

  const invalidResponse = await fetch(
    `http://127.0.0.1:${sitePort}/subcategorias/999999-inexistente`,
    { redirect: "manual" }
  );
  if (invalidResponse.status !== 404) {
    throw new Error(`Uma subcategoria inexistente retornou HTTP ${invalidResponse.status}.`);
  }

  if (requestedPaths.some((path) => path.startsWith("/api/v1/subcategorias/195/catalogo"))) {
    throw new Error("O site ainda consultou o endpoint inexistente de catalogo da subcategoria.");
  }

  console.log(
    "Subcategory contract smoke passed: page=200 catalog=1 canonical=308 invalid=404 endpoint=detail"
  );
} finally {
  stopProcess(site);
  api.closeAllConnections?.();
  api.close();
}

process.exit(0);
