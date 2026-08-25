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
  "contato",
  "email",
  "tel",
] as const;

const fieldLabels: Record<(typeof requiredFields)[number], string> = {
  contato: "contato",
  email: "e-mail",
  tel: "telefone",
};

const text = (value: unknown) => String(value || "").trim();

export async function POST(request: NextRequest) {
  let payload: QuotePayload;

  try {
    payload = (await request.json()) as QuotePayload;
  } catch {
    return NextResponse.json(
      { success: false, message: "Dados do orcamento invalidos." },
      { status: 400 }
    );
  }

  const customer = payload.customer || {};
  const items = payload.items || [];

  const missing = requiredFields.filter((field) => !text(customer[field]));

  if (missing.length > 0) {
    return NextResponse.json(
      {
        success: false,
        message: `Campos obrigatórios ausentes: ${missing
          .map((field) => fieldLabels[field])
          .join(", ")}`,
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

  try {
    const quote = await apiFetch<{ id_orcamento?: number }>("/orcamentos", {
      method: "POST",
      body: JSON.stringify(quoteBody),
    });
    const idOrcamento = Number(quote?.id_orcamento);

    if (!Number.isFinite(idOrcamento) || idOrcamento <= 0) {
      throw new Error("A API nao confirmou o numero do orcamento.");
    }

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
        throw new Error(
          `A API nao confirmou o item ${item.codigo || item.id} do orcamento.`
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id_orcamento: idOrcamento,
        data_orcamento: dataOrcamento,
        total_itens: items.length,
      },
    });
  } catch (error) {
    console.error("[api/orcamento] Falha ao gravar o orcamento na API.", {
      message: error instanceof Error ? error.message : "falha desconhecida",
    });

    return NextResponse.json(
      {
        success: false,
        message:
          "Nao foi possivel registrar o orcamento agora. Seus produtos continuam no carrinho; tente novamente.",
      },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
