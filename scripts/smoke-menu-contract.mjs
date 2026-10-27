import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const titles = ["Canetas", "Tecnologia", "Garrafas", "Bolsas Térmicas", "Canecas", "Agendas", "Acessórios Veiculares", "Blocos de Anotações", "Bolsas Esportivas", "Brindes em Neoprene", "Cadernos", "Caixas de Som", "Chaveiros", "Coolers", "Copos", "Diversos", "Embalagens", "Fabricação Própria", "Ferramentas", "Gastronomia e Bar", "Guarda-Chuva", "Kits Escritório", "Kits Especiais", "Lápis e Acessórios", "Linha Fitness e Academia", "Linha Pet", "Malas de Viagem", "Mochilas", "Necessaires", "Pastas", "Porta Documentos", "Porta Tênis", "Sacolas", "Squeezes", "Uso Pessoal"];
const categories = titles.map((categoria, i) => ({ id_categoria: i + 1, categoria, habilitado: "S", url_capa: "/images/categories/categories-01.png" }));
const calls = [];
let failSubcategories = false;
let slowSecondaryGroups = true;
const json = (res, code, data) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(data)); };
const api = createServer((req, res) => {
  const url = new URL(req.url, "http://localhost"); calls.push(url.pathname);
  if (url.pathname === "/api/v1/categorias") return json(res, 200, { data: categories });
  if (url.pathname === "/api/v1/tipos-produtos/habilitados") {
    const respond = () => json(res, 200, { data: [{ id_tipo_produto: 1, tipo_produto: "Corporativos", habilitado: "S" }] });
    if (slowSecondaryGroups) { setTimeout(respond, 1500); return; }
    return respond();
  }
  if (url.pathname === "/api/v1/publicos-alvos") return json(res, 200, { data: [{ id_publico_alvo: 1, publico_alvo: "Empresas", habilitado: "S" }] });
  if (url.pathname === "/api/v1/datas-promocionais") return json(res, 200, { data: [{ id_data_promocional: 1, data_promocional: "Natal", habilitado: "S" }] });
  if (url.pathname === "/api/v1/estatisticas-produtos/ranking") {
    assert.equal(req.headers.authorization, "Bearer menu-test-token");
    return json(res, 200, { data: [9001, 9002, 9003, 9004, 9005, 9006, 9007].map(id_produto => ({ id_produto })) });
  }
  const product = url.pathname.match(/^\/api\/v1\/produtos\/(900\d)$/);
  if (product) {
    const id = Number(product[1]); const category = { 9001: 2, 9002: 2, 9003: 3, 9004: 1, 9005: 4, 9006: 5, 9007: 6 }[id];
    return json(res, 200, { data: { id_produto: id, site: "S", habilitado: "S", id_categoria: category } });
  }
  if (/\/categorias\/\d+\/subcategorias$/.test(url.pathname)) {
    if (failSubcategories) return json(res, 503, {});
    const id = Number(url.pathname.split("/")[4]);
    return json(res, 200, { data: { items: [
      { id_subcategoria: 50, id_categoria: id, subcategoria: "Acessórios para empresas", habilitado: "S" },
      { id_subcategoria: 51, id_categoria: id, subcategoria: "Oculta", habilitado: "N" },
    ], totalPages: 1 } });
  }
  return json(res, 404, {});
});
await new Promise(resolve => api.listen(0, "127.0.0.1", resolve));
const port = 34000 + Math.floor(Math.random() * 1000);
const origin = `http://127.0.0.1:${port}`;
let output = "";
const site = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
  env: { ...process.env, NEXT_API_URL: `http://127.0.0.1:${api.address().port}`, NEXT_API_TOKEN: "menu-test-token" },
  stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
});
site.stdout.on("data", chunk => { output += chunk; }); site.stderr.on("data", chunk => { output += chunk; });
let browser;
try {
  let response;
  for (let i = 0; i < 80; i++) {
    try { response = await fetch(`${origin}/api/menu/categories/invalid`); if (response.status === 400) break; } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.equal(response?.status, 400, output.slice(-2000));
  let fullFinished = false;
  const fullRequest = fetch(`${origin}/api/menu`).then(response => { fullFinished = true; return response; });
  const fastResponse = await fetch(`${origin}/api/menu?section=categories`);
  const fastPayload = await fastResponse.json();
  assert.equal(fastPayload.data[0].items.length, categories.length);
  assert.equal(fullFinished, false, "Categories must arrive before a slow secondary group");
  response = await fullRequest;
  assert.ok(response.ok);
  slowSecondaryGroups = false;
  const payload = await response.json();
  const menuCategories = payload.data.find(group => group.id === "categorias").items;
  assert.deepEqual(menuCategories.filter(c => c.featuredOrder !== undefined).sort((a,b) => a.featuredOrder-b.featuredOrder).map(c => c.id), ["2", "3", "1", "4", "5"]);
  assert.ok(!JSON.stringify(payload).includes("menu-test-token"));
  await fetch(`${origin}/api/menu`);
  assert.equal(calls.filter(path => path === "/api/v1/categorias").length, 1, "Fast and full responses must share categories");
  assert.equal(calls.filter(path => path === "/api/v1/tipos-produtos/habilitados").length, 1, "A warm menu must not query the upstream API again");
  assert.equal(calls.filter(path => path.endsWith("/ranking")).length, 1);
  const subs = await (await fetch(`${origin}/api/menu/categories/2`)).json();
  assert.equal(subs.data.length, 1); assert.ok(subs.data[0].path.startsWith("/subcategorias/50-"));
  await fetch(`${origin}/api/menu/categories/2`);
  assert.equal(calls.filter(path => path === "/api/v1/categorias/2/subcategorias").length, 1);
  assert.equal((await fetch(`${origin}/api/menu/categories/invalid`)).status, 400);
  console.log("Menu API contract: ranking IDs, deduplication, cache, private token, subcategory visibility and canonical links passed.");
  if (process.env.MENU_PLAYWRIGHT_PATH) {
    const { chromium } = await import(pathToFileURL(process.env.MENU_PLAYWRIGHT_PATH).href);
    browser = await chromium.launch({ executablePath: process.env.MENU_BROWSER_PATH, headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.route("**/*", route => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
    await page.goto(`${origin}/empresa-de-brindes`);
    const nav = page.getByRole("navigation", { name: "Categorias de produtos" });
    const all = nav.getByRole("button", { name: "Veja todas as categorias", exact: true });
    await all.hover(); await all.click(); await page.locator("#category-panel").waitFor({ state: "visible" });
    await mkdir(".next/menu-review", { recursive: true });
    await page.screenshot({ animations: "disabled", path: ".next/menu-review/desktop-all.png" });
    await nav.getByRole("link", { name: "Tecnologia", exact: true }).first().hover();
    await page.getByRole("link", { name: "Acessórios para empresas", exact: true }).waitFor();
    await page.screenshot({ animations: "disabled", path: ".next/menu-review/desktop-category.png" });
    await page.keyboard.press("Escape"); await page.locator("#category-panel").waitFor({ state: "hidden" });
    const expand = nav.getByRole("button", { name: "Abrir subcategorias de Tecnologia", exact: true }).first();
    await expand.focus(); await page.keyboard.press("Enter"); await page.locator("#category-panel").waitFor({ state: "visible" });
    await page.mouse.click(720, 750); await page.locator("#category-panel").waitFor({ state: "hidden" });
    for (const width of [768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.getByRole("button", { name: "Abrir menu", exact: true }).filter({ visible: true }).click();
      await page.locator("#category-panel").waitFor({ state: "visible" });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await nav.getByRole("button", { name: "Abrir subcategorias de Tecnologia", exact: true }).filter({ visible: true }).click();
      await page.getByRole("link", { name: "Acessórios para empresas", exact: true }).waitFor();
      await page.screenshot({ animations: "disabled", path: `.next/menu-review/mobile-${width}.png` });
      await page.keyboard.press("Escape");
    }
    failSubcategories = true;
    await page.setViewportSize({ width: 1440, height: 1000 });
    await nav.getByRole("link", { name: "Garrafas", exact: true }).first().hover();
    await page.getByRole("button", { name: "Tentar novamente" }).waitFor({ timeout: 20000 });
    await page.getByRole("link", { name: "Ver todos os produtos" }).waitFor();
    failSubcategories = false;
    await page.getByRole("button", { name: "Tentar novamente" }).click();
    await page.getByRole("link", { name: "Acessórios para empresas", exact: true }).waitFor();
    let reloadMenuRequests = 0;
    await page.route("**/api/menu**", route => { reloadMenuRequests++; return route.abort(); });
    await page.reload({ waitUntil: "domcontentloaded" });
    await nav.getByRole("link", { name: "Tecnologia", exact: true }).first().waitFor();
    assert.equal(reloadMenuRequests, 0, "A fresh session snapshot must restore the menu without a request");
    console.log("Browser: desktop hover, keyboard, Escape, outside click, 768/390/320px navigation, overflow and retry passed. Screenshots: .next/menu-review");
    console.log("Menu performance: independent cold categories, cached upstream reads and session restoration passed.");
  }
} finally {
  await browser?.close();
  site.kill(); api.closeAllConnections(); api.close();
}
