import React from "react";
import Link from "next/link";
import { productPath } from "@/lib/products";
import { Product } from "@/types/product";
import ImageWithFallback from "@/components/Common/ImageWithFallback";
import ProductQuoteButton from "./ProductQuoteButton";

const launchBadgeStyle = {
  backgroundColor: "rgb(250, 70, 22)",
};

type SingleListItemProps = {
  item: Product;
  badgeLabel?: string;
};

const SingleListItem = ({ item, badgeLabel }: SingleListItemProps) => {
  const href = productPath(item);
  const normalizedCode = String(item.codigo || "").trim();
  const primaryImage = item.imgs.previews[0];
  const hoverImage = item.imgs.previews[1] || primaryImage;

  return (
    <div className="group rounded-[28px] border border-transparent bg-white shadow-[0_14px_34px_rgba(157,23,77,0.08)] transition-all duration-300 hover:border-blue/45 hover:shadow-[0_20px_42px_rgba(157,23,77,0.14)]">
      <div className="flex flex-col sm:flex-row">
        <div className="relative flex aspect-square w-full max-w-full items-center justify-center overflow-hidden rounded-[28px] bg-gray-2 p-4 sm:max-w-[270px]">
          {badgeLabel && (
            <span
              className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-[rgb(250,70,22)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_8px_22px_rgba(250,70,22,0.38)] ring-1 ring-white/75"
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
              sizes="270px"
              className="object-contain transition-opacity duration-500 group-hover:opacity-0"
              loading="lazy"
            />
            <ImageWithFallback
              src={hoverImage}
              alt={`${item.title} - segunda imagem`}
              fill
              sizes="270px"
              className="object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              loading="lazy"
            />
          </Link>
        </div>

        <div className="flex w-full flex-col items-center justify-center px-4 py-5 text-center sm:items-start sm:px-7.5 sm:text-left lg:pl-11 lg:pr-12">
          <p className="mb-1.5 font-medium text-dark duration-200 hover:text-blue">
            <Link href={href} prefetch={false}>
              {item.title}
            </Link>
          </p>

          {normalizedCode && (
            <span className="mb-4 text-custom-sm font-medium text-dark-4 duration-200 hover:text-dark">
              Código: {normalizedCode}
            </span>
          )}

          <ProductQuoteButton
            item={item}
            autoClosePreviewMs={0}
            className="flex min-h-11 w-full max-w-[220px] items-center justify-center rounded-full bg-blue px-5 py-2 text-custom-sm font-medium text-white shadow-[0_14px_30px_rgba(157,23,77,0.24)] duration-200 hover:bg-blue-dark"
          />
        </div>
      </div>
    </div>
  );
};

export default SingleListItem;
