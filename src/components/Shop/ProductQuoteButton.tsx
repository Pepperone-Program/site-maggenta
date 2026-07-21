"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { minimumCartQuantity, useAddProductToCart } from "@/lib/hooks/useAddProductToCart";
import type { Product } from "@/types/product";

type ProductQuoteButtonProps = {
  item: Product;
  className: string;
};

const ProductQuoteButton = ({ item, className }: ProductQuoteButtonProps) => {
  const router = useRouter();
  const addProductToCart = useAddProductToCart();

  const handleQuote = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      addProductToCart(item, minimumCartQuantity(item), { openCartPreview: false });
      router.push("/orcamentos");
    },
    [addProductToCart, item, router]
  );

  const handleAddToCart = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      addProductToCart(item, minimumCartQuantity(item));
    },
    [addProductToCart, item]
  );

  return (
    <div
      className={`grid w-full grid-cols-[minmax(0,4fr)_minmax(0,1fr)] items-stretch gap-2 ${className}`}
    >
      <button
        type="button"
        onClick={handleQuote}
        className="flex min-h-10 min-w-0 items-center justify-center rounded-full bg-blue px-2 py-2 text-[11px] font-medium leading-4 text-white shadow-[0_10px_22px_rgba(157,23,77,0.22)] duration-200 hover:bg-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:min-h-11 sm:px-5 sm:text-custom-sm sm:leading-normal sm:shadow-[0_14px_30px_rgba(157,23,77,0.24)]"
      >
        Orçar
      </button>

      <button
        type="button"
        onClick={handleAddToCart}
        aria-label={`Adicionar ${item.title} ao carrinho`}
        title="Adicionar ao carrinho"
        className="flex min-h-10 min-w-0 items-center justify-center rounded-full border border-blue bg-white p-1 text-blue shadow-[0_10px_22px_rgba(157,23,77,0.14)] duration-200 hover:bg-blue hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:min-h-11"
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4 fill-current sm:h-5 sm:w-5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2.75 3.25a.75.75 0 0 0 0 1.5h1.12l1.5 8.25a2.75 2.75 0 0 0 2.7 2.26h8.86a2.75 2.75 0 0 0 2.68-2.12l1.1-4.7A1.75 1.75 0 0 0 19 6.3H6.12l-.38-2.08a1.18 1.18 0 0 0-1.16-.97H2.75Zm3.65 4.55h12.6a.25.25 0 0 1 .24.31l-1.1 4.69a1.25 1.25 0 0 1-1.21.96H8.07a1.25 1.25 0 0 1-1.23-1.03L5.94 7.8h.46ZM8.5 17.25a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Zm8 0a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Z" />
        </svg>
      </button>
    </div>
  );
};

export default ProductQuoteButton;
