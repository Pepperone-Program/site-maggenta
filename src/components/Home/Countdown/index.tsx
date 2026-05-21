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
              ? `relative overflow-hidden bg-white ${
                  banner?.tamanho_tela === "mobile" ? "h-[520px]" : "h-[650px]"
                }`
              : "relative h-[360px] overflow-hidden bg-[#0b2f2b] sm:h-[460px] lg:h-[560px] xl:h-[650px]"
          }
        >
          <Image
            src={image}
            alt={banner?.titulo || "Banner de campanha Pepperone"}
            fill
            priority={Boolean(banner)}
            sizes="100vw"
            className={hasApiBanner ? "object-contain" : "object-cover opacity-70"}
          />
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
              <div className="absolute inset-0 bg-gradient-to-r from-[#061f1c] via-[#061f1c]/70 to-transparent" />

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
                  className="mt-8 inline-flex w-fit rounded-md bg-blue px-9 py-3 text-sm font-semibold text-white duration-200 hover:bg-blue-dark"
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
      <div className={hasMobileBanner ? "hidden sm:block" : ""}>
        {renderBanner(desktopBanner)}
      </div>
      {hasMobileBanner && <div className="sm:hidden">{renderBanner(mobileBanner)}</div>}
    </section>
  );
};

export default CounDown;
