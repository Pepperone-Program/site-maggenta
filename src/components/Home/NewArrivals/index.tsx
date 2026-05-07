"use client";

import React from "react";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
import { Product } from "@/types/product";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

type ProductSectionProps = {
  eyebrow?: string;
  title?: string;
  products: Product[];
};

const NewArrival = ({
  eyebrow = "Destaques da semana",
  title = "Novidades",
  products,
}: ProductSectionProps) => {
  const carouselProducts =
    products.length > 1 && products.length < 10 ? [...products, ...products] : products;

  return (
    <section className="overflow-hidden pt-15">
      <div className="max-w-[1800px] w-full mx-auto px-2 sm:px-3">
        {/* <!-- section title --> */}
        <div className="relative mb-7 flex flex-col items-center text-center">
          <div>
            <span className="flex items-center justify-center gap-2.5 font-medium text-black mb-1.5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.11826 15.4622C4.11794 16.6668 5.97853 16.6668 9.69971 16.6668H10.3007C14.0219 16.6668 15.8825 16.6668 16.8821 15.4622M3.11826 15.4622C2.11857 14.2577 2.46146 12.429 3.14723 8.77153C3.63491 6.17055 3.87875 4.87006 4.8045 4.10175M3.11826 15.4622C3.11826 15.4622 3.11826 15.4622 3.11826 15.4622ZM16.8821 15.4622C17.8818 14.2577 17.5389 12.429 16.8532 8.77153C16.3655 6.17055 16.1216 4.87006 15.1959 4.10175M16.8821 15.4622C16.8821 15.4622 16.8821 15.4622 16.8821 15.4622ZM15.1959 4.10175C14.2701 3.33345 12.947 3.33345 10.3007 3.33345H9.69971C7.0534 3.33345 5.73025 3.33345 4.8045 4.10175M15.1959 4.10175C15.1959 4.10175 15.1959 4.10175 15.1959 4.10175ZM4.8045 4.10175C4.8045 4.10175 4.8045 4.10175 4.8045 4.10175Z"
                  stroke="#249230"
                  strokeWidth="1.5"
                />
                <path
                  d="M7.64258 6.66678C7.98578 7.63778 8.91181 8.33345 10.0003 8.33345C11.0888 8.33345 12.0149 7.63778 12.3581 6.66678"
                  stroke="#249230"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {eyebrow}
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-black">
              {title}
            </h2>
          </div>

          <Link
            href="/shop-with-sidebar"
            className="mt-4 inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-blue hover:text-white hover:border-transparent sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
          >
            Ver todos
          </Link>
        </div>

        <Swiper
          loop={carouselProducts.length > 1}
          autoplay={{
            delay: 3200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
            1536: { slidesPerView: 5 },
          }}
          className="pb-2 [&_.swiper-wrapper]:items-stretch"
        >
          {carouselProducts.map((item, index) => (
            <SwiperSlide key={`${item.id}-${index}`} className="!h-auto">
              <div className="h-full">
                <ProductItem item={item} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default NewArrival;
