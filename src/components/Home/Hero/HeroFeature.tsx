"use client";

import React from "react";
import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const featureData = [
  {
    img: "/images/icons/icon-01.svg",
    title: "Frete gratis",
    description: "Acima de R$349",
  },
  {
    img: "/images/icons/icon-02.svg",
    title: "Primeira troca",
    description: "Sem custo",
  },
  {
    img: "/images/icons/icon-03.svg",
    title: "Pagamento seguro",
    description: "Ambiente protegido",
  },
  {
    img: "/images/icons/icon-04.svg",
    title: "Entrega nacional",
    description: "Para todo o Brasil",
  },
];

const FeatureItem = ({ item }: { item: (typeof featureData)[number] }) => (
  <div className="flex items-center justify-center gap-4 border-gray-3 lg:border-r lg:last:border-r-0">
    <Image src={item.img} alt="" width={32} height={32} />
    <div>
      <h3 className="text-lg font-medium text-dark">{item.title}</h3>
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
