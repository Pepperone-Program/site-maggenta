import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  alternates: {
    canonical: "/orcamento",
  },
  robots: {
    index: false,
    follow: true,
  },
};

const CheckoutPage = () => {
  redirect("/orcamento");
};

export default CheckoutPage;
