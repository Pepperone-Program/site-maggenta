"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import type { BannerApi } from "@/lib/api";

const slides = [
  {
    id: "fallback-1",
    eyebrow: "Coleção outdoor 2026",
    title: "Equipamentos para quem escolhe o caminho longo",
    description:
      "Mochilas, jaquetas e acessórios técnicos para trilhas, viagens e clima imprevisível.",
    image: "/images/hero/hero-bg.png",
    href: "/brindes-personalizados",
    cta: "Solicitar orçamento",
  },
  {
    id: "fallback-2",
    eyebrow: "Mais vendido",
    title: "Mochilas prontas para travessias e rotina",
    description:
      "Organização, conforto e resistência para carregar melhor em qualquer percurso.",
    image: "/images/products/product-1-bg-1.png",
    href: "/produto/mochila-expedition-42l",
    cta: "Orçar mochila",
  },
  {
    id: "fallback-3",
    eyebrow: "Camadas técnicas",
    title: "Proteção para vento, chuva e mudança de tempo",
    description:
      "Jaquetas compactáveis e roupas de secagem rápida para manter o ritmo.",
    image: "/images/products/product-2-bg-1.png",
    href: "/brindes-personalizados",
    cta: "Orçar seleção",
  },
];

type HeroProps = {
  banners?: BannerApi[];
};

const Hero = ({ banners = [] }: HeroProps) => {
  const desktopBanners = banners.filter((banner) => banner.tamanho_tela !== "mobile");
  const mobileBanners = banners.filter((banner) => banner.tamanho_tela === "mobile");
  const buildSlides = (items: BannerApi[]) =>
    items.length
      ? items.map((banner) => ({
        id: String(banner.id_banner),
        eyebrow: "Maggenta",
        title: banner.titulo || "Maggenta Brindes",
        description: "",
        image: banner.url_banner || "",
        href: banner.url || "/brindes-personalizados",
        cta: "Ver campanha",
      }))
      : slides;
  const desktopSlides = buildSlides(desktopBanners.length ? desktopBanners : banners);
  const mobileSlides = buildSlides(mobileBanners);
  const hasMobileBanners = mobileBanners.length > 0;

  const renderCarousel = (carouselSlides: typeof desktopSlides, mobile = false) => (
    <Swiper
      loop
      autoplay={{
        delay: 4200,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel overflow-hidden"
    >
      {carouselSlides.map((slide, index) => (
        <SwiperSlide key={`${mobile ? "mobile" : "desktop"}-${slide.id}`}>
          <div
            className={
              banners.length
                ? "relative w-full overflow-hidden bg-white"
                : "relative h-[420px] overflow-hidden rounded-[28px] bg-[#1c1917] shadow-2 sm:h-[520px] sm:rounded-[36px] lg:h-[650px] 2xl:h-[720px]"
            }
          >
            {banners.length ? (
              <img
                src={slide.image}
                alt={slide.title}
                loading={index === 0 ? "eager" : "lazy"}
                className="block h-auto w-full"
              />
            ) : (
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover ${
                  slide.image.includes("/products/")
                    ? "object-[78%_50%] opacity-68"
                    : "opacity-78"
                }`}
              />
            )}
            {!banners.length && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#1c1917]/88 via-[#1c1917]/48 to-[#1c1917]/10" />
            )}
            {banners.length > 0 && (
              <Link
                href={slide.href}
                aria-label={slide.title}
                className="absolute inset-0 z-10"
              />
            )}

            <div className="relative z-20 flex h-full max-w-[860px] flex-col justify-center px-5 sm:px-10 lg:px-16">
              {!banners.length && (
                <span className="mb-5 inline-flex w-fit rounded-full bg-white/14 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white ring-1 ring-white/25">
                  {slide.eyebrow}
                </span>
              )}
              {!banners.length && (
                <>
                  {React.createElement(
                    index === 0 ? "h1" : "h2",
                    {
                      className:
                        "text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-[72px]",
                    },
                    slide.title
                  )}
                  <p className="mt-5 max-w-[620px] text-base leading-7 text-white/85 sm:text-lg">
                    {slide.description}
                  </p>
                </>
              )}
              <Link
                href={slide.href}
                className={`inline-flex w-fit rounded-full bg-blue px-8 py-3.5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(157,23,77,0.28)] duration-200 hover:bg-blue-dark ${
                  banners.length ? "sr-only" : "mt-8"
                }`}
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );

  return (
    <section className="overflow-hidden bg-[#f5f5f4] pt-[132px] sm:pt-[124px]">
      {banners.length > 0 && (
        <h1 className="sr-only">Maggenta Brindes Corporativos Personalizados para Empresas</h1>
      )}
      <div className="w-full">
        <div className={hasMobileBanners ? "hidden sm:block" : ""}>
          {renderCarousel(desktopSlides)}
        </div>
        {hasMobileBanners && (
          <div className="sm:hidden">
            {renderCarousel(mobileSlides, true)}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
