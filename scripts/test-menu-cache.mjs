import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync("src/lib/menu-cache.ts", "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const { cachedMenuData } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
let release;
let reads = 0;
const loader = () => { reads++; return new Promise(resolve => { release = resolve; }); };
const first = cachedMenuData("origin-a:categories", loader);
const second = cachedMenuData("origin-a:categories", loader);
release(["category"]);
assert.deepEqual(await first, await second);
await cachedMenuData("origin-a:categories", loader);
assert.equal(reads, 1, "Concurrent and repeated requests must share a successful read");
assert.equal(await cachedMenuData("origin-b:categories", async () => "other"), "other");
await assert.rejects(cachedMenuData("failed", async () => { throw new Error("unavailable"); }));
assert.equal(await cachedMenuData("failed", async () => "recovered"), "recovered", "Failures must not poison the cache");
const originalNow = Date.now;
try {
  const future = originalNow() + 3600001;
  Date.now = () => future;
  assert.deepEqual(await cachedMenuData("origin-a:categories", async () => ["updated"]), ["updated"]);
} finally { Date.now = originalNow; }
console.log("Menu cache: concurrent request deduplication, scope isolation, expiry and recovery passed.");
