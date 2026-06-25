"use client";

import React, { useState } from "react";
import { fetchWithTimeout, isRequestTimeoutError } from "@/lib/timed-fetch";

const FooterNewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetchWithTimeout("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setMessage(
        isRequestTimeoutError(error)
          ? "A API demorou para responder. Tente novamente em alguns instantes."
          : error instanceof Error ? error.message : "Nao foi possivel cadastrar seu email."
      );
    }
  };

  return (
    <form
      onSubmit={handleNewsletterSubmit}
      className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-5">
          Novidades Maggenta
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-[#9d174d]">
          Receba todas as novidades em primeira mão
        </h2>
      </div>
      <div className="w-full max-w-[620px]">
        <div className="flex flex-col gap-3 rounded-[28px] border border-gray-3 bg-white p-1.5 shadow-1 sm:flex-row sm:rounded-full">
          <input
            type="email"
            name="footer-email"
            placeholder="Seu email corporativo"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="min-h-12 flex-1 rounded-full border border-transparent bg-transparent px-5 text-dark outline-none placeholder:text-dark-4 duration-200 focus:border-blue focus:ring-2 focus:ring-blue/15"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="min-h-12 rounded-full bg-blue px-7 font-semibold text-white duration-200 hover:bg-blue-dark disabled:cursor-wait disabled:opacity-70"
          >
            {status === "loading" ? "Enviando" : "Cadastrar"}
          </button>
        </div>
        {message && (
          <p className={`mt-3 text-sm ${status === "success" ? "text-dark-3" : "text-red"}`}>
            {message}
          </p>
        )}
      </div>
    </form>
  );
};

export default FooterNewsletterForm;
