import React from "react";
import { Wishlist } from "@/components/Wishlist";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favoritos",
  alternates: {
    canonical: "/wishlist",
  },
  description: "Veja seus produtos outdoor favoritos na Pepperone.",
};

const WishlistPage = () => {
  return (
    <main>
      <Wishlist />
    </main>
  );
};

export default WishlistPage;
