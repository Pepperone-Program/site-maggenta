"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productPath } from "@/lib/products";
import { Product } from "@/types/product";
import ImageWithFallback from "@/components/Common/ImageWithFallback";
import ProductCode from "@/components/Common/ProductCode";
import { minimumCartQuantity, useAddProductToCart } from "@/lib/hooks/useAddProductToCart";
import { formatReviewCount, productReviewCount } from "@/lib/reviews";

const launchBadgeStyle = {
  backgroundColor: "rgb(250, 70, 22)",
};

type SingleGridItemProps = {
  item: Product;
  badgeLabel?: string;
};

const SingleGridItem = ({ item, badgeLabel }: SingleGridItemProps) => {
  const router = useRouter();
  const addProductToCart = useAddProductToCart();
  const href = productPath(item);
  const reviewCount = formatReviewCount(productReviewCount(item));

  const prefetchProduct = () => {
    router.prefetch(href);
  };

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addProductToCart(item, minimumCartQuantity(item));
  };

  return (
    <div className="group flex h-full flex-col">
      <div className="relative mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-[28px] border border-white bg-white p-4 shadow-2 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-3">
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
          prefetch
          onMouseEnter={prefetchProduct}
          onFocus={prefetchProduct}
          onTouchStart={prefetchProduct}
        >
          <ImageWithFallback
            src={item.imgs.previews[0]}
            alt={item.title}
            fill
            sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain transition-opacity duration-500 group-hover:opacity-0"
          />
          <ImageWithFallback
            src={item.imgs.previews[1] || item.imgs.previews[0]}
            alt={`${item.title} - segunda imagem`}
            fill
            sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
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
        <Link
          href={href}
          prefetch
          onMouseEnter={prefetchProduct}
          onFocus={prefetchProduct}
          onTouchStart={prefetchProduct}
        >
          {item.title}
        </Link>
      </p>

      <ProductCode
        code={item.codigo}
        className="mb-3 text-center text-custom-sm font-medium text-dark-4 duration-200 hover:text-dark"
      />

      <button
        type="button"
        onClick={handleAddToCart}
        className="mx-auto mt-auto flex min-h-11 w-full max-w-[220px] items-center justify-center rounded-full bg-blue px-5 py-2 text-custom-sm font-medium text-white shadow-[0_14px_30px_rgba(178,22,104,0.24)] duration-200 hover:bg-blue-dark"
      >
        Orçar
      </button>
    </div>
  );
};

export default SingleGridItem;
