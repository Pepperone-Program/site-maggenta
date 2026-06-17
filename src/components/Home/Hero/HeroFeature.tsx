"use client";

import React from "react";
import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const featureData = [
  {
    img: "/images/icons/icon-01.svg",
    title: "Personalização própria",
    description: "Qualidade muito maior",
  },
  {
    img: "/images/icons/icon-02.svg",
    title: "Vitrine Infinita",
    description: "Conheça nosso vasto catálogo de produtos",
  },
  {
    img: "/images/icons/icon-03.svg",
    title: "Pagamento seguro",
    description: "Ambiente protegido",
  },
  {
    img: "/images/icons/icon-04.svg",
    title: "Entrega nacional",
    description: "Mediante consulta prévia",
  },
];

const FeatureItem = ({ item }: { item: (typeof featureData)[number] }) => (
  <div className="flex items-center justify-center gap-4 border-gray-3 lg:border-r lg:last:border-r-0">
    <Image src={item.img} alt={`Icone de ${item.title}`} width={32} height={32} />
    <div>
      <p className="text-lg font-medium text-dark">{item.title}</p>
      <p className="text-sm">{item.description}</p>
    </div>
  </div>
);

const HeroFeature = () => {
  return (
    <div className="w-full border-b border-gray-3 bg-white">
      <div className="sm:hidden">
        <Swiper
          loop
          autoplay={{
            delay: 2400,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          slidesPerView={1}
          className="px-4 py-6"
        >
          {featureData.map((item) => (
            <SwiperSlide key={item.title}>
              <FeatureItem item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="mx-auto hidden max-w-[1800px] grid-cols-2 gap-6 px-4 py-8 sm:grid sm:px-8 lg:grid-cols-4 xl:px-0">
        {featureData.map((item) => (
          <FeatureItem item={item} key={item.title} />
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;
