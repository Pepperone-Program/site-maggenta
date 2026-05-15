"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/features/cart-slice";
import { AppDispatch } from "@/redux/store";
import { productPath } from "@/lib/products";
import { Product } from "@/types/product";

const SingleGridItem = ({ item }: { item: Product }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        quantity: Math.max(1, Number(item.quantidadeMinima || 1)),
      })
    );
  };

  return (
    <div className="group flex h-full flex-col">
      <div className="relative mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-white p-2 shadow-1">
        <Link
          href={productPath(item)}
          aria-label={`Ver detalhes de ${item.title}`}
          className="relative block h-full w-full"
        >
          <Image
            src={item.imgs.previews[0]}
            alt={item.title}
            fill
            sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain transition-opacity duration-500 group-hover:opacity-0"
          />
          <Image
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

        <p className="text-custom-sm">({item.reviews} avaliações)</p>
      </div>

      <p
        className="mb-1.5 min-h-[48px] overflow-hidden text-center font-medium leading-6 text-dark duration-200 hover:text-blue"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
        }}
      >
        <Link href={productPath(item)}>{item.title}</Link>
      </p>

      <p className="mb-3 text-center text-custom-sm font-medium text-dark-4">
        Código: {item.codigo}
      </p>

      <button
        type="button"
        onClick={handleAddToCart}
        className="mx-auto mt-auto flex min-h-11 w-full max-w-[220px] items-center justify-center rounded-[5px] bg-blue px-5 py-2 text-custom-sm font-medium text-white duration-200 hover:bg-blue-dark"
      >
        Orçar
      </button>
    </div>
  );
};

export default SingleGridItem;
