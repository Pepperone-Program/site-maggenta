"use client";

import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { addItemToCart } from "@/redux/features/cart-slice";
import type { AppDispatch } from "@/redux/store";
import { showAddedToCartMessage } from "@/lib/cart-feedback";
import type { Product } from "@/types/product";

type CartProduct = Product & {
  quantidadeMinima?: number;
};

export const minimumCartQuantity = (product: Pick<CartProduct, "quantidadeMinima">) =>
  Math.max(1, Number(product.quantidadeMinima || 1));

export const useAddProductToCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { openCartModal } = useCartModalContext();

  return useCallback(
    (product: CartProduct, quantity?: number) => {
      const safeQuantity = Math.max(
        minimumCartQuantity(product),
        Math.floor(Number(quantity || minimumCartQuantity(product)))
      );

      dispatch(
        addItemToCart({
          ...product,
          quantity: safeQuantity,
        })
      );
      showAddedToCartMessage(product.title, safeQuantity);
      openCartModal();

      return safeQuantity;
    },
    [dispatch, openCartModal]
  );
};
