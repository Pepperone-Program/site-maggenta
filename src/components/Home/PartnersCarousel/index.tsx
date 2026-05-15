"use client";

import Image from "next/image";
import { useRef } from "react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./partners-carousel.css";

const partners = [
  "AMANCO.png",
  "BANCO DO BRASIL.png",
  "BIOMUNDO.png",
  "CAIXA.png",
  "CONTINENTAL.png",
  "DAF.png",
  "DAIKIN.png",
  "DUNKIN.png",
  "FACULDADE BELA VISTA.png",
  "FUVEST.png",
  "MOVECTA.png",
  "SICOOB.png",
  "SIEMENS.png",
  "TE CONNECTIVITY.png",
  "UNILEVER.png",
  "UNIMED.png",
  "VEDACIT.png",
  "WTW.png",
  "YOKOHAMA.png",
];

const partnerName = (file: string) => file.replace(/\.png$/i, "");

const PartnersCarousel = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  const pauseCarousel = () => {
    swiperRef.current?.autoplay?.stop();
  };

  const resumeCarousel = () => {
    swiperRef.current?.autoplay?.start();
  };

  return (
    <section className="bg-white py-4">
      <div className="mx-auto w-full max-w-[1800px] px-2 sm:px-3">
        <div className="mb-7 text-center">
          <h2 className="text-2xl font-semibold text-dark">
            Empresas que confiam em nosso trabalho
          </h2>
        </div>

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          loop
          speed={4500}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          modules={[Autoplay]}
          spaceBetween={18}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            900: { slidesPerView: 4 },
            1200: { slidesPerView: 6 },
            1536: { slidesPerView: 7 },
          }}
          className="partners-carousel"
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={partner}>
              <div className="flex h-24 items-center justify-center rounded-md bg-white px-5 shadow-1">
                <Image
                  src={`/images/parceiros/${partner}`}
                  alt={`Logo ${partnerName(partner)}`}
                  width={170}
                  height={72}
                  priority={index < 7}
                  sizes="(min-width: 1536px) 220px, (min-width: 1200px) 16vw, (min-width: 640px) 33vw, 50vw"
                  className="max-h-14 w-auto object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PartnersCarousel;
