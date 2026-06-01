import Link from "next/link";
import { Metadata } from "next";
import QuoteConversion from "@/components/Tracking/QuoteConversion";
import { buildSeoOther, siteUrl } from "@/lib/seo";

const title = "Orçamento enviado com sucesso";
const description =
  "Seu pedido de orçamento foi enviado com sucesso. A Pepperone entrará em contato em até 24 horas.";

export const metadata: Metadata = {
  title,
  description,
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/orcamentos-obrigado",
  },
  other: buildSeoOther({
    title,
    description,
    canonical: `${siteUrl}/orcamentos-obrigado`,
    subject: "confirmação de envio de orçamento",
  }),
};

const OrcamentosObrigadoPage = () => {
  return (
    <main className="min-h-screen bg-gray-2 pt-[150px] sm:pt-[138px]">
      <QuoteConversion />
      <section className="mx-auto flex min-h-[calc(100vh-180px)] w-full max-w-[900px] items-center justify-center px-4 py-16">
        <div className="w-full rounded-md bg-white px-6 py-12 text-center shadow-1 sm:px-10 sm:py-16">
          <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-green/10 text-green">
            <svg
              aria-hidden="true"
              className="h-14 w-14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6 9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-semibold text-dark sm:text-4xl">
            Seu Pedido de Orçamento foi enviado com sucesso
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] text-lg leading-8 text-dark-4">
            Um dos nossos vendedores entrará em contato no prazo de 24h.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-blue px-7 font-medium text-white duration-200 hover:bg-blue-dark"
            >
              Voltar para o início
            </Link>
            <Link
              href="/brindes-personalizados"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-gray-3 bg-white px-7 font-medium text-dark duration-200 hover:border-blue hover:text-blue"
            >
              Ver mais produtos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OrcamentosObrigadoPage;
