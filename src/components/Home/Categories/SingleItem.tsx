import { Category } from "@/types/category";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { isValidImageSrc } from "@/lib/images";

const SingleItem = ({ item }: { item: Category }) => {
  const hasImage = isValidImageSrc(item.img);

  return (
    <Link
      href={`/shop-with-sidebar?categoria=${item.id}`}
      className="group flex flex-col items-center"
    >
      <div className="max-w-[130px] w-full bg-[#F2F3F8] h-32.5 rounded-full flex items-center justify-center mb-4">
        {hasImage ? (
          <Image src={item.img} alt={item.title} width={82} height={62} />
        ) : (
          <span className="text-3xl font-semibold text-blue">
            {item.title.slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex justify-center">
        <h3 className="inline-block font-medium text-center text-dark bg-gradient-to-r from-blue to-blue bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-blue">
          {item.title}
        </h3>
      </div>
    </Link>
  );
};

export default SingleItem;
