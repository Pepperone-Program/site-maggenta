"use client";

import Image from "next/image";
import { Autoplay } from "swiper/modules";
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
  return (
    <section className="bg-[#f5f5f4] py-10">
      <div className="mx-auto w-full max-w-[1800px] px-2 sm:px-3">
        <div className="mb-7 text-center">
          <h2 className="text-2xl font-semibold text-dark">
            Empresas que confiam em nosso trabalho
          </h2>
        </div>

        <Swiper
          loop
          centeredSlides
          speed={500}
          autoplay={{
            delay: 800,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          modules={[Autoplay]}
          spaceBetween={14}
          slidesPerView={3}
          breakpoints={{
            640: { slidesPerView: 5, spaceBetween: 18 },
          }}
          className="partners-carousel"
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={partner}>
              <div className="partner-logo-card flex h-24 items-center justify-center rounded-[24px] bg-transparent px-5">
                <Image
                  src={`/images/parceiros/${partner}`}
                  alt={`Logo ${partnerName(partner)}`}
                  width={170}
                  height={72}
                  priority={index < 7}
                  sizes="(min-width: 640px) 20vw, 33vw"
                  className="max-h-14 w-auto object-contain transition-all duration-500"
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
