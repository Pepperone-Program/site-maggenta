import React from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import CounDown from "./Countdown";
import Testimonials from "./Testimonials";
import PersonalizedGiftsSeo from "./PersonalizedGiftsSeo";
import Newsletter from "../Common/Newsletter";
import { getActiveBanners, getHomeCategories, getProductSections } from "@/lib/api";

const Home = async () => {
  const [productSections, categories, megaBanners, homeMegaBanners] = await Promise.all([
    getProductSections(),
    getHomeCategories(),
    getActiveBanners("mega_banner"),
    getActiveBanners("home_mega"),
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
      {productSections.slice(2).map((section) => (
        <NewArrival
          key={section.id}
          eyebrow={section.eyebrow}
          title={section.title}
          products={section.products}
        />
      ))}
      <CounDown />
      <Testimonials />
      <PersonalizedGiftsSeo />
      <Newsletter />
    </main>
  );
};

export default Home;
