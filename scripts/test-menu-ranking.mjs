import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync("src/lib/menu-ranking.ts", "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const { selectFeaturedCategories } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const categories = ["Canetas", "Tecnologia", "Garrafas", "Bolsas", "Canecas", "Agendas"].map((title, i) => ({ id: String(i + 1), title, path: `/categorias/${i + 1}` }));
const product = (id, category, extra = {}) => ({ id_produto: id, id_categoria: category, site: "S", habilitado: "S", ...extra });
assert.deepEqual(selectFeaturedCategories(categories, []), []);
assert.deepEqual(selectFeaturedCategories(categories, [product(9000, 3), product(2, 3), product(3, 1)]).map(x => x.id), ["3", "1"]);
assert.deepEqual(selectFeaturedCategories(categories, [product(1, 1, { site: "N" }), product(2, 2, { habilitado: "N" }), product(3, 99)]), []);
assert.deepEqual(selectFeaturedCategories(categories, [product(1, 3, { categorias: [{ id_categoria: 1 }] })]).map(x => x.id), ["3"]);
assert.deepEqual(selectFeaturedCategories(categories, [product(1, null, { categorias: [{ id_categoria: 2 }, { id_categoria: 6 }, { id_categoria: 99 }] })]).map(x => x.id), ["6"]);
assert.equal(selectFeaturedCategories(categories, categories.map((c, i) => product(i, Number(c.id)))).length, 5);
console.log("Menu ranking: order, deduplication, visibility, primary category, alphabetical association and five-item limit passed.");
