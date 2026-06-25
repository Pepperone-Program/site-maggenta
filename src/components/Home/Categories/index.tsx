"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import data from "./categoryData";
import { Category } from "@/types/category";

// Import Swiper styles
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "./SingleItem";

const Categories = ({ categories = data }: { categories?: Category[] }) => {
  const carouselCategories = [...categories, ...categories];

  return (
    <section className="overflow-hidden border-b border-gray-3 bg-white">
      <div className="w-full">
          <Swiper
            loop={carouselCategories.length > 6}
            speed={13000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            modules={[Autoplay]}
            allowTouchMove={false}
            spaceBetween={0}
            slidesPerView="auto"
            breakpoints={{
              768: { spaceBetween: 0 },
            }}
            className="[&_.swiper-wrapper]:items-center [&_.swiper-wrapper]:ease-linear"
          >
            {carouselCategories.map((item, index) => (
              <SwiperSlide key={`${item.id}-${index}`} className="!w-auto">
                <SingleItem item={item} priority={index < 6} />
              </SwiperSlide>
            ))}
          </Swiper>
      </div>
    </section>
  );
};

export default Categories;
