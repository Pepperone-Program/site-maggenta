import { spawn } from "node:child_process";
import { createServer } from "node:http";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

let apiPort = 0;
const sitePort = 32000 + Math.floor(Math.random() * 1000);
const requestedPaths = [];
let failOneTotal = true;

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
  subcategorias: [
    { ...subcategory, total: 0 },
    { ...subcategory, id_subcategoria: 196, subcategoria: "Subcategoria vazia", total: 0 },
    { ...subcategory, id_subcategoria: 197, subcategoria: "Outra subcategoria", total: 2 },
  ],
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

  if (url.pathname === "/api/v1/subcategorias/199") {
    return json(response, 200, { data: { ...subcategory, id_subcategoria: 199 } });
  }
  if (url.pathname === "/api/v1/subcategorias/199/produtos") {
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 24);
    const products = Array.from({ length: 50 }, (_, index) => ({
      ...product, id_produto: 9000 + index, produto: `Produto paginado ${index + 1}`,
    }));
    return json(response, 200, { data: {
      items: products.slice((page - 1) * limit, page * limit),
      total: products.length, page, limit, totalPages: Math.ceil(products.length / limit),
    } });
  }

  if (url.pathname === "/api/v1/categorias/48") return json(response, 200, { data: category });
  if (url.pathname === "/api/v1/categorias/48/subcategorias") {
    return json(response, 200, paginated([
      ...filters.subcategorias,
      { ...subcategory, id_subcategoria: 198, subcategoria: "Desabilitada", habilitado: "N" },
    ]));
  }
  if (url.pathname === "/api/v1/subcategorias/196/produtos") {
    return json(response, 200, { data: { items: [], total: 0, page: 1, limit: 1, totalPages: 0 } });
  }
  if (url.pathname === "/api/v1/subcategorias/197/produtos") {
    return failOneTotal ? json(response, 404, { success: false }) :
      json(response, 200, { data: { items: [product], total: 19, page: 1, limit: 1, totalPages: 19 } });
  }

  if (request.method === "GET" && url.pathname === "/api/v1/subcategorias/195") {
    return json(response, 200, { success: true, data: subcategory });
  }

  if (request.method === "GET" && url.pathname === "/api/v1/subcategorias/195/produtos") {
    return json(response, 200, {
      success: true,
      data: {
        items: [product],
        total: 1,
        page: Number(url.searchParams.get("page") || 1),
        limit: Number(url.searchParams.get("limit") || 24),
        totalPages: 1,
      },
    });
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
let browser;
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
      windowsHide: true,
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
  const paginatedHtml = await (await fetch(
    `http://127.0.0.1:${sitePort}/subcategorias/199-baldes-de-gelo-personalizado?categoria=48`
  )).text();
  assert.ok(paginatedHtml.includes('"subcategoryId":199') || paginatedHtml.includes('\\"subcategoryId\\":199'));
  const loadedIds = new Set();
  for (const page of [1, 2, 3]) {
    const response = await fetch(`http://127.0.0.1:${sitePort}/api/produtos/catalogo?kind=subcategory&id=199&categoria=48&subcategorias=199&page=${page}&limit=24&publicos_alvos=7&quantidade_minima_min=10&datas_promocionais=8`);
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.page, page);
    assert.equal(data.total, 50);
    assert.equal(data.totalPages, 3);
    assert.equal(data.items.length, page === 3 ? 2 : 24);
    data.items.forEach(item => loadedIds.add(item.id));
    assert.ok(requestedPaths.some(path => {
      const url = new URL(path, "http://localhost");
      return url.pathname === "/api/v1/subcategorias/199/produtos"
        && url.searchParams.get("page") === String(page)
        && url.searchParams.get("publicos_alvos") === "7"
        && url.searchParams.get("quantidade_minima_min") === "10"
        && url.searchParams.get("datas_promocionais") === "8";
    }));
  }
  assert.equal(loadedIds.size, 50);
  console.log("Subcategory pagination: 50 distinct products across three pages, with filters preserved.");
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

  if (
    !requestedPaths.some((path) =>
      path.startsWith("/api/v1/subcategorias/195/produtos?")
    )
  ) {
    throw new Error("O site nao consultou os produtos diretamente pela subcategoria.");
  }

  if (requestedPaths.some((path) => path.includes("/api/v1/categorias/48/catalogo?subcategorias=195"))) {
    throw new Error("O catalogo da subcategoria ainda depende do filtro de categoria.");
  }

  console.log(
    "Subcategory contract smoke passed: page=200 catalog=1 canonical=308 invalid=404 endpoint=products"
  );

  const totalsUrl = `http://127.0.0.1:${sitePort}/api/categorias/48/subcategorias/totais`;
  const initialCountReads = requestedPaths.filter(path => path.includes("/subcategorias/195/produtos?page=1&limit=1")).length;
  const firstTotals = (await (await fetch(totalsUrl)).json()).data;
  assert.deepEqual(firstTotals.sort((a, b) => a.id_subcategoria - b.id_subcategoria), [
    { id_subcategoria: 195, total: 1 },
    { id_subcategoria: 196, total: 0 },
    { id_subcategoria: 197, total: null },
  ]);
  failOneTotal = false;
  const recoveredTotals = (await (await fetch(totalsUrl)).json()).data;
  assert.equal(recoveredTotals.find(item => item.id_subcategoria === 197).total, 19);
  const countReads = requestedPaths.filter(path => path.includes("/subcategorias/195/produtos?page=1&limit=1"));
  assert.equal(countReads.length - initialCountReads, 1, "Successful totals must use the ten-minute cache");
  assert.ok(!requestedPaths.some(path => path.includes("/subcategorias/198/produtos")));
  assert.equal((await fetch(`http://127.0.0.1:${sitePort}/api/categorias/invalid/subcategorias/totais`)).status, 400);
  console.log("Subcategory totals: independent membership, real zero, unavailable count, recovery, disabled categories and cached reads passed.");

  if (process.env.MENU_PLAYWRIGHT_PATH) {
    const { chromium } = await import(pathToFileURL(process.env.MENU_PLAYWRIGHT_PATH).href);
    browser = await chromium.launch({ executablePath: process.env.MENU_BROWSER_PATH, headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.route("**/*", route => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
    const origin = `http://127.0.0.1:${sitePort}`;
    await page.goto(`${origin}/categorias/48-fabricacao-propria-personalizado?publicos_alvos=99`);
    const baldes = page.getByRole("button").filter({ hasText: "Baldes de Gelo" });
    await baldes.locator('[aria-label="1 produtos na subcategoria"]').waitFor();
    await page.getByRole("button").filter({ hasText: "Subcategoria vazia" }).locator('[aria-label="0 produtos na subcategoria"]').waitFor();
    await page.getByRole("button").filter({ hasText: "Outra subcategoria" }).locator('[aria-label="19 produtos na subcategoria"]').waitFor();
    await baldes.click();
    await page.waitForURL(/\/subcategorias\/195-/);
    await page.getByRole("button").filter({ hasText: "Baldes de Gelo" }).locator('[aria-label="1 produtos na subcategoria"]').waitFor();
    const before = requestedPaths.filter(path => path.includes("/subcategorias/197/produtos?")).length;
    await page.reload();
    await page.getByRole("button").filter({ hasText: "Outra subcategoria" }).locator('[aria-label="19 produtos na subcategoria"]').waitFor();
    assert.equal(requestedPaths.filter(path => path.includes("/subcategorias/197/produtos?")).length, before);
    console.log("Browser: sidebar shows totals 1/0/19 instead of category counts 0/0/2, independent of page filters and preserved on subcategory navigation/reload.");
  }
} finally {
  await browser?.close();
  stopProcess(site);
  api.closeAllConnections?.();
  api.close();
}

process.exit(0);
