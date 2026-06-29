"use client";

import React, { useCallback } from "react";
import { minimumCartQuantity, useAddProductToCart } from "@/lib/hooks/useAddProductToCart";
import type { Product } from "@/types/product";

type ProductQuoteButtonProps = {
  item: Product;
  className: string;
  autoClosePreviewMs?: number;
};

const ProductQuoteButton = ({
  item,
  className,
  autoClosePreviewMs = 3500,
}: ProductQuoteButtonProps) => {
  const addProductToCart = useAddProductToCart();

  const handleAddToCart = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      addProductToCart(item, minimumCartQuantity(item), { autoClosePreviewMs });
    },
    [addProductToCart, autoClosePreviewMs, item]
  );

  return (
    <button type="button" onClick={handleAddToCart} className={className}>
      Orçar
    </button>
  );
};

export default ProductQuoteButton;
