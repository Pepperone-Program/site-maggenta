import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  alternates: {
    canonical: "/orcamentos",
  },
  robots: {
    index: false,
    follow: true,
  },
};

const CheckoutPage = () => {
  permanentRedirect("/orcamentos");
};

export default CheckoutPage;
