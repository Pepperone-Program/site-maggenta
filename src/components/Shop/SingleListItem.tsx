"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/features/cart-slice";
import { AppDispatch } from "@/redux/store";
import { productPath } from "@/lib/products";
import { Product } from "@/types/product";

const SingleListItem = ({ item }: { item: Product }) => {
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
    <div className="group rounded-lg bg-white shadow-1">
      <div className="flex flex-col sm:flex-row">
        <div className="shadow-list relative flex aspect-square w-full max-w-full items-center justify-center overflow-hidden p-4 sm:max-w-[270px]">
          <Link
            href={productPath(item)}
            aria-label={`Ver detalhes de ${item.title}`}
            className="relative block h-full w-full"
          >
            <Image
              src={item.imgs.previews[0]}
              alt={item.title}
              fill
              sizes="270px"
              className="object-contain transition-opacity duration-500 group-hover:opacity-0"
            />
            <Image
              src={item.imgs.previews[1] || item.imgs.previews[0]}
              alt={`${item.title} - segunda imagem`}
              fill
              sizes="270px"
              className="object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          </Link>
        </div>

        <div className="flex w-full flex-col items-center justify-center px-4 py-5 text-center sm:items-start sm:px-7.5 sm:text-left lg:pl-11 lg:pr-12">
          <p className="mb-1.5 font-medium text-dark duration-200 hover:text-blue">
            <Link href={productPath(item)}>{item.title}</Link>
          </p>

          <p className="mb-4 text-custom-sm font-medium text-dark-4">
            Código: {item.codigo}
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex min-h-11 w-full max-w-[220px] items-center justify-center rounded-[5px] bg-blue px-5 py-2 text-custom-sm font-medium text-white duration-200 hover:bg-blue-dark"
          >
            Orçar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleListItem;
