import React, { cache } from "react";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import ShopDetails from "@/components/ShopDetails";
import { productPath } from "@/lib/products";
import { getProdutoBySlug, getRelatedProducts } from "@/lib/api";
import { buildSeoOther, categoryPath, contextualKeywords, siteName, siteUrl } from "@/lib/seo";

export const revalidate = 300;
export const dynamicParams = true;

const getValidatedProdutoBySlug = unstable_cache(
  getProdutoBySlug,
  ["validated-product-by-slug-v1"],
  { revalidate: 300 }
);
const getCachedProdutoBySlug = cache(getValidatedProdutoBySlug);

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
    notFound();
  }

  const canonical = new URL(productPath(product), siteUrl).toString();
  const image = product.imgs.previews[0]
    ? new URL(product.imgs.previews[0], siteUrl).toString()
    : new URL("/images/logo/NOVO_LOGO_MAGG_HORIZONTAL_COR.png", siteUrl).toString();
  const productCode = product.codigo || String(product.id);
  const description = `${product.title} personalizado, código ${productCode}, para empresas, eventos e campanhas. Confira os detalhes e solicite seu orçamento com a Maggenta.`;
  const shareTitle = `${product.title} - ${productCode}`;
  const title = `${shareTitle} | Maggenta Brindes`;

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
      title: shareTitle,
      description,
      type: "website",
      url: canonical,
      siteName,
      locale: "pt_BR",
      images: [
        {
          url: image,
          alt: shareTitle,
          width: 1200,
          height: 1200,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
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
      "product:category": product.category,
      "product:retailer_item_id": productCode,
    },
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;
  const product = await getCachedProdutoBySlug(slug);

  if (!product) {
    notFound();
  }

  if (slug !== product.slug) {
    permanentRedirect(productPath(product));
  }

  const relatedProducts = await getRelatedProducts(product, 5);
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
  };
  const categoryCanonical = product.categoryId
    ? new URL(categoryPath(product.categoryId, product.category), siteUrl).toString()
    : null;
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
        name: product.category,
        item: categoryCanonical || new URL("/brindes-personalizados", siteUrl).toString(),
      },
      {
        "@type": "ListItem",
        position: 4,
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
