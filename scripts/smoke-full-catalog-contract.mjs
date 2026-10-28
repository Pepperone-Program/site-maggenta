import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

const total = 133;
const requested = [];
const category = { id_empresa: 1, id_categoria: 1, categoria: "Gastronomia e Bar", habilitado: "S" };
const emptyFilters = { subcategorias: [], publicos_alvos: [], datas_promocionais: [], quantidade_minima: { min: 0, max: 0 } };
const json = (res, status, data) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(data)); };
const products = Array.from({ length: total }, (_, index) => ({
  id_produto: index + 1, produto: `Produto geral ${index + 1}`, codigo: `GERAL${index + 1}`,
  site: "S", habilitado: "S", quantidade_minima: 10,
  id_categoria: index % 2 ? 2 : 1, categoria: index % 2 ? "Tecnologia" : category.categoria,
}));
const api = createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  requested.push(url);
  if (url.pathname === "/api/v1/categorias") return json(res, 200, { data: [category, { ...category, id_categoria: 2, categoria: "Tecnologia" }] });
  if (url.pathname === "/api/v1/categorias/1") return json(res, 200, { data: category });
  if (["/api/v1/publicos-alvos", "/api/v1/datas-promocionais"].includes(url.pathname)) return json(res, 200, { data: [] });
  if (url.pathname === "/api/v1/tipos-produtos/habilitados") return json(res, 200, { data: [{ id_tipo_produto: 1, tipo_produto: "Brindes", habilitado: "S" }] });
  if (url.pathname === "/api/v1/produtos/site" || url.pathname === "/api/v1/categorias/1/catalogo") {
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 24);
    const isCategory = url.pathname.includes("/categorias/");
    const count = isCategory ? 78 : total;
    return json(res, 200, { data: {
      items: products.slice((page - 1) * limit, Math.min(page * limit, count)),
      total: count, page, limit, totalPages: Math.ceil(count / limit),
      ...(isCategory ? { categoria: category, filtros: emptyFilters } : {}),
    } });
  }
  return json(res, 404, { success: false });
});
await new Promise(resolve => api.listen(0, "127.0.0.1", resolve));
const port = 35000 + Math.floor(Math.random() * 1000);
const origin = `http://127.0.0.1:${port}`;
const site = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
  env: { ...process.env, NEXT_API_URL: `http://127.0.0.1:${api.address().port}` },
  stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
});
let output = "";
site.stdout.on("data", chunk => { output += chunk; });
site.stderr.on("data", chunk => { output += chunk; });
let browser;
const textOf = html => html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ");
try {
  let ready = false;
  for (let i = 0; i < 80; i++) {
    try { if ((await fetch(`${origin}/api/menu/categories/invalid`)).status === 400) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(ready, output.slice(-2000));
  const initial = await fetch(`${origin}/brindes-personalizados`);
  assert.equal(initial.status, 200);
  const html = await initial.text();
  assert.ok(textOf(html).includes(`Mostrando 24 de ${total} produtos`));
  assert.ok(textOf(html).includes("Brindes personalizados"));
  assert.ok(!html.includes("Gastronomia e Bar personalizados"));
  assert.ok(!requested.some(url => url.pathname.includes("/catalogo")), "General page must not load category 1");
  const pageTwo = textOf(await (await fetch(`${origin}/brindes-personalizados?page=2`)).text());
  assert.ok(pageTwo.includes("Produto geral 25"));
  assert.ok(pageTwo.includes(`Mostrando 24 de ${total} produtos`));
  const more = await (await fetch(`${origin}/api/produtos/catalogo?kind=products&page=2&limit=24`)).json();
  assert.equal(more.items[0].id, 25); assert.equal(more.total, total); assert.equal(more.totalPages, 6);
  const last = await (await fetch(`${origin}/api/produtos/catalogo?kind=products&page=6&limit=24`)).json();
  assert.equal(last.items.length, 13); assert.equal(last.items.at(-1).id, total);
  const outside = await (await fetch(`${origin}/api/produtos/catalogo?kind=products&page=7&limit=24`)).json();
  assert.equal(outside.items.length, 0); assert.equal(outside.total, total);
  const largeLimit = textOf(await (await fetch(`${origin}/brindes-personalizados?limit=500`)).text());
  assert.ok(largeLimit.includes(`Mostrando 48 de ${total} produtos`), "SSR page size must match the pagination API limit");
  const redirect = await fetch(`${origin}/brindes-personalizados?categoria=1&page=2&subcategorias=7`, { redirect: "manual" });
  const redirectBody = await redirect.text();
  assert.ok(redirect.status === 308 || (redirect.status === 200 && redirectBody.includes("NEXT_REDIRECT")));
  const redirectTarget = (redirect.headers.get("location") || redirectBody).replaceAll("&amp;", "&");
  assert.ok(redirectTarget.includes("/categorias/1-"));
  assert.ok(redirectTarget.includes("page=2&subcategorias=7"));
  const categoryCatalog = await (await fetch(`${origin}/api/produtos/catalogo?kind=category&categoria=1&page=1&limit=24`)).json();
  assert.equal(categoryCatalog.total, 78);
  console.log("Full catalog: 133 total, SSR pagination, continuation, final/empty pages, page-size consistency and explicit category redirect passed.");

  if (process.env.MENU_PLAYWRIGHT_PATH) {
    const { chromium } = await import(pathToFileURL(process.env.MENU_PLAYWRIGHT_PATH).href);
    browser = await chromium.launch({ executablePath: process.env.MENU_BROWSER_PATH, headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const pagination = [];
    page.on("request", req => { if (req.url().includes("/api/produtos/catalogo")) pagination.push(new URL(req.url())); });
    await page.route("**/*", route => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
    await page.goto(`${origin}/brindes-personalizados`);
    await page.getByRole("heading", { name: "Brindes personalizados", exact: true }).waitFor();
    assert.equal(await page.locator("#catalog-category").inputValue(), "0");
    for (let attempt = 0; attempt < 8; attempt++) {
      await page.getByRole("navigation", { name: "Paginação do catálogo" }).scrollIntoViewIfNeeded();
      if (await page.getByText("Todos os produtos foram carregados.").isVisible()) break;
      await page.waitForTimeout(350);
    }
    await page.getByText("Todos os produtos foram carregados.").waitFor();
    assert.ok((await page.getByText(/Mostrando/).textContent()).includes("133 de 133"));
    assert.ok(pagination.length > 0);
    assert.ok(pagination.every(url => url.searchParams.get("kind") === "products" && !url.searchParams.has("categoria")));
    await page.locator("#catalog-category").selectOption("1");
    await page.waitForURL(/\/categorias\/1-/);
    await page.locator("#catalog-category").selectOption("0");
    await page.waitForURL(`${origin}/brindes-personalizados`);
    console.log("Browser: unfiltered selection, infinite scroll through all 133 products, category navigation and return to the full catalog passed.");
  }
} finally {
  await browser?.close(); site.kill(); api.closeAllConnections(); api.close();
}
