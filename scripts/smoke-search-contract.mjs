import { spawn } from "node:child_process";
import { createServer } from "node:http";

let apiPort = 0;
const sitePort = 32000 + Math.floor(Math.random() * 1000);
const requests = [];

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

const json = (response, status, payload) => {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
};

const api = createServer((request, response) => {
  const url = new URL(request.url || "/", `http://127.0.0.1:${apiPort}`);
  requests.push(url);

  if (url.pathname === "/api/v1/produtos/site/busca") {
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
    return json(response, 200, {
      success: true,
      data: {
        items: products,
        total: products.length,
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
  const legacyRequest = requests.find(
    (url) => url.pathname === "/api/v1/produtos/site",
  );

  if (
    response.status !== 200 ||
    items.length !== 2 ||
    items[0]?.codigo !== "GT03" ||
    items[1]?.codigo !== "GT401" ||
    canonicalRequest?.searchParams.get("q") !== "garrafa com parede dupla" ||
    legacyRequest?.searchParams.get("busca") !== "garrafa com parede dupla"
  ) {
    throw new Error(
      `O contrato da busca falhou: status=${response.status} payload=${JSON.stringify(
        payload,
      )} requests=${requests.map((url) => url.toString()).join(",")} server=${siteOutput.slice(-2000)}`,
    );
  }

  console.log(
    "Search contract smoke passed: configured_origin_only=true canonical_empty=true legacy_fallback=2 ranking_preserved=true",
  );
} finally {
  stopProcessTree(site);
  api.closeAllConnections?.();
  api.close();
}

process.exit(0);
