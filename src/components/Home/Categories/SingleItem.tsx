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
      className="group flex h-20 min-w-max items-center gap-2 px-3"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
        {hasImage ? (
          <Image
            src={item.img}
            alt={item.title}
            width={44}
            height={44}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="44px"
            className="max-h-11 w-auto object-contain"
          />
        ) : (
          <span className="text-xl font-semibold text-blue">
            {item.title.slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>

      <span className="whitespace-nowrap text-base font-semibold text-dark transition-colors duration-200 group-hover:text-blue">
        {item.title}
      </span>
    </Link>
  );
};

export default SingleItem;
