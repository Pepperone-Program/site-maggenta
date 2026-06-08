import { Category } from "@/types/category";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { isValidImageSrc } from "@/lib/images";
import { friendlyPersonalizedParam } from "@/lib/slugs";

const SingleItem = ({ item, priority = false }: { item: Category; priority?: boolean }) => {
  const hasImage = isValidImageSrc(item.img);

  return (
    <Link
      href={`/categorias/${encodeURIComponent(
        friendlyPersonalizedParam(item.id, item.title)
      )}`}
      className="group flex flex-col items-center"
    >
      <div className="max-w-[130px] w-full bg-[#fbfbfc] h-32.5 border border-gray rounded-full flex items-center justify-center mb-4">
        {hasImage ? (
          <Image
            src={item.img}
            alt={item.title}
            width={85}
            height={62}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="(min-width: 1200px) 85px, 72px"
          />
        ) : (
          <span className="text-3xl font-semibold text-blue">
            {item.title.slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex justify-center">
        <span className="inline-block font-medium text-center text-dark bg-gradient-to-r from-blue to-blue bg-[length:0px_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_1px] group-hover:text-blue">
          {item.title}
        </span>
      </div>
    </Link>
  );
};

export default SingleItem;
