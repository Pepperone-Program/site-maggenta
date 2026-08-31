import { spawn } from "node:child_process";
import { createServer } from "node:http";

let apiPort = 0;
const sitePort = 31000 + Math.floor(Math.random() * 1000);
const received = [];
let failQuoteItems = false;

const json = (response, status, payload) => {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
};

const readJson = async (request) => {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
};

const api = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://127.0.0.1:${apiPort}`);

  if (request.method === "POST" && url.pathname === "/api/v1/orcamentos") {
    const body = await readJson(request);
    received.push({ kind: "quote", body });
    return json(response, 200, {
      success: true,
      data: { id_orcamento: 4242 },
    });
  }

  if (
    request.method === "POST" &&
    url.pathname === "/api/v1/orcamentos/4242/itens"
  ) {
    const body = await readJson(request);
    received.push({ kind: "item", body });

    if (failQuoteItems) {
      return json(response, 500, { success: false, message: "falha controlada" });
    }

    // O backend pode confirmar o insert sem devolver uma representacao do item.
    return json(response, 200, { success: true, data: null });
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
      const response = await fetch(`http://127.0.0.1:${sitePort}/checkout`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("O servidor Next nao iniciou a tempo.");
};

const quotePayload = {
  customer: {
    contato: "Teste de contrato",
    email: "teste-contrato@example.com",
    tel: "11999999999",
  },
  obs: "Smoke local sem envio externo",
  items: [
    {
      id: 10,
      codigo: "TESTE10",
      title: "Produto de teste",
      quantity: 25,
    },
  ],
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
        // Uma origem de leitura quebrada nao pode desviar as escritas.
        NEXT_API_URL: "http://127.0.0.1:9",
        NEXT_API_WRITE_URL: `http://127.0.0.1:${apiPort}`,
        NEXT_API_TOKEN: "contract-test-token",
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

  const successResponse = await fetch(`http://127.0.0.1:${sitePort}/api/orcamento`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quotePayload),
  });
  const successPayload = await successResponse.json();

  if (
    successResponse.status !== 200 ||
    successPayload?.success !== true ||
    successPayload?.data?.id_orcamento !== 4242 ||
    received.filter((entry) => entry.kind === "quote").length !== 1 ||
    received.filter((entry) => entry.kind === "item").length !== 1
  ) {
    throw new Error(
      `O fluxo de sucesso falhou: status=${successResponse.status} payload=${JSON.stringify(
        successPayload
      )} received=${JSON.stringify(received)} server=${siteOutput.slice(-2000)}`
    );
  }

  failQuoteItems = true;
  const failureResponse = await fetch(`http://127.0.0.1:${sitePort}/api/orcamento`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quotePayload),
  });
  const failurePayload = await failureResponse.json();

  if (failureResponse.status !== 502 || failurePayload?.success !== false) {
    throw new Error("Uma falha de item foi tratada incorretamente como sucesso.");
  }

  const invalidResponse = await fetch(`http://127.0.0.1:${sitePort}/api/orcamento`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customer: {}, items: [] }),
  });

  if (invalidResponse.status !== 422) {
    throw new Error("A validacao de campos obrigatorios nao retornou HTTP 422.");
  }

  console.log("API contract smoke passed: success=200 item_failure=502 validation=422");
} finally {
  stopProcessTree(site);
  api.closeAllConnections?.();
  api.close();
}

process.exit(0);
