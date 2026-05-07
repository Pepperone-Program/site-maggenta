"use client";

import React, { FormEvent, FocusEvent, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useAppSelector } from "@/redux/store";
import { formatDisplayPrice } from "@/lib/products";

const fields = [
  { name: "fantasia", label: "Empresa ou nome", required: true },
  { name: "contato", label: "Contato", required: true },
  { name: "email", label: "E-mail", type: "email", required: true },
  { name: "tel", label: "Telefone", required: true },
  { name: "endereco", label: "Endereco", required: true },
  { name: "endereco_n", label: "Numero" },
  { name: "endereco_compl", label: "Complemento" },
  { name: "bairro", label: "Bairro" },
  { name: "cep", label: "CEP" },
  { name: "cidade", label: "Cidade", required: true },
  { name: "uf", label: "UF", maxLength: 2, required: true },
];

const Checkout = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [cepLoading, setCepLoading] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );

  const handleCepBlur = async (event: FocusEvent<HTMLInputElement>) => {
    const cep = event.currentTarget.value.replace(/\D/g, "");
    const form = event.currentTarget.form;

    if (cep.length !== 8) {
      return;
    }

    setCepLoading(true);

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);

      if (!response.ok || !form) {
        return;
      }

      const address = await response.json();

      const setField = (name: string, value: string) => {
        const field = form.elements.namedItem(name);

        if (field instanceof HTMLInputElement && !field.value) {
          field.value = value;
        }
      };

      setField("uf", address.state || "");
      setField("cidade", address.city || "");
      setField("bairro", address.neighborhood || "");
      setField("endereco", address.street || "");
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const customer = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          obs: formData.get("obs") || "",
          items: cartItems,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Nao foi possivel enviar o orcamento.");
      }

      setStatus("success");
      setMessage(
        payload.fallback
          ? "Recebemos sua solicitacao localmente. A API nao respondeu agora, mas os dados foram mantidos no formato correto."
          : "Solicitacao enviada com sucesso. Em breve entraremos em contato."
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Nao foi possivel enviar o orcamento."
      );
    }
  };

  return (
    <>
      <Breadcrumb title="Solicitar orcamento" pages={["orcamento"]} />
      <section className="min-h-[calc(100vh-220px)] overflow-hidden bg-gray-2 py-10 lg:py-14">
        <div className="mx-auto w-full max-w-[1800px] px-2 sm:px-3">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(420px,0.85fr)]">
              <div className="w-full">
                <div className="h-full rounded-md bg-white p-4 shadow-1 sm:p-8.5 xl:p-10">
                  <div className="mb-7 flex flex-col gap-2 border-b border-gray-3 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <span className="text-sm font-semibold uppercase tracking-wide text-blue">
                        Solicitacao comercial
                      </span>
                      <h2 className="mt-2 text-2xl font-semibold text-dark">
                        Dados para orcamento
                      </h2>
                    </div>
                    <p className="max-w-[420px] text-sm leading-6 text-dark-4">
                      Preencha seus dados para que nossa equipe retorne com prazos,
                      gravacao e disponibilidade.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {fields.map((field) => (
                      <label
                        key={field.name}
                        className={`block ${
                          field.name === "endereco" ? "xl:col-span-2" : ""
                        }`}
                      >
                        <span className="mb-2.5 block text-dark">{field.label}</span>
                        <input
                          name={field.name}
                          type={field.type || "text"}
                          required={field.required}
                          maxLength={field.maxLength}
                          onBlur={field.name === "cep" ? handleCepBlur : undefined}
                          className="h-12 w-full rounded-md border border-gray-3 bg-gray-1 px-4 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                        />
                        {field.name === "cep" && cepLoading && (
                          <span className="mt-1.5 block text-sm text-blue">
                            Buscando CEP...
                          </span>
                        )}
                      </label>
                    ))}
                  </div>

                  <label className="mt-5 block">
                    <span className="mb-2.5 block text-dark">Observacoes</span>
                    <textarea
                      name="obs"
                      rows={6}
                      placeholder="Quantidade desejada, personalizacao, prazo, entrega ou qualquer detalhe importante."
                      className="w-full rounded-md border border-gray-3 bg-gray-1 p-5 outline-none duration-200 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </label>
                </div>
              </div>

              <aside className="w-full">
                <div className="sticky top-32 rounded-md bg-white shadow-1">
                  <div className="border-b border-gray-3 px-4 py-5 sm:px-8.5">
                    <span className="text-sm font-semibold uppercase tracking-wide text-blue">
                      Resumo
                    </span>
                    <h3 className="mt-2 text-2xl font-semibold text-dark">
                      Seu orcamento
                    </h3>
                  </div>

                  <div className="max-h-[52vh] overflow-auto px-4 pb-6 pt-2.5 sm:px-8.5">
                    {cartItems.length === 0 ? (
                      <p className="py-6 text-dark-4">
                        Adicione produtos para solicitar um orcamento.
                      </p>
                    ) : (
                      cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-5 border-b border-gray-3 py-5"
                        >
                          <div>
                            <p className="font-medium text-dark">{item.title}</p>
                            <p className="mt-1 text-sm text-dark-4">
                              Codigo: {item.codigo || item.id} - Qtd: {item.quantity}
                            </p>
                          </div>
                          <p className="text-right text-dark">
                            {formatDisplayPrice(item.discountedPrice)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-gray-3 px-4 pb-8.5 pt-5 sm:px-8.5">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-dark">Total</p>
                      <p className="text-right text-lg font-medium text-dark">
                        {formatDisplayPrice(total)}
                      </p>
                    </div>

                    {message && (
                      <p
                        className={`mt-5 rounded-md px-4 py-3 text-sm ${
                          status === "success"
                            ? "bg-green/10 text-green"
                            : "bg-red-light-6 text-red"
                        }`}
                      >
                        {message}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading" || cartItems.length === 0}
                      className="mt-7.5 flex w-full justify-center rounded-md bg-blue px-6 py-3 font-medium text-white duration-200 hover:bg-blue-dark disabled:cursor-not-allowed disabled:bg-dark-4"
                    >
                      {status === "loading"
                        ? "Enviando..."
                        : "Enviar solicitacao de orcamento"}
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
