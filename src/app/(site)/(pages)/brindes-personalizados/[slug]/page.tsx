import React, { cache } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ShopDetails from "@/components/ShopDetails";
import { productPath } from "@/lib/products";
import { getProdutoBySlug, getRelatedProducts } from "@/lib/api";
import { buildSeoOther, contextualKeywords, siteName, siteUrl } from "@/lib/seo";

export const revalidate = 300;
export const dynamicParams = true;

const getCachedProdutoBySlug = cache(getProdutoBySlug);

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCachedProdutoBySlug(slug);

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
  const productCode = product.codigo || String(product.id);
  const description = `Encontre ${product.title} e muito mais ${productCode}. Veja aqui`;
  const title = `${product.title} - ${productCode} - ${product.title} | Maggenta Brindes`;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: contextualKeywords(product.title, [
      product.category,
      productCode,
      `${product.title} ${productCode}`,
      `${product.category} personalizados`,
      `${product.title} com logo`,
      `${product.title} quantidade minima ${product.quantidadeMinima || ""}`,
    ]),
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
      siteName,
      locale: "pt_BR",
      images: [
        {
          url: image,
          alt: product.title,
          width: 1200,
          height: 1200,
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
      ...buildSeoOther({
        title,
        description,
        canonical,
        subject: `${product.title}, ${product.category}, ${productCode}`,
      }),
      "og:image": image,
      "og:image:secure_url": image,
      "og:image:width": "1200",
      "og:image:height": "1200",
      "og:image:type": image.includes(".png") ? "image/png" : "image/jpeg",
      "product:category": product.category,
      "product:retailer_item_id": productCode,
    },
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;
  const product = await getCachedProdutoBySlug(slug);

  if (!product) {
    redirect("/");
  }

  if (slug !== product.slug) {
    redirect(productPath(product));
  }

  const relatedProducts = await getRelatedProducts(product, 4);
  const canonical = new URL(productPath(product), siteUrl).toString();
  const images = product.imgs.previews.map((image) => new URL(image, siteUrl).toString());

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
      name: "Maggenta",
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
        name: "Maggenta",
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
