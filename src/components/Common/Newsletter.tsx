"use client";

import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.success === false) {
        throw new Error(payload?.message || "Nao foi possivel cadastrar seu email.");
      }

      setStatus("success");
      setMessage("Email cadastrado com sucesso.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Nao foi possivel cadastrar seu email.");
    }
  };

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1800px] mx-auto px-2 sm:px-3">
        <div className="relative z-1 overflow-hidden rounded-xl bg-[#a3a3a3]">
          
          <div className="absolute -z-1 max-w-[523px] max-h-[243px] w-full h-full right-0 top-0 bg-gradient-1"></div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 px-4 sm:px-7.5 xl:pl-12.5 xl:pr-14 py-11">
            <div className="max-w-[491px] w-full">
              <h2 className="max-w-[399px] text-white font-bold text-lg sm:text-xl xl:text-heading-4 mb-3">
                Receba novidades e ofertas outdoor
              </h2>
              <p className="text-white">
                Cadastre seu email para acompanhar lançamentos, cupons e
                conteúdos para sua próxima viagem.
              </p>
            </div>

            <div className="max-w-[477px] w-full">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Seu email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="w-full bg-gray-1 border border-gray-3 outline-none rounded-md placeholder:text-dark-4 py-3 px-5"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex justify-center py-3 px-7 text-white bg-blue  font-medium rounded-md ease-out duration-200 hover:bg-white hover:text-blue"
                  >
                    {status === "loading" ? "Enviando" : "Cadastrar"}
                  </button>
                </div>
                {message && (
                  <p
                    className={`mt-3 text-sm ${
                      status === "success" ? "text-white" : "text-red-light"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
