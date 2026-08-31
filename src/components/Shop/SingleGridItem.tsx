import React from "react";
import Link from "next/link";
import { productPath } from "@/lib/products";
import { Product } from "@/types/product";
import ImageWithFallback from "@/components/Common/ImageWithFallback";
import ProductSpecsSummary from "@/components/Common/ProductSpecsSummary";
import ProductQuoteButton from "./ProductQuoteButton";

const launchBadgeStyle = {
  backgroundColor: "rgb(250, 70, 22)",
};

type SingleGridItemProps = {
  item: Product;
  badgeLabel?: string;
  priority?: boolean;
};

const SingleGridItem = ({ item, badgeLabel, priority = false }: SingleGridItemProps) => {
  const href = productPath(item);
  const normalizedCode = String(item.codigo || "").trim();
  const primaryImage = item.imgs.previews[0];
  const hoverImage = item.imgs.previews[1] || primaryImage;

  return (
    <div className="group flex h-full flex-col rounded-[18px] border border-transparent bg-white p-2.5 shadow-[0_10px_24px_rgba(157,23,77,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-blue/45 hover:shadow-[0_20px_42px_rgba(157,23,77,0.14)] sm:rounded-[28px] sm:p-4 sm:shadow-[0_14px_34px_rgba(157,23,77,0.08)]">
      <div className="relative mb-2.5 flex aspect-square w-full items-center justify-center overflow-hidden rounded-[16px] bg-gray-2 p-2 sm:mb-4 sm:rounded-[24px] sm:p-3">
        {badgeLabel && (
          <span
            className="pointer-events-none absolute right-0 top-0 z-20 mr-1.5 mt-1.5 rounded-full bg-[rgb(250,70,22)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_8px_22px_rgba(250,70,22,0.38)] ring-1 ring-white/75 sm:mr-2 sm:mt-2 sm:px-3 sm:py-1 sm:text-[11px] sm:tracking-[0.14em]"
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
            sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
            className="object-contain transition-opacity duration-500 group-hover:opacity-0"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
          <ImageWithFallback
            src={hoverImage}
            alt={`${item.title} - segunda imagem`}
            fill
            sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
            className="object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            loading="lazy"
          />
        </Link>
      </div>

      <p
        className="mb-1 min-h-[38px] overflow-hidden text-center text-[13px] font-medium leading-[19px] text-dark duration-200 hover:text-blue sm:mb-1.5 sm:min-h-[48px] sm:text-base sm:leading-6"
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

      <ProductSpecsSummary dimensions={item.dimensions} className="mb-2 text-center" />

      {normalizedCode && (
        <span className="mb-3 text-center text-[11px] font-medium leading-4 text-dark-4 duration-200 hover:text-dark sm:text-custom-sm sm:leading-normal">
          Código: {normalizedCode}
        </span>
      )}

      <ProductQuoteButton
        item={item}
        className="mx-auto mt-auto max-w-[260px]"
      />
    </div>
  );
};

export default SingleGridItem;
