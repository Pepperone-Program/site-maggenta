"use client";
import React, { useCallback } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import { formatDisplayPrice, productPath } from "@/lib/products";
import { showAddedToCartMessage } from "@/lib/cart-feedback";

const ProductItem = ({ item }: { item: Product }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = useCallback(() => {
    const quantity = Math.max(1, Number(item.quantidadeMinima || 1));
    dispatch(
      addItemToCart({
        ...item,
        quantity,
      })
    );
    showAddedToCartMessage(item.title, quantity);
  }, [dispatch, item]);

  return (
    <div className="group flex h-full min-h-[430px] flex-col text-center">
      <div className="relative mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-[#F6F7FB] p-2">
        <Link
          href={productPath(item)}
          aria-label={`Ver detalhes de ${item.title}`}
          className="relative block h-full w-full"
        >
          <Image
            src={item.imgs.previews[0]}
            alt={item.title}
            fill
            sizes="(min-width: 1536px) 340px, (min-width: 1280px) 20vw, (min-width: 640px) 50vw, 100vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23f0f0f0' width='400' height='400'/%3E%3C/svg%3E"
            className="object-contain transition-opacity duration-500 group-hover:opacity-0"
            loading="lazy"
          />
          <Image
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
        className="mb-1 min-h-[48px] overflow-hidden font-medium leading-6 text-dark ease-out duration-200 hover:text-blue"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
        }}
      >
        <Link href={productPath(item)}> {item.title} </Link>
      </p>

      <p className="mb-5 text-normal text-dark-4 hover:text-dark transition-all cursor-pointer">Código: {item.codigo}</p>

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
            onClick={handleAddToCart}
            className="inline-flex w-full justify-center rounded-[5px] bg-blue px-6 py-2 text-custom-sm font-medium text-white duration-200 hover:bg-blue-dark"
          >
            Orçar
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(ProductItem);
