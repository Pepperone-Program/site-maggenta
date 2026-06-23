import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { BannerApi } from "@/lib/api";

const CounDown = ({ banners = [] }: { banners?: BannerApi[] }) => {
  const desktopBanner = banners.find((banner) => banner.tamanho_tela !== "mobile") || banners[0];
  const mobileBanner = banners.find((banner) => banner.tamanho_tela === "mobile");
  const hasMobileBanner = Boolean(mobileBanner);

  const renderBanner = (banner?: BannerApi | null) => {
    const image = banner?.url_banner || "/images/countdown/countdown-bg.png";
    const title = banner?.titulo || "Ofertas para completar seu kit outdoor";
    const href = banner?.url || "/brindes-personalizados";
    const hasApiBanner = Boolean(banner);

    return (
      <div className="w-full">
        <div
          className={
            hasApiBanner
              ? "relative w-full overflow-hidden rounded-[28px] bg-white shadow-2 sm:rounded-[36px]"
              : "relative h-[360px] overflow-hidden rounded-[28px] bg-[#241827] shadow-2 sm:h-[460px] sm:rounded-[36px] lg:h-[560px] xl:h-[650px]"
          }
        >
          {hasApiBanner ? (
            <img
              src={image}
              alt={banner?.titulo || "Banner de campanha Maggenta"}
              loading="eager"
              className="block h-auto w-full"
            />
          ) : (
            <Image
              src={image}
              alt={banner?.titulo || "Banner de campanha Maggenta"}
              fill
              priority={Boolean(banner)}
              sizes="100vw"
              className="object-cover opacity-70"
            />
          )}
          {hasApiBanner && banner?.url && (
            <Link
              href={banner.url}
              aria-label={banner.titulo || "Ver campanha"}
              className="absolute inset-0 z-10"
            />
          )}
          {!hasApiBanner && (
            <Image
              src="/images/countdown/countdown-01.png"
              alt="Produto em destaque"
              width={560}
              height={520}
              className="absolute bottom-0 right-4 hidden h-auto w-[38vw] max-w-[560px] object-contain lg:block"
            />
          )}
          {!hasApiBanner && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-[#241827] via-[#241827]/70 to-transparent" />

              <div className="relative z-10 flex h-full max-w-[720px] flex-col justify-center px-5 sm:px-10 lg:px-16">
                <span className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
                  Nao perca
                </span>
                <h2 className="text-3xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                  {title}
                </h2>
                <p className="mt-5 max-w-[520px] leading-7 text-white/82">
                  Banner full-width preparado para campanhas com imagem, colecao,
                  promocao ou lancamento.
                </p>
                <Link
                  href={href}
                  className="mt-8 inline-flex w-fit rounded-full bg-blue px-9 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(178,22,104,0.24)] duration-200 hover:bg-blue-dark"
                >
                  Solicitar orcamento
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="overflow-hidden py-14">
      <div className="mx-auto w-full max-w-[1800px] px-2 sm:px-3">
      <div className={hasMobileBanner ? "hidden sm:block" : ""}>
        {renderBanner(desktopBanner)}
      </div>
      {hasMobileBanner && <div className="sm:hidden">{renderBanner(mobileBanner)}</div>}
      </div>
    </section>
  );
};

export default CounDown;
