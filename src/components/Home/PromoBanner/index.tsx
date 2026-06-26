"use client";

import React from "react";
import Link from "next/link";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import type { BannerApi } from "@/lib/api";
import { isValidImageSrc } from "@/lib/images";

type PromoBannerProps = {
  banners?: BannerApi[];
};

const PromoBanner = ({ banners = [] }: PromoBannerProps) => {
  if (!banners.length) {
    return null;
  }

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
          <div className="relative flex min-h-[240px] w-full items-center overflow-hidden bg-[#f5f5f4] sm:min-h-[320px] lg:min-h-[420px]">
            {isValidImageSrc(banner.url_banner) ? (
              <img
                src={banner.url_banner || ""}
                alt={banner.titulo || "Banner Maggenta"}
                loading={index === 0 ? "eager" : "lazy"}
                className="block h-auto w-full"
              />
            ) : (
              <div className="mx-auto flex w-full max-w-[1800px] flex-col items-start px-5 py-14 sm:px-10 lg:px-16">
                <span className="mb-4 inline-flex rounded-full border border-blue/25 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue">
                  Campanha Maggenta
                </span>
                <h2 className="max-w-[760px] text-3xl font-semibold leading-tight text-dark sm:text-5xl lg:text-[64px]">
                  {banner.titulo || "Campanha especial Maggenta"}
                </h2>
                <span className="mt-8 inline-flex rounded-full bg-blue px-8 py-3.5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(157,23,77,0.22)]">
                  Ver campanha
                </span>
              </div>
            )}
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
    <section className="overflow-hidden py-16">
      <div className="w-full">
        <div className={hasMobileBanners ? "hidden sm:block" : ""}>
          {renderBanners(visibleDesktopBanners)}
        </div>
        {hasMobileBanners && <div className="sm:hidden">{renderBanners(mobileBanners, true)}</div>}
      </div>
    </section>
  );
};

export default PromoBanner;
