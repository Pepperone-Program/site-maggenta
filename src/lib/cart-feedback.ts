"use client";

import { toast } from "sonner";

export const showAddedToCartMessage = (title: string, quantity: number) => {
  toast.success("Produto adicionado ao orçamento", {
    description: `${title} - Quantidade: ${quantity}`,
    duration: 2500,
  });
};
