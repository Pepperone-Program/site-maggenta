"use client";

import React, { FormEvent, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";

const hours = [
  "Segunda-feira: 09:00 AM - 18:00 PM",
  "Terca-feira: 09:00 AM - 18:00 PM",
  "Quarta-feira: 09:00 AM - 18:00 PM",
  "Quinta-feira: 09:00 AM - 18:00 PM",
  "Sexta-feira: 09:00 AM - 18:00 PM",
  "Sabado: Fechado",
  "Domingo: Fechado",
];

const Contact = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Nao foi possivel enviar sua mensagem.");
      }

      setStatus("success");
      setMessage("Mensagem enviada com sucesso. Em breve entraremos em contato.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Nao foi possivel enviar sua mensagem."
      );
    }
  };

  return (
    <>
      <Breadcrumb title="Fale conosco" pages={["fale conosco"]} />

      <section className="overflow-hidden bg-gray-2 py-14 lg:py-20">
        <div className="mx-auto w-full max-w-[1800px] px-2 sm:px-3">
          <div className="grid gap-7.5 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
            <aside className="rounded-md bg-white shadow-1">
              <div className="border-b border-gray-3 px-5 py-6 sm:px-7.5">
                <span className="text-sm font-semibold uppercase tracking-wide text-blue">
                  Detalhes
                </span>
                <h2 className="mt-2 text-2xl font-semibold text-dark">
                  Atendimento Pepperone
                </h2>
              </div>

              <div className="space-y-7 p-5 sm:p-7.5">
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase text-dark-4">
                    Contato
                  </p>
                  <p className="text-lg font-medium text-dark">
                    (11) 2971-5252 / (11) 2950-3923
                  </p>
                  <a
                    className="mt-2 inline-flex text-blue hover:text-blue-dark"
                    href="mailto:vendas@pepperone.com.br"
                  >
                    vendas@pepperone.com.br
                  </a>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold uppercase text-dark-4">
                    Endereco
                  </p>
                  <address className="not-italic leading-7 text-dark">
                    R. Jaguarete, 43
                    <br />
                    Bairro Casa Verde
                    <br />
                    CEP 02515-010
                    <br />
                    Sao Paulo - SP
                  </address>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold uppercase text-dark-4">
                    Horario
                  </p>
                  <ul className="space-y-2 text-dark">
                    {hours.map((item) => (
                      <li key={item} className="flex border-b border-gray-3 pb-2 last:border-0">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            <div className="rounded-md bg-white p-5 shadow-1 sm:p-8.5 xl:p-10">
              <div className="mb-7 border-b border-gray-3 pb-6">
                <span className="text-sm font-semibold uppercase tracking-wide text-blue">
                  Formulario
                </span>
                <h2 className="mt-2 text-2xl font-semibold text-dark">
                  Envie sua mensagem
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2.5 block text-dark">Nome</span>
                  <input
                    type="text"
                    name="nome"
                    required
                    placeholder="Seu nome"
                    className="h-12 w-full rounded-md border border-gray-3 bg-gray-1 px-4 outline-none duration-200 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-2.5 block text-dark">Empresa</span>
                  <input
                    type="text"
                    name="empresa"
                    placeholder="Nome da empresa"
                    className="h-12 w-full rounded-md border border-gray-3 bg-gray-1 px-4 outline-none duration-200 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-2.5 block text-dark">E-mail</span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="seu@email.com"
                    className="h-12 w-full rounded-md border border-gray-3 bg-gray-1 px-4 outline-none duration-200 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-2.5 block text-dark">Telefone</span>
                  <input
                    type="tel"
                    name="telefone"
                    placeholder="(11) 99999-9999"
                    className="h-12 w-full rounded-md border border-gray-3 bg-gray-1 px-4 outline-none duration-200 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2.5 block text-dark">Assunto</span>
                  <input
                    type="text"
                    name="assunto"
                    required
                    placeholder="Como podemos ajudar?"
                    className="h-12 w-full rounded-md border border-gray-3 bg-gray-1 px-4 outline-none duration-200 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2.5 block text-dark">Mensagem</span>
                  <textarea
                    name="mensagem"
                    rows={6}
                    required
                    placeholder="Conte sobre seu projeto, prazo, quantidade ou duvidas."
                    className="w-full rounded-md border border-gray-3 bg-gray-1 p-5 outline-none duration-200 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                </label>

                <div className="sm:col-span-2">
                  {message && (
                    <p
                      className={`mb-5 rounded-md px-4 py-3 text-sm ${
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
                    disabled={status === "loading"}
                    className="inline-flex rounded-md bg-blue px-7 py-3 font-medium text-white duration-200 hover:bg-blue-dark disabled:cursor-not-allowed disabled:bg-dark-4"
                  >
                    {status === "loading" ? "Enviando..." : "Enviar mensagem"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="w-full">
          <iframe className="w-full" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.4480800083775!2d-46.6552022!3d-23.5102466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef7e689756f1d%3A0x9d0c69976f23d709!2sR.%20Jaguarete%2C%2043%20-%20Casa%20Verde%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2002515-010!5e1!3m2!1spt-BR!2sbr!4v1778698525198!5m2!1spt-BR!2sbr"  height="600" loading="lazy" ></iframe>
        </div>
      </section>
    </>
  );
};

export default Contact;
