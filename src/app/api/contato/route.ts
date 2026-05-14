import { NextResponse } from "next/server";
import { buildApiUrl } from "@/lib/api";

const requiredFields = ["nome", "email", "assunto", "mensagem"];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { success: false, message: "Dados invalidos." },
      { status: 400 }
    );
  }

  const missingField = requiredFields.find((field) => !String(body[field] || "").trim());

  if (missingField) {
    return NextResponse.json(
      { success: false, message: "Preencha todos os campos obrigatorios." },
      { status: 400 }
    );
  }

  const url = buildApiUrl("/contato");

  if (!url) {
    return NextResponse.json(
      { success: false, message: "API de contato nao configurada." },
      { status: 500 }
    );
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: String(body.nome || ""),
      empresa: String(body.empresa || ""),
      email: String(body.email || ""),
      telefone: String(body.telefone || ""),
      assunto: String(body.assunto || ""),
      mensagem: String(body.mensagem || ""),
    }),
  });
  const payload = await response.json().catch(() => null);

  return NextResponse.json(payload || { success: response.ok }, {
    status: response.ok ? 200 : response.status,
  });
}
