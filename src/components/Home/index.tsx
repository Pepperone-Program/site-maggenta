import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import PartnersCarousel from "./PartnersCarousel";
import Newsletter from "../Common/Newsletter";
import { getActiveBanners, getHomeCategories, getProductSections } from "@/lib/api";

// Lazy load componentes que não aparecem na viewport inicial
const CounDown = dynamic(() => import("./Countdown"), {
  loading: () => <div className="h-32 bg-gray-1" />,
});
const Testimonials = dynamic(() => import("./Testimonials"), {
  loading: () => <div className="h-96 bg-gray-1" />,
});
const PersonalizedGiftsSeo = dynamic(() => import("./PersonalizedGiftsSeo"), {
  loading: () => <div className="h-96 bg-gray-1" />,
});

const Home = async () => {
  const [productSections, categories, megaBanners, homeMegaBanners, mediumBanners] = await Promise.all([
    getProductSections(),
    getHomeCategories(),
    getActiveBanners("mega_banner"),
    getActiveBanners("home_mega"),
    getActiveBanners("banner_medio"),
  ]);

  return (
    <main>
      <Hero banners={megaBanners} />
      <Categories categories={categories} />
      {productSections.slice(0, 2).map((section) => (
        <NewArrival
          key={section.id}
          eyebrow={section.eyebrow}
          title={section.title}
          products={section.products}
        />
      ))}
      <PromoBanner banners={homeMegaBanners} />
      <PartnersCarousel />
      {productSections.slice(2).map((section) => (
        <NewArrival
          key={section.id}
          eyebrow={section.eyebrow}
          title={section.title}
          products={section.products}
        />
      ))}
      <Suspense fallback={<div className="h-32 bg-gray-1" />}>
        <CounDown banners={mediumBanners} />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-gray-1" />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<div className="h-96 bg-gray-1" />}>
        <PersonalizedGiftsSeo />
      </Suspense>
      <Newsletter />
    </main>
  );
};

export default Home;
