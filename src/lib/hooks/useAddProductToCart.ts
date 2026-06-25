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

type AddProductToCartOptions = {
  openCartPreview?: boolean;
  autoClosePreviewMs?: number;
};

export const minimumCartQuantity = (product: Pick<CartProduct, "quantidadeMinima">) =>
  Math.max(1, Number(product.quantidadeMinima || 1));

export const useAddProductToCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { openCartModal, closeCartModal } = useCartModalContext();

  return useCallback(
    (
      product: CartProduct,
      quantity?: number,
      options: AddProductToCartOptions = {}
    ) => {
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

      if (options.openCartPreview !== false) {
        openCartModal();

        if (options.autoClosePreviewMs && options.autoClosePreviewMs > 0) {
          window.setTimeout(() => {
            closeCartModal();
          }, options.autoClosePreviewMs);
        }
      }

      return safeQuantity;
    },
    [dispatch, openCartModal, closeCartModal]
  );
};
