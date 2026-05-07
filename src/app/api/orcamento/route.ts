import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

type QuoteItem = {
  id: number;
  title: string;
  codigo?: string;
  quantity: number;
  discountedPrice?: number;
};

type QuotePayload = {
  customer?: Record<string, unknown>;
  obs?: string;
  items?: QuoteItem[];
};

const requiredFields = [
  "fantasia",
  "contato",
  "email",
  "tel",
  "endereco",
  "cidade",
  "uf",
];

const text = (value: unknown) => String(value || "").trim();

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as QuotePayload;
  const customer = payload.customer || {};
  const items = payload.items || [];

  const missing = requiredFields.filter((field) => !text(customer[field]));

  if (missing.length > 0) {
    return NextResponse.json(
      {
        success: false,
        message: `Campos obrigatorios ausentes: ${missing.join(", ")}`,
      },
      { status: 422 }
    );
  }

  if (items.length === 0) {
    return NextResponse.json(
      { success: false, message: "Adicione ao menos um produto ao orçamento." },
      { status: 422 }
    );
  }

  const dataOrcamento = new Date().toISOString().slice(0, 10);
  const quoteBody = {
    data_orcamento: dataOrcamento,
    fantasia: text(customer.fantasia),
    endereco: text(customer.endereco),
    endereco_n: text(customer.endereco_n),
    endereco_compl: text(customer.endereco_compl),
    bairro: text(customer.bairro),
    cep: text(customer.cep),
    cidade: text(customer.cidade),
    uf: text(customer.uf).slice(0, 2).toUpperCase(),
    tel: text(customer.tel),
    email: text(customer.email),
    contato: text(customer.contato),
    obs: text(payload.obs),
    nivel: "SITE",
    entrega: "A combinar",
  };

  const quote = await apiFetch<{ id_orcamento?: number }>("/orcamentos", {
    method: "POST",
    body: JSON.stringify(quoteBody),
  });
  const idOrcamento = quote?.id_orcamento || Date.now();
  let usedFallback = !quote?.id_orcamento;

  if (quote?.id_orcamento) {
    for (const item of items) {
      const response = await apiFetch(`/orcamentos/${quote.id_orcamento}/itens`, {
        method: "POST",
        body: JSON.stringify({
          id_orcamento: quote.id_orcamento,
          data_orcamento: dataOrcamento,
          id_produto: item.id,
          codigo: item.codigo || String(item.id),
          produto: item.title,
          gravacao_cores: "0",
          quantidade: Math.max(1, Number(item.quantity || 1)),
          preco_unitario:
            item.discountedPrice && item.discountedPrice > 0
              ? String(item.discountedPrice)
              : null,
        }),
      });

      if (!response) {
        usedFallback = true;
      }
    }
  }

  return NextResponse.json({
    success: true,
    fallback: usedFallback,
    data: {
      id_orcamento: idOrcamento,
      data_orcamento: dataOrcamento,
      total_itens: items.length,
    },
  });
}
