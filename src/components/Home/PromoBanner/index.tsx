"use client";

import React from "react";
import Link from "next/link";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import type { BannerApi } from "@/lib/api";

type PromoBannerProps = {
  banners?: BannerApi[];
};

const PromoBanner = ({ banners = [] }: PromoBannerProps) => {
  if (banners.length) {
    const desktopBanners = banners.filter((banner) => banner.tamanho_tela !== "mobile");
    const mobileBanners = banners.filter((banner) => banner.tamanho_tela === "mobile");
    const visibleDesktopBanners = desktopBanners.length ? desktopBanners : banners;
    const hasMobileBanners = mobileBanners.length > 0;
    const renderBanners = (items: BannerApi[], mobile = false) => (
      <Swiper
        loop={items.length > 1}
        autoplay={{
          delay: 4200,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        className="promo-banner-carousel"
      >
        {items.map((banner, index) => (
          <SwiperSlide key={`${mobile ? "mobile" : "desktop"}-${banner.id_banner}`}>
            <div className="relative w-full overflow-hidden bg-white">
              <img
                src={banner.url_banner || ""}
                alt={banner.titulo || "Banner Pepperone"}
                loading={index === 0 ? "eager" : "lazy"}
                className="block h-auto w-full"
              />
              {banner.url && (
                <Link
                  href={banner.url}
                  aria-label={banner.titulo || "Ver campanha"}
                  className="absolute inset-0 z-10"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );

    return (
      <section className="overflow-hidden py-20">
        <div className="w-full">
          <div className={hasMobileBanners ? "hidden sm:block" : ""}>
            {renderBanners(visibleDesktopBanners)}
          </div>
          {hasMobileBanners && (
            <div className="sm:hidden">
              {renderBanners(mobileBanners, true)}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden py-20">
      <div className="w-full">
        <div className="relative z-1 overflow-hidden bg-[#eef2ea] px-4 py-12.5 sm:px-7.5 lg:px-14 lg:py-17.5 xl:px-19 xl:py-22.5">
          <div className="max-w-[560px]">
            <span className="mb-3 block text-lg font-medium text-dark">
              Kit pronto para montanha
            </span>

            <h2 className="mb-5 text-2xl font-bold text-dark lg:text-heading-4 xl:text-heading-3">
              Ate 30% off em equipamentos selecionados
            </h2>

            <p className="max-w-[520px] leading-7">
              Combine mochila, hidratacao e camada tecnica com frete gratis em
              solicitações acima de R$349.
            </p>

            <Link
              href="/brindes-personalizados"
              className="mt-7.5 inline-flex rounded-md bg-blue px-9.5 py-[11px] text-custom-sm font-medium text-white duration-200 hover:bg-blue-dark"
            >
              Solicitar orçamento
            </Link>
          </div>

          <img
            src="/images/products/product-2-bg-1.png"
            alt="Jaqueta tecnica em oferta"
            className="absolute bottom-0 right-4 -z-1 hidden max-w-[330px] lg:block"
          />
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
