"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import { formatDisplayPrice, productPath } from "@/lib/products";

const ProductItem = ({ item }: { item: Product }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        quantity: 1,
      })
    );
  };

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
            className="object-contain transition-opacity duration-500 group-hover:opacity-0"
          />
          <Image
            src={item.imgs.previews[1] || item.imgs.previews[0]}
            alt={`${item.title} - segunda imagem`}
            fill
            sizes="(min-width: 1536px) 340px, (min-width: 1280px) 20vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </Link>
      </div>

      <p className="mb-1 text-custom-sm font-medium text-blue">{item.category}</p>

      <h3
        className="mb-1 min-h-[48px] overflow-hidden font-medium leading-6 text-dark ease-out duration-200 hover:text-blue"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
        }}
      >
        <Link href={productPath(item)}> {item.title} </Link>
      </h3>

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
            onClick={() => handleAddToCart()}
            className="inline-flex w-full justify-center rounded-[5px] bg-blue px-6 py-2 text-custom-sm font-medium text-white duration-200 hover:bg-blue-dark"
          >
            Orçar
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductItem;
