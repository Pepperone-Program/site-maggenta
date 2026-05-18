import React from "react";
import Cart from "@/components/Cart";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Orçamento",
  alternates: {
    canonical: "/cart",
  },
  description: "Revise os produtos do seu orçamento Pepperone.",
};

const CartPage = () => {
  return (
    <>
      <Cart />
    </>
  );
};

export default CartPage;
