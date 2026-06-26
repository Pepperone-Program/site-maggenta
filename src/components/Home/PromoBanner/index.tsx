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
  const imageBanners = banners.filter((banner) => isValidImageSrc(banner.url_banner));

  if (!imageBanners.length) {
    return null;
  }

  const desktopBanners = imageBanners.filter((banner) => banner.tamanho_tela !== "mobile");
  const mobileBanners = imageBanners.filter((banner) => banner.tamanho_tela === "mobile");
  const visibleDesktopBanners = desktopBanners.length ? desktopBanners : imageBanners;
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
            {banner.url ? (
              <Link href={banner.url} aria-label={banner.titulo || "Ver campanha"}>
                <img
                  src={banner.url_banner || ""}
                  alt={banner.titulo || "Banner Maggenta"}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="block h-auto w-full"
                />
              </Link>
            ) : (
              <img
                src={banner.url_banner || ""}
                alt={banner.titulo || "Banner Maggenta"}
                loading={index === 0 ? "eager" : "lazy"}
                className="block h-auto w-full"
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
