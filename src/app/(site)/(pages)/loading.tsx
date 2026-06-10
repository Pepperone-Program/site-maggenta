"use client";

import { usePathname } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ProductListingSkeleton from "@/components/Shop/ProductListingSkeleton";

const sidebarRoutes = [
  "/brindes-personalizados",
  "/categorias/",
  "/subcategorias/",
  "/publicos-alvos/",
  "/datas-promocionais/",
];

const PagesLoading = () => {
  const pathname = usePathname() || "";
  const withSidebar = sidebarRoutes.some((route) => pathname.includes(route));

  return (
    <main className="min-h-screen bg-[#f3f4f6]" aria-busy="true">
      <Breadcrumb title="Carregando produtos" pages={["brindes personalizados"]} />
      <ProductListingSkeleton withSidebar={withSidebar} />
    </main>
  );
};

export default PagesLoading;
