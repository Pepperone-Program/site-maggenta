import { redirect } from "next/navigation";
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
  redirect("/orcamentos");
};

export default CheckoutPage;
