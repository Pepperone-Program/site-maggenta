import React from "react";
import { Wishlist } from "@/components/Wishlist";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favoritos",
  alternates: {
    canonical: "/wishlist",
  },
  description: "Veja seus produtos favoritos de brindes personalizados na Maggenta.",
  robots: {
    index: false,
    follow: false,
  },
};

const WishlistPage = () => {
  return (
    <main>
      <Wishlist />
    </main>
  );
};

export default WishlistPage;
