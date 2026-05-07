import { notFound, redirect } from "next/navigation";
import { productPath } from "@/lib/products";
import { getProdutoBySlug } from "@/lib/api";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;
  const product = await getProdutoBySlug(slug);

  if (!product) {
    notFound();
  }

  redirect(productPath(product));
};

export default ProductPage;
