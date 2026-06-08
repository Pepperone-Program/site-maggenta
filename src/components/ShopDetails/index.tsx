"use client";

import React, { useEffect, useRef, useState } from "react";
import ImageWithFallback from "@/components/Common/ImageWithFallback";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
import Newsletter from "@/components/Common/Newsletter";
import { Product } from "@/types/product";
import { friendlyPersonalizedParam } from "@/lib/slugs";
import { useAddProductToCart } from "@/lib/hooks/useAddProductToCart";

const getYoutubeVideoId = (value?: string | null) => {
  const video = value?.trim();

  if (!video) {
    return "";
  }

  const cleanId = (id: string) => id.trim().split(/[?&]/)[0] || "";

  try {
    const url = new URL(video);
    const fromQuery = url.searchParams.get("v");

    if (fromQuery) {
      return cleanId(fromQuery);
    }

    const segments = url.pathname.split("/").filter(Boolean);
    const embedIndex = segments.findIndex((segment) => segment === "embed");

    if (embedIndex >= 0 && segments[embedIndex + 1]) {
      return cleanId(segments[embedIndex + 1]);
    }

    return cleanId(segments[segments.length - 1] || "");
  } catch {
    const iframeSrcMatch = video.match(/src=["']([^"']+)["']/i);

    if (iframeSrcMatch?.[1]) {
      return getYoutubeVideoId(iframeSrcMatch[1]);
    }

    return cleanId(video.replace(/^.*(?:youtu\.be\/|v=|embed\/)/i, ""));
  }
};

const ShopDetails = ({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) => {
  const addProductToCart = useAddProductToCart();
  const minimumQuantity = Math.max(1, Number(product.quantidadeMinima || 1));
  const [previewImg, setPreviewImg] = useState(0);
  const [activeMedia, setActiveMedia] = useState<"image" | "video">("image");
  const [mediaReady, setMediaReady] = useState(false);
  const [quantity, setQuantity] = useState(minimumQuantity);
  const [quantityInput, setQuantityInput] = useState(String(minimumQuantity));
  const [showTags, setShowTags] = useState(false);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const wheelLockRef = useRef(0);
  const categoryPath = product.categoryId
    ? `/categorias/${encodeURIComponent(
        friendlyPersonalizedParam(product.categoryId, product.category)
      )}`
    : "/brindes-personalizados";
  const youtubeVideoId = getYoutubeVideoId(product.video);
  const hasVideo = mediaReady && Boolean(youtubeVideoId);
  const youtubeEmbedUrl = hasVideo
    ? `https://www.youtube.com/embed/${encodeURIComponent(youtubeVideoId)}`
    : "";

  useEffect(() => {
    setMediaReady(true);
  }, []);

  useEffect(() => {
    setPreviewImg(0);
    setActiveMedia("image");
    setShowTags(false);
    setQuantity(minimumQuantity);
    setQuantityInput(String(minimumQuantity));
  }, [product.id, minimumQuantity]);

  useEffect(() => {
    if (previewImg >= product.imgs.previews.length) {
      setPreviewImg(0);
    }
  }, [previewImg, product.imgs.previews.length]);

  useEffect(() => {
    const element = mainImageRef.current;

    if (!element) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (activeMedia === "video") {
        return;
      }

      if (product.imgs.previews.length < 2) {
        return;
      }

      event.preventDefault();

      const now = Date.now();
      if (now - wheelLockRef.current < 260) {
        return;
      }

      wheelLockRef.current = now;
      setPreviewImg((current) => {
        if (event.deltaY > 0) {
          return Math.min(product.imgs.previews.length - 1, current + 1);
        }

        return Math.max(0, current - 1);
      });
    };

    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, [activeMedia, product.imgs.previews.length]);

  const handleAddToCart = () => {
    const parsedQuantity = Number(quantityInput.replace(/\D/g, ""));
    const safeQuantity = Math.max(
      minimumQuantity,
      Number.isFinite(parsedQuantity) ? Math.floor(parsedQuantity) : minimumQuantity
    );

    setQuantity(safeQuantity);
    setQuantityInput(String(safeQuantity));
    addProductToCart(product, safeQuantity);
  };

  const updateQuantity = (value: string) => {
    const parsed = Number(value.replace(/\D/g, ""));
    const safeQuantity = Number.isFinite(parsed)
      ? Math.max(minimumQuantity, parsed)
      : minimumQuantity;

    setQuantity(safeQuantity);
    setQuantityInput(String(safeQuantity));
  };

  const commitQuantityInput = () => {
    updateQuantity(quantityInput);
  };

  return (
    <>
      <main className="bg-white pt-[108px] sm:pt-[112px]">
        <section className="border-b border-gray-3 bg-[#f7f8f4]">
          <div className="mx-auto grid w-full max-w-[1800px] gap-10 px-4 py-8 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-10 xl:px-0">
            <div>
              <div
                ref={mainImageRef}
                className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-lg bg-white p-6 shadow-1 sm:min-h-[520px]"
              >
                {product.badge && (
                  <span className="absolute left-5 top-5 z-20 rounded-full bg-blue px-4 py-1.5 text-sm font-semibold text-white">
                    {product.badge}
                  </span>
                )}
                {activeMedia === "video" && youtubeEmbedUrl ? (
                  <iframe
                    width="560"
                    height="400"
                    src={youtubeEmbedUrl}
                    title={`${product.title} - video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="relative z-10 aspect-video w-full max-w-[760px] rounded-md"
                  />
                ) : (
                  <>
                    <ImageWithFallback
                      src={product.imgs.previews[previewImg]}
                      alt={`${product.title} - imagem ${previewImg + 1}`}
                      width={520}
                      height={520}
                      priority
                      className="relative z-10 h-auto max-h-[460px] w-full object-contain"
                    />
                    <ImageWithFallback
                      src="/images/logo/logo-vertical.svg"
                      alt="Marca d'agua Pepperone"
                      width={260}
                      height={260}
                      className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-[38%] max-w-[260px] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]"
                    />
                  </>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {product.imgs.thumbnails.map((item, key) => (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMedia("image");
                      setPreviewImg(key);
                    }}
                    key={`${product.id}-thumbnail-${key}-${item}`}
                    className={`flex h-20 w-20 items-center justify-center rounded-md border bg-white p-2 shadow-1 duration-200 hover:border-blue sm:h-24 sm:w-24 ${
                      activeMedia === "image" && key === previewImg
                        ? "border-blue"
                        : "border-transparent"
                    }`}
                    aria-label={`Ver imagem ${key + 1} de ${product.title}`}
                  >
                    <ImageWithFallback
                      width={1000}
                      height={1000}
                      src={item}
                      alt={`${product.title} - miniatura ${key + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
                {hasVideo && (
                  <button
                    type="button"
                    onClick={() => setActiveMedia("video")}
                    className={`flex h-20 w-20 items-center justify-center rounded-md border bg-white p-2 shadow-1 duration-200 hover:border-blue sm:h-24 sm:w-24 ${
                      activeMedia === "video" ? "border-blue" : "border-transparent"
                    }`}
                    aria-label={`Assistir video de ${product.title}`}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue text-white shadow-md">
                      <svg
                        aria-hidden="true"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        className="ml-0.5"
                      >
                        <path d="M5.5 3.8v10.4l8.2-5.2-8.2-5.2Z" fill="currentColor" />
                      </svg>
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-start lg:pt-4">
              <nav className="mb-6 text-sm text-dark-4" aria-label="Breadcrumb">
                <Link href="/" className="duration-200 hover:text-blue">
                  Inicio
                </Link>
                <span className="mx-2">/</span>
                <Link
                  href="/brindes-personalizados"
                  className="duration-200 hover:text-blue"
                >
                  Brindes Personalizados
                </Link>
                <span className="mx-2">/</span>
                <Link
                  href={categoryPath}
                >
                  {product.category}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-dark">{product.title}</span>
              </nav>

              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue">
                {product.category}
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-black sm:text-4xl lg:text-5xl">
                {product.title}
              </h1>
              <div className="mt-5 text-base leading-7 text-dark-3">
                {showTags ? (
                  <p className="text-blue hover:text-blue-dark">
                    {product.title},{" "}
                    <Link
                      href={categoryPath}
                      
                    >
                      {product.category}
                    </Link>
                    {`, ${product.description}`}
                  </p>
                ) : (
                  <p>{product.description || product.shortDescription}</p>
                )}
              </div>
              <ul className="mt-8 grid gap-3 text-dark sm:grid-cols-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="flex h-12 w-full items-center justify-between rounded-md border border-gray-3 bg-white sm:w-36">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => {
                        const nextQuantity = Math.max(minimumQuantity, value - 1);
                        setQuantityInput(String(nextQuantity));
                        return nextQuantity;
                      })
                    }
                    className="h-full w-11 text-xl text-dark duration-200 hover:bg-gray-1"
                    disabled={quantity <= minimumQuantity}
                    aria-label="Diminuir quantidade"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={quantityInput}
                    onChange={(event) => setQuantityInput(event.target.value)}
                    onBlur={commitQuantityInput}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.currentTarget.blur();
                      }
                    }}
                    aria-label="Quantidade"
                    className="h-full min-w-0 flex-1 border-0 bg-transparent text-center font-semibold text-dark outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => {
                        const nextQuantity = value + 1;
                        setQuantityInput(String(nextQuantity));
                        return nextQuantity;
                      })
                    }
                    className="h-full w-11 text-xl text-dark duration-200 hover:bg-gray-1"
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>

                <Link
                  href="/orcamentos"
                  onClick={handleAddToCart}
                  className="flex h-12 flex-1 items-center justify-center rounded-md bg-blue px-8 text-center text-sm font-semibold text-white duration-200 hover:bg-blue-dark"
                >
                  Adicionar ao orçamento
                </Link>
                <button
                  type="button"
                  onClick={() => setShowTags((value) => !value)}
                  className="h-12 rounded-md border border-gray-3 bg-white px-6 text-sm font-semibold text-dark duration-200 hover:border-blue hover:text-blue"
                >
                  {showTags ? "Descrição" : "Tags"}
                </button>
              </div>

              <div className="mt-8 grid gap-3 rounded-lg border border-gray-3 bg-white p-5 text-sm text-dark-3 sm:grid-cols-3">
                <span>Atendimento consultivo</span>
                <span>Personalização sob demanda</span>
                <span>Orçamento sem compromisso</span>
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mx-auto mt-10 w-full max-w-[1800px] px-4 pb-16 sm:px-3">
            <div className="mb-8 flex items-end justify-between gap-5">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue">
                  Complete seu kit
                </p>
                <h2 className="text-2xl font-semibold text-dark">
                  Produtos relacionados
                </h2>
              </div>
              <Link
                href="/brindes-personalizados"
                className="hidden rounded-md border border-gray-3 px-5 py-2.5 text-sm font-semibold text-dark duration-200 hover:bg-blue hover:text-white sm:inline-flex"
              >
                Ver loja
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-x-7.5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductItem item={item} key={item.id} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Newsletter />
    </>
  );
};

export default ShopDetails;
