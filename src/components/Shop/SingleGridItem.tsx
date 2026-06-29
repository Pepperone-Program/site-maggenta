import React from "react";
import Image from "next/image";
import Link from "next/link";
import { productPath } from "@/lib/products";
import { Product } from "@/types/product";
import ImageWithFallback from "@/components/Common/ImageWithFallback";
import { formatReviewCount, productReviewCount } from "@/lib/reviews";
import ProductQuoteButton from "./ProductQuoteButton";

const launchBadgeStyle = {
  backgroundColor: "rgb(250, 70, 22)",
};

type SingleGridItemProps = {
  item: Product;
  badgeLabel?: string;
};

const SingleGridItem = ({ item, badgeLabel }: SingleGridItemProps) => {
  const href = productPath(item);
  const reviewCount = formatReviewCount(productReviewCount(item));
  const normalizedCode = String(item.codigo || "").trim();
  const primaryImage = item.imgs.previews[0];
  const hoverImage = item.imgs.previews[1] || primaryImage;

  return (
    <div className="group flex h-full flex-col rounded-[28px] border border-transparent bg-white p-4 shadow-[0_14px_34px_rgba(157,23,77,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-blue/45 hover:shadow-[0_20px_42px_rgba(157,23,77,0.14)]">
      <div className="relative mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-[24px] bg-gray-2 p-3">
        {badgeLabel && (
          <span
            className="pointer-events-none absolute right-0 top-0 mr-2 mt-2 z-20 rounded-full bg-[rgb(250,70,22)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_8px_22px_rgba(250,70,22,0.38)] ring-1 ring-white/75"
            style={launchBadgeStyle}
          >
            {badgeLabel}
          </span>
        )}
        <Link
          href={href}
          aria-label={`Ver detalhes de ${item.title}`}
          className="relative block h-full w-full"
          prefetch={false}
        >
          <ImageWithFallback
            src={primaryImage}
            alt={item.title}
            fill
            sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain transition-opacity duration-500 group-hover:opacity-0"
            loading="lazy"
          />
          <ImageWithFallback
            src={hoverImage}
            alt={`${item.title} - segunda imagem`}
            fill
            sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            loading="lazy"
          />
        </Link>
      </div>

      <div className="mb-2 flex items-center justify-center gap-2.5">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Image
              key={star}
              src="/images/icons/icon-star.svg"
              alt="Avaliação"
              width={15}
              height={15}
            />
          ))}
        </div>

        <p className="text-custom-sm">({reviewCount} avaliações)</p>
      </div>

      <p
        className="mb-1.5 min-h-[48px] overflow-hidden text-center font-medium leading-6 text-dark duration-200 hover:text-blue"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
        }}
      >
        <Link href={href} prefetch={false}>
          {item.title}
        </Link>
      </p>

      {normalizedCode && (
        <span className="mb-3 text-center text-custom-sm font-medium text-dark-4 duration-200 hover:text-dark">
          Código: {normalizedCode}
        </span>
      )}

      <ProductQuoteButton
        item={item}
        className="mx-auto mt-auto flex min-h-11 w-full max-w-[220px] items-center justify-center rounded-full bg-blue px-5 py-2 text-custom-sm font-medium text-white shadow-[0_14px_30px_rgba(157,23,77,0.24)] duration-200 hover:bg-blue-dark"
      />
    </div>
  );
};

export default SingleGridItem;
