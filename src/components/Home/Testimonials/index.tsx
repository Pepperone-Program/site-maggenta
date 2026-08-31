"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import testimonialsData from "./testimonialsData";
import Image from "next/image";

import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "./SingleItem";

const Testimonials = () => {
  const testimonials = testimonialsData;
  const renderCarousel = (reverseDirection = false) => (
    <Swiper
      loop
      speed={4160}
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        reverseDirection,
      }}
      modules={[Autoplay]}
      slidesPerView={1}
      spaceBetween={12}
      allowTouchMove={false}
      breakpoints={{
        0: {
          slidesPerView: 1.18,
        },
        1000: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
      }}
      className="bg-transparent [&_.swiper-slide]:bg-transparent [&_.swiper-wrapper]:items-stretch [&_.swiper-wrapper]:ease-linear"
    >
      {testimonials.map((item, key) => (
        <SwiperSlide key={`${reverseDirection ? "reverse" : "forward"}-${key}`} className="!h-auto !bg-transparent">
          <SingleItem testimonial={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );

  return (
    <section className="overflow-hidden bg-transparent pb-10 pt-10 sm:pb-16.5 sm:pt-20">
      <div className="mx-auto w-full max-w-[1800px] bg-transparent px-2 sm:px-3">
        <div className="bg-transparent">
          <div className="swiper testimonial-carousel common-carousel bg-transparent px-1 py-3 sm:p-5">
            {/* <!-- section title --> */}
            <div className="relative mb-5 flex items-center justify-center text-center sm:mb-10">
              <div>
                <span className="flex items-center justify-center gap-2.5 font-medium text-black mb-1.5">
                  <Image
                    src="/images/icons/icon-08.svg"
                    alt="icon"
                    width={17}
                    height={17}
                  />
                  Depoimentos
                </span>
                <h2 className="text-lg font-semibold text-black sm:text-xl xl:text-heading-5">
                  O que nossos clientes dizem
                </h2>
              </div>

            </div>

            <div className="space-y-3 bg-transparent sm:space-y-5">
              {renderCarousel(false)}
              {renderCarousel(true)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
