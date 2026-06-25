"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import ImageWithFallback from "@/components/Common/ImageWithFallback";
import ProductCode from "@/components/Common/ProductCode";
import { Product } from "@/types/product";
import { formatDisplayPrice, productPath } from "@/lib/products";
import { minimumCartQuantity, useAddProductToCart } from "@/lib/hooks/useAddProductToCart";

const ProductItem = ({ item }: { item: Product }) => {
  const addProductToCart = useAddProductToCart();
  const href = productPath(item);

  const handleAddToCart = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      addProductToCart(item, minimumCartQuantity(item), { autoClosePreviewMs: 3000 });
    },
    [addProductToCart, item]
  );

  return (
    <div className="group flex h-full min-h-[430px] flex-col rounded-[28px] border border-transparent bg-white p-4 text-center shadow-[0_14px_34px_rgba(157,23,77,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-blue/45 hover:shadow-[0_20px_42px_rgba(157,23,77,0.14)]">
      <div className="relative mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-[24px] bg-gray-2 p-3">
        <Link
          href={href}
          aria-label={`Ver detalhes de ${item.title}`}
          className="relative block h-full w-full"
        >
          <ImageWithFallback
            src={item.imgs.previews[0]}
            alt={item.title}
            fill
            sizes="(min-width: 1536px) 340px, (min-width: 1280px) 20vw, (min-width: 640px) 50vw, 100vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23f0f0f0' width='400' height='400'/%3E%3C/svg%3E"
            className="object-contain transition-opacity duration-500 group-hover:opacity-0"
            loading="lazy"
          />
          <ImageWithFallback
            src={item.imgs.previews[1] || item.imgs.previews[0]}
            alt={`${item.title} - segunda imagem`}
            fill
            sizes="(min-width: 1536px) 340px, (min-width: 1280px) 20vw, (min-width: 640px) 50vw, 100vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23f0f0f0' width='400' height='400'/%3E%3C/svg%3E"
            className="object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            loading="lazy"
          />
        </Link>
      </div>

      <p className="mb-1 text-custom-sm font-medium text-blue">{item.category}</p>

      <p
        className="mb-1 min-h-[48px] overflow-hidden font-medium leading-6 text-dark duration-200 hover:text-blue"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
        }}
      >
        <Link href={href}>{item.title}</Link>
      </p>

      <ProductCode
        code={item.codigo}
        className="mb-5 text-normal text-dark-4 transition-all hover:text-dark"
      />

      {item.discountedPrice > 0 ? (
        <span className="mt-auto flex items-center justify-center gap-2 font-medium text-lg">
          <span className="text-dark">{formatDisplayPrice(item.discountedPrice)}</span>
          {item.price > 0 && (
            <span className="text-dark-4 line-through">
              {formatDisplayPrice(item.price)}
            </span>
          )}
        </span>
      ) : (
        <div className="mt-auto flex justify-center">
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex w-full justify-center rounded-full bg-blue px-6 py-2.5 text-custom-sm font-medium text-white shadow-[0_14px_30px_rgba(157,23,77,0.24)] duration-200 hover:bg-blue-dark"
          >
            Orçar
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(ProductItem);
