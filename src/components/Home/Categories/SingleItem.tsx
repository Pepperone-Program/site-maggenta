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
      className="group flex h-16 min-w-max items-center gap-1.5 px-2 sm:h-20 sm:gap-2 sm:px-3"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white sm:h-12 sm:w-12">
        {hasImage ? (
          <Image
            src={item.img}
            alt={item.title}
            width={44}
            height={44}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="(min-width: 640px) 44px, 34px"
            className="h-[34px] w-[34px] rounded-full object-cover sm:h-11 sm:w-11"
          />
        ) : (
          <span className="text-base font-semibold text-blue sm:text-xl">
            {item.title.slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>

      <span className="whitespace-nowrap text-xs font-semibold text-dark transition-colors duration-200 group-hover:text-blue sm:text-base">
        {item.title}
      </span>
    </Link>
  );
};

export default SingleItem;
