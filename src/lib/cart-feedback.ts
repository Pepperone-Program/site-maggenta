"use client";

import { message } from "antd";

export const showAddedToCartMessage = (title: string, quantity: number) => {
  message.config({
    top: 0,
    maxCount: 3,
  });

  message.success({
    content: `${title} adicionado ao orçamento. Quantidade: ${quantity}`,
    duration: 2.5,
  });
};
