import React from "react";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ShopDetails from "@/components/ShopDetails";
import { productPath } from "@/lib/products";
import {
  getProdutoBySlug,
  getRelatedProducts,
} from "@/lib/api";

const siteUrl = "https://www.pepperone.com.br";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const dynamicParams = true;

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProdutoBySlug(slug);

  if (!product) {
    return {
      title: "Produto nao encontrado",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const canonical = new URL(productPath(product), siteUrl).toString();
  const image = product.imgs.previews[0]
    ? new URL(product.imgs.previews[0], siteUrl).toString()
    : new URL("/images/logo/logo.svg", siteUrl).toString();
  const description =
    product.description ||
    product.shortDescription ||
    `Solicite orcamento para ${product.title} personalizado na Pepperone.`;

  return {
    title: {
      absolute: `${product.title} - ${product.codigo || product.id} - ${product.title} | Pepperone Brindes`,
    },
    description,
    keywords: [
      product.title,
      `${product.title} personalizado`,
      product.category,
      product.codigo || "",
      "brindes personalizados",
      "brindes corporativos",
      "brindes promocionais",
      "brindes para empresas",
      "produto personalizado",
      "orcamento de brindes personalizados",
      "marketing promocional",
      "campanhas promocionais",
    ].filter(Boolean),
    alternates: {
      canonical,
      languages: {
        "pt-BR": canonical,
        "x-default": canonical,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: product.title,
      description,
      type: "website",
      url: canonical,
      siteName: "Pepperone Brindes",
      locale: "pt_BR",
      images: [
        {
          url: image,
          alt: product.title,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: [image],
    },
    other: {
      "og:image:secure_url": image,
      "og:image:type": image.includes(".png") ? "image/png" : "image/jpeg",
      "product:category": product.category,
      "product:retailer_item_id": product.codigo || String(product.id),
      "ai-content": "index, follow",
    },
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;
  const product = await getProdutoBySlug(slug);

  if (!product) {
    notFound();
  }

  if (slug !== product.slug) {
    redirect(productPath(product));
  }

  const relatedProducts = await getRelatedProducts(product, 4);
  const canonical = new URL(productPath(product), siteUrl).toString();
  const images = product.imgs.previews.map((image) =>
    new URL(image, siteUrl).toString()
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonical}#product`,
    name: product.title,
    description: product.description || product.shortDescription,
    image: images,
    sku: product.codigo || `PEP-${product.id}`,
    mpn: product.codigo || String(product.id),
    brand: {
      "@type": "Brand",
      name: "Pepperone",
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "BRL",
      price: product.discountedPrice > 0 ? product.discountedPrice.toFixed(2) : "0.00",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Pepperone",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: product.reviews,
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Brindes personalizados",
        item: new URL("/brindes-personalizados", siteUrl).toString(),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: canonical,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ShopDetails product={product} relatedProducts={relatedProducts} />
    </>
  );
};

export default ProductPage;
