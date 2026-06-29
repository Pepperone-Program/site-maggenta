"use client";

import React, { FormEvent, FocusEvent, useEffect, useRef, useState } from "react";
import ImageWithFallback from "@/components/Common/ImageWithFallback";
import { useRouter } from "next/navigation";
import Breadcrumb from "../Common/Breadcrumb";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/redux/store";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";
import { fetchWithTimeout, isRequestTimeoutError } from "@/lib/timed-fetch";
import { quoteConversionStorageKey } from "@/lib/google-tags";
import { formatDisplayPrice } from "@/lib/products";
import {
  type AttributionParams,
  attributionToObsSuffix,
  getPersistedAttribution,
  persistAttribution,
  readAttributionParams,
  trackEvent,
} from "@/lib/tracking";

const ROUTE_STORAGE_KEY = "pepperone:last-internal-route";
const QUOTE_CUSTOMER_STORAGE_KEY = "pepperone:quote-customer";
const DEFAULT_RETURN_ROUTE = "/brindes-para-empresas";

const fields = [
  { name: "fantasia", label: "Empresa ou nome", placeholder: "Ex.: Maggenta Brindes", required: false },
  { name: "contato", label: "Contato", placeholder: "Nome do responsável", required: true },
  { name: "email", label: "E-mail", type: "email", placeholder: "vendas@empresa.com.br", required: true },
  { name: "tel", label: "Telefone", placeholder: "(11) 99999-9999", required: false },
  { name: "endereco", label: "Endereço", placeholder: "Rua, avenida ou travessa", required: false },
  { name: "endereco_n", label: "Número", placeholder: "43" },
  { name: "endereco_compl", label: "Complemento", placeholder: "Sala, bloco ou referência" },
  { name: "bairro", label: "Bairro", placeholder: "Casa Verde", required: false},
  { name: "cep", label: "CEP", placeholder: "02515-010", required: false },
  { name: "cidade", label: "Cidade", placeholder: "Sao Paulo", required: false },
  { name: "uf", label: "UF", placeholder: "SP", maxLength: 2, required: false },
];

const quoteCustomerFieldNames = fields.map((field) => field.name);

const readStoredQuoteCustomer = () => {
  try {
    const storedCustomer = window.localStorage.getItem(QUOTE_CUSTOMER_STORAGE_KEY);

    if (!storedCustomer) {
      return null;
    }

    const parsedCustomer = JSON.parse(storedCustomer);

    if (!parsedCustomer || typeof parsedCustomer !== "object" || Array.isArray(parsedCustomer)) {
      return null;
    }

    return parsedCustomer as Record<string, unknown>;
  } catch {
    return null;
  }
};

const getQuoteCustomerFromFormData = (formData: FormData) =>
  quoteCustomerFieldNames.reduce<Record<string, string>>((customer, fieldName) => {
    customer[fieldName] = String(formData.get(fieldName) || "").trim();
    return customer;
  }, {});

const persistQuoteCustomer = (customer: Record<string, unknown>) => {
  try {
    window.localStorage.setItem(QUOTE_CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
  } catch {
    // Storage can be unavailable in private windows or restricted browsers.
  }
};

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [attribution, setAttribution] = useState<AttributionParams>({});
  const [returnRoute, setReturnRoute] = useState(DEFAULT_RETURN_ROUTE);

  const total = cartItems.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );

  useEffect(() => {
    const queryAttribution = readAttributionParams(new URLSearchParams(window.location.search));
    const storedAttribution = getPersistedAttribution();
    persistAttribution(queryAttribution);
    setAttribution({
      ...storedAttribution,
      ...queryAttribution,
    });

    const storedReturnRoute = sessionStorage.getItem(ROUTE_STORAGE_KEY);
    if (storedReturnRoute) {
      setReturnRoute(storedReturnRoute);
    }

    const storedCustomer = readStoredQuoteCustomer();
    const form = formRef.current;

    if (storedCustomer && form) {
      quoteCustomerFieldNames.forEach((fieldName) => {
        const field = form.elements.namedItem(fieldName);
        const storedValue = storedCustomer[fieldName];

        if (field instanceof HTMLInputElement && !field.value && typeof storedValue === "string") {
          field.value = storedValue;
        }
      });
    }
  }, []);

  const handleCepBlur = async (event: FocusEvent<HTMLInputElement>) => {
    const cep = event.currentTarget.value.replace(/\D/g, "");
    const form = event.currentTarget.form;

    if (cep.length !== 8) {
      return;
    }

    setCepLoading(true);

    try {
      const response = await fetchWithTimeout(`https://brasilapi.com.br/api/cep/v1/${cep}`);

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
    const quoteCustomer = getQuoteCustomerFromFormData(formData);

    try {
      const response = await fetchWithTimeout("/api/orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          obs: `${String(formData.get("obs") || "")}${attributionToObsSuffix(attribution)}`,
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
      trackEvent("lead_submit", {
        source: "orcamento_form",
        items: cartItems.length,
        value: Number(total.toFixed(2)),
      });
      sessionStorage.setItem(
        quoteConversionStorageKey,
        JSON.stringify({
          email: String(customer.email || ""),
          phone_number: String(customer.tel || ""),
        })
      );
      persistQuoteCustomer(quoteCustomer);
      dispatch(removeAllItemsFromCart());
      router.push("/orcamentos-obrigado");
    } catch (error) {
      setStatus("error");
      setMessage(
        isRequestTimeoutError(error)
          ? "A API demorou para responder. Tente novamente em alguns instantes."
          : error instanceof Error ? error.message : "Nao foi possivel enviar o orcamento."
      );
    }
  };

  return (
    <>
      <Breadcrumb title="Solicitar orçamentos" pages={["orcamentos"]} />
      <section className="min-h-[calc(100vh-220px)] overflow-hidden bg-gray-2 py-5 lg:py-8">
        
        <div className="mx-auto w-full max-w-[1800px] px-2 sm:px-3">
                    
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(420px,0.85fr)]">
              <div className="w-full">
                <div className="h-full rounded-md bg-white p-4 shadow-1 sm:p-8.5 xl:p-10">
                  <div className="mb-7 flex flex-col gap-2 border-b border-gray-3 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <span className="text-sm font-semibold uppercase tracking-wide text-blue">
                        Solicitacao comercial
                      </span>
                      <h2 className="mt-2 text-2xl font-semibold text-dark">
                        Dados para orçamento
                      </h2>
                    </div>
                    <p className="max-w-[420px] text-sm leading-6 text-dark-4">
                      Preencha seus dados para que nossa equipe retorne com prazos,
                      gravação e disponibilidade.
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
                          placeholder={field.placeholder}
                          onBlur={field.name === "cep" ? handleCepBlur : undefined}
                          className="h-12 w-full rounded-md border border-gray-3 bg-gray-1 px-4 outline-none duration-200 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
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
                    <span className="mb-2.5 block text-dark">Observações</span>
                    <textarea
                      name="obs"
                      rows={6}
                      placeholder="Quantidade desejada, personalização, prazo, entrega ou qualquer detalhe importante."
                      className="w-full rounded-md border border-gray-3 bg-gray-1 p-5 outline-none duration-200 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </label>
                </div>
              </div>

              <aside className="w-full">
                <div className="sticky top-16 rounded-md bg-white shadow-1">
                  <div className="border-b border-gray-3 px-4 py-5 sm:px-8.5">
                    <span className="text-sm font-semibold uppercase tracking-wide text-blue">
                      Resumo
                    </span>
                    <h3 className="mt-2 text-2xl font-semibold text-dark">
                      Seu orçamento
                    </h3>
                  </div>

                  <div className="max-h-[52vh] overflow-auto px-4 pb-6 pt-2.5 sm:px-8.5">
                    {cartItems.length === 0 ? (
                      <p className="py-6 text-dark-4">
                        Adicione produtos para solicitar um orçamento.
                      </p>
                    ) : (
                      cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-5 border-b border-gray-3 py-5"
                        >
                          <div className="flex min-w-0 gap-4">
                            <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-md border border-gray-3 bg-gray-1">
                              <ImageWithFallback
                                src={item.imgs.previews[0]}
                                alt={item.title}
                                fill
                                sizes="72px"
                                className="object-contain p-1"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-dark">{item.title}</p>
                              <p className="mt-1 text-sm text-dark-4">
                                Codigo: {item.codigo || item.id} - Qtd: {item.quantity}
                              </p>
                            </div>
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

                    <button
                      type="submit"
                      disabled={status === "loading" || cartItems.length === 0}
                      className="mt-7.5 flex w-full justify-center rounded-md bg-blue px-6 py-3 font-medium text-white duration-200 hover:bg-blue-dark disabled:cursor-not-allowed disabled:bg-dark-4"
                    >
                      {status === "loading"
                        ? "Enviando..."
                        : "Enviar solicitação de orçamento"}
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push(returnRoute || DEFAULT_RETURN_ROUTE)}
                      className="mt-3 flex w-full justify-center rounded-md px-6 py-3 font-medium text-white duration-200 hover:opacity-95"
                      style={{ backgroundColor: "rgb(34, 197, 94)" }}
                    >
                      Escolher mais produtos
                    </button>

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
                  </div>

                  <div className="pb-6 px-4 sm:px-8.5">
                    <div
                      role="alert"
                      className="rounded-md border-2 border-red bg-red-light-6 px-4 py-3 text-sm text-red"
                    >
                      <strong className="block font-medium">Atenção</strong>
                      <span className="block">
                        Não pagamos para testes de produtos, fique atento a golpes.
                      </span>
                    </div>
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
