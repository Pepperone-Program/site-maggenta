import React from "react";
import Image from "next/image";
import Link from "next/link";

const CounDown = () => {
  return (
    <section className="overflow-hidden py-14">
      <div className="w-full">
        <div className="relative h-[360px] overflow-hidden bg-[#0b2f2b] sm:h-[460px] lg:h-[560px] xl:h-[650px]">
          <Image
            src="/images/countdown/countdown-bg.png"
            alt="Banner de campanha Pepperone"
            fill
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <Image
            src="/images/countdown/countdown-01.png"
            alt="Produto em destaque"
            width={560}
            height={520}
            className="absolute bottom-0 right-4 hidden h-auto w-[38vw] max-w-[560px] object-contain lg:block"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061f1c] via-[#061f1c]/70 to-transparent" />

          <div className="relative z-10 flex h-full max-w-[720px] flex-col justify-center px-5 sm:px-10 lg:px-16">
            <span className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Não perca
            </span>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Ofertas para completar seu kit outdoor
            </h2>
            <p className="mt-5 max-w-[520px] leading-7 text-white/82">
              Banner full-width preparado para campanhas com imagem, coleção,
              promoção ou lançamento.
            </p>
            <Link
              href="/brindes-personalizados"
              className="mt-8 inline-flex w-fit rounded-md bg-blue px-9 py-3 text-sm font-semibold text-white duration-200 hover:bg-blue-dark"
            >
              Solicitar orçamento
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CounDown;
