import React from "react";
import Link from "next/link";
import ImageWithFallback from "@/components/Common/ImageWithFallback";
import { Product } from "@/types/product";
import { formatDisplayPrice, productPath } from "@/lib/products";
import ProductQuoteButton from "@/components/Shop/ProductQuoteButton";
import ProductSpecsSummary from "@/components/Common/ProductSpecsSummary";

const ProductItem = ({ item }: { item: Product }) => {
  const href = productPath(item);
  const normalizedCode = String(item.codigo || "").trim();
  const primaryImage = item.imgs.previews[0];
  const hoverImage = item.imgs.previews[1] || primaryImage;

  return (
    <div className="group flex h-full min-h-[300px] flex-col rounded-[18px] border border-transparent bg-white p-2.5 text-center shadow-[0_10px_24px_rgba(157,23,77,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-blue/45 hover:shadow-[0_20px_42px_rgba(157,23,77,0.14)] sm:min-h-[430px] sm:rounded-[28px] sm:p-4 sm:shadow-[0_14px_34px_rgba(157,23,77,0.08)]">
      <div className="relative mb-2.5 flex aspect-square w-full items-center justify-center overflow-hidden rounded-[16px] bg-gray-2 p-2 sm:mb-4 sm:rounded-[24px] sm:p-3">
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
            sizes="(min-width: 1536px) 340px, (min-width: 1280px) 20vw, (min-width: 640px) 50vw, 50vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23f0f0f0' width='400' height='400'/%3E%3C/svg%3E"
            className="object-contain transition-opacity duration-500 group-hover:opacity-0"
            loading="lazy"
          />
          <ImageWithFallback
            src={hoverImage}
            alt={`${item.title} - segunda imagem`}
            fill
            sizes="(min-width: 1536px) 340px, (min-width: 1280px) 20vw, (min-width: 640px) 50vw, 50vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23f0f0f0' width='400' height='400'/%3E%3C/svg%3E"
            className="object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            loading="lazy"
          />
        </Link>
      </div>

      <p className="mb-1 text-[11px] font-medium leading-4 text-blue sm:text-custom-sm sm:leading-normal">{item.category}</p>

      <p
        className="mb-1 min-h-[38px] overflow-hidden text-[13px] font-medium leading-[19px] text-dark duration-200 hover:text-blue sm:min-h-[48px] sm:text-base sm:leading-6"
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

      <ProductSpecsSummary dimensions={item.dimensions} className="mb-2" />

      {normalizedCode && (
        <span className="mb-3 text-[11px] leading-4 text-dark-4 transition-all hover:text-dark sm:mb-5 sm:text-normal sm:leading-normal">
          Código: {normalizedCode}
        </span>
      )}

      {item.discountedPrice > 0 ? (
        <span className="mt-auto flex items-center justify-center gap-2 font-medium text-lg">
          <span className="text-dark">{formatDisplayPrice(item.discountedPrice)}</span>
          {item.price > 0 && (
            <span className="text-dark-4 line-through">{formatDisplayPrice(item.price)}</span>
          )}
        </span>
      ) : (
        <div className="mt-auto flex justify-center">
          <ProductQuoteButton
            item={item}
            autoClosePreviewMs={3000}
            className="inline-flex min-h-9 w-full items-center justify-center rounded-full bg-blue px-3 py-2 text-[11px] font-medium leading-4 text-white shadow-[0_10px_22px_rgba(157,23,77,0.22)] duration-200 hover:bg-blue-dark sm:min-h-0 sm:px-6 sm:py-2.5 sm:text-custom-sm sm:leading-normal sm:shadow-[0_14px_30px_rgba(157,23,77,0.24)]"
          />
        </div>
      )}
    </div>
  );
};

export default ProductItem;
