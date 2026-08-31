import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-[#f5f5f4] px-4 pb-20 pt-[170px] sm:pt-[160px]">
      <section className="mx-auto max-w-[820px] rounded-[32px] bg-white px-6 py-14 text-center shadow-2 sm:px-12 sm:py-18">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue">
          Erro 404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-dark sm:text-4xl">
          Esta página não foi encontrada
        </h1>
        <p className="mx-auto mt-5 max-w-[590px] text-base leading-7 text-dark-4">
          O endereço pode ter mudado ou o conteúdo não está mais disponível. Use a
          busca do site ou continue pelo nosso catálogo de brindes personalizados.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/brindes-personalizados"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue px-7 font-semibold text-white duration-200 hover:bg-blue-dark"
          >
            Ver catálogo
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-gray-3 bg-white px-7 font-semibold text-dark duration-200 hover:border-blue hover:text-blue"
          >
            Voltar ao início
          </Link>
          <Link
            href="/fale-conosco"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-gray-3 bg-white px-7 font-semibold text-dark duration-200 hover:border-blue hover:text-blue"
          >
            Fale conosco
          </Link>
        </div>
      </section>
    </main>
  );
}
