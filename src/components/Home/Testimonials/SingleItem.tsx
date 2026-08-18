import React from "react";
import { Testimonial } from "@/types/testimonial";
import Image from "next/image";

const SingleItem = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="m-1 flex h-full min-h-[210px] flex-col rounded-[18px] bg-white px-3 py-4 shadow-[0_12px_30px_rgba(75,37,66,0.09)] sm:min-h-[310px] sm:rounded-[28px] sm:px-8.5 sm:py-7.5 sm:shadow-[0_18px_44px_rgba(75,37,66,0.10)]">
      <p className="mb-4 line-clamp-4 text-[13px] leading-[19px] text-dark sm:mb-6 sm:line-clamp-none sm:text-base sm:leading-normal">{testimonial.review}</p>

      <a href="#" className="mt-auto flex items-center gap-2.5 sm:gap-4">
        <div className="h-9 w-9 overflow-hidden rounded-full sm:h-12.5 sm:w-12.5">
          <Image
            src={testimonial.authorImg}
            alt="author"
            className="h-9 w-9 overflow-hidden rounded-full sm:h-12.5 sm:w-12.5"
            width={50}
            height={50}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium leading-5 text-dark sm:text-base sm:leading-normal">{testimonial.authorName}</h3>
          <p className="text-[11px] leading-4 sm:text-custom-sm sm:leading-normal">{testimonial.authorRole}</p>
        </div>
      </a>
    </div>
  );
};

export default SingleItem;
