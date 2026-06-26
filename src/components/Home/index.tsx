import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import PartnersCarousel from "./PartnersCarousel";
import PersonalizedGiftsSeo from "./PersonalizedGiftsSeo";
import { getActiveBanners, getHomeCategories, getProductSections } from "@/lib/api";

// Lazy load componentes que não aparecem na viewport inicial
const Testimonials = dynamic(() => import("./Testimonials"), {
  loading: () => <div className="h-96 bg-gray-1" />,
});
const homeSectionCopy = [
  { eyebrow: "Curadoria recente", title: "Seus novos favoritos" },
  { eyebrow: "Escolhas premium", title: "Brindes que elevam sua marca" },
  { eyebrow: "Mais procurados", title: "Essenciais para boas campanhas" },
  { eyebrow: "Seleção Maggenta", title: "Ideias prontas para impressionar" },
  { eyebrow: "Para empresas", title: "Presentes corporativos com presença" },
];

const Home = async () => {
  const [productSections, categories, megaBanners, homeMegaBanners] = await Promise.all([
    getProductSections(),
    getHomeCategories(),
    getActiveBanners("mega_banner"),
    getActiveBanners("home_mega"),
  ]);
  const visibleSections = productSections.filter((section) => section.id !== "promocao");
  const curatedSections = visibleSections.map((section, index) => ({
    ...section,
    ...(homeSectionCopy[index] ?? {
      eyebrow: "Curadoria Maggenta",
      title: section.title,
    }),
  }));

  return (
    <main>
      <Hero banners={megaBanners} />
      <Categories categories={categories} />
      {curatedSections.slice(0, 2).map((section) => (
        <NewArrival
          key={section.id}
          eyebrow={section.eyebrow}
          title={section.title}
          products={section.products}
        />
      ))}
      <PromoBanner banners={homeMegaBanners} />
      {/* <PartnersCarousel /> */}
      {curatedSections.slice(2).map((section) => (
        <NewArrival
          key={section.id}
          eyebrow={section.eyebrow}
          title={section.title}
          products={section.products}
        />
      ))}
      <Suspense fallback={<div className="h-96 bg-gray-1" />}>
        <Testimonials />
      </Suspense>
      <PersonalizedGiftsSeo />
    </main>
  );
};

export default Home;
