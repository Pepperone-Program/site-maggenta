"use client";

import React, { useEffect, useRef, useState } from "react";
import ImageWithFallback from "@/components/Common/ImageWithFallback";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
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
  const [isMainImageZoomed, setIsMainImageZoomed] = useState(false);
  const [imageZoomOrigin, setImageZoomOrigin] = useState("50% 50%");
  const [mainImageHeight, setMainImageHeight] = useState<number | undefined>();
  const mainImageRef = useRef<HTMLDivElement>(null);
  const detailsPanelRef = useRef<HTMLDivElement>(null);
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
    const panel = detailsPanelRef.current;

    if (!panel) {
      return;
    }

    const updateHeight = () => {
      if (window.innerWidth < 1024) {
        setMainImageHeight(undefined);
        return;
      }

      setMainImageHeight(Math.max(420, panel.getBoundingClientRect().height));
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(panel);
    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [product.id, product.description, product.specs.length, showTags]);

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
    addProductToCart(product, safeQuantity, { openCartPreview: false });
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

  const handleMainImagePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activeMedia === "video") {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setImageZoomOrigin(`${x}% ${y}%`);
  };

  const resetMainImageZoom = () => {
    setIsMainImageZoomed(false);
    setImageZoomOrigin("50% 50%");
  };

  return (
    <>
      <main className="bg-[#f5f5f4] pt-[120px] sm:pt-[124px]">
        <section className="pb-12">
          <div className="mx-auto w-full max-w-[1800px] px-4 pt-8 sm:px-8 xl:px-3">
            <nav className="mb-5 text-sm text-dark-4" aria-label="Breadcrumb">
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
              <Link href={categoryPath} className="duration-200 hover:text-blue">
                {product.category}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-dark">{product.title}</span>
            </nav>
          </div>
          <div className="mx-auto grid w-full max-w-[1800px] items-start gap-8 px-4 pb-2 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:pb-2 xl:px-3">
            <div>
              <div
                ref={mainImageRef}
                onPointerEnter={() => setIsMainImageZoomed(activeMedia === "image")}
                onPointerMove={handleMainImagePointerMove}
                onPointerLeave={resetMainImageZoom}
                className="relative flex aspect-[1/0.94] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-[34px] bg-white p-3 pb-26 shadow-2 sm:p-4 sm:pb-30"
                style={mainImageHeight ? { height: mainImageHeight } : undefined}
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
                    className="relative z-10 aspect-video w-full max-w-[760px] rounded-[24px]"
                  />
                ) : (
                  <>
                    <ImageWithFallback
                      src={product.imgs.previews[previewImg]}
                      alt={`${product.title} - imagem ${previewImg + 1}`}
                      width={520}
                      height={520}
                      priority
                      className="relative z-10 h-auto max-h-[74%] w-full object-contain transition-transform duration-200 ease-out"
                      style={{
                        transform: isMainImageZoomed ? "scale(1.85)" : "scale(1)",
                        transformOrigin: imageZoomOrigin,
                      }}
                    />
                    <ImageWithFallback
                      src="/images/logo/logo-vertical.svg"
                      alt="Marca d'agua Maggenta"
                      width={260}
                      height={260}
                      className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-[38%] max-w-[260px] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]"
                    />
                  </>
                )}
                <div className="absolute bottom-4 left-4 right-4 z-30 flex gap-3 overflow-x-auto rounded-[24px] border border-white/80 bg-white/75 p-2 shadow-1 backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5">
                  {product.imgs.thumbnails.map((item, key) => (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMedia("image");
                        setPreviewImg(key);
                      }}
                      key={`${product.id}-thumbnail-${key}-${item}`}
                      className={`flex h-17 w-17 shrink-0 items-center justify-center rounded-[18px] border bg-white/85 p-2 duration-200 hover:border-blue sm:h-20 sm:w-20 ${
                        activeMedia === "image" && key === previewImg
                          ? "border-blue shadow-[0_10px_24px_rgba(157,23,77,0.16)]"
                          : "border-white/70"
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
                      className={`flex h-17 w-17 shrink-0 items-center justify-center rounded-[18px] border bg-white/85 p-2 duration-200 hover:border-blue sm:h-20 sm:w-20 ${
                        activeMedia === "video" ? "border-blue" : "border-white/70"
                      }`}
                      aria-label={`Assistir video de ${product.title}`}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue text-white shadow-md">
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
            </div>

            <div ref={detailsPanelRef} className="flex self-start flex-col justify-start rounded-[34px] bg-white p-5 shadow-2 sm:p-6 lg:p-7">
              <h1 className="text-2xl font-semibold leading-tight text-dark sm:text-3xl lg:text-[38px]">
                {product.title}
              </h1>
              <p className="mt-5 text-sm text-dark">Cód: {product.codigo || product.id}</p>

              <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-dark">
                Descrição
              </h2>
              <div className="mt-3 text-base leading-8 text-dark">
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

              <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-dark">
                Especificações
              </h2>
              <div className="mt-3 overflow-hidden rounded-[8px] border border-dark">
                <table className="w-full border-collapse text-sm text-dark">
                  <tbody>
                    {product.specs.map((spec) => (
                      <tr key={`${spec.label}-${spec.value}`} className="border-b border-dark last:border-b-0">
                        <th className="w-1/2 px-3 py-2 text-left font-semibold">
                          {spec.label}
                        </th>
                        <td className="px-3 py-2">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="flex h-13 w-full items-center justify-between rounded-full border border-gray-3 bg-white sm:w-32">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => {
                        const nextQuantity = Math.max(minimumQuantity, value - 1);
                        setQuantityInput(String(nextQuantity));
                        return nextQuantity;
                      })
                    }
                    className="h-full w-12 rounded-l-full text-xl text-dark duration-200 hover:bg-gray-1"
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
                    className="h-full w-12 rounded-r-full text-xl text-dark duration-200 hover:bg-gray-1"
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>

                <Link
                  href="/orcamentos"
                  onClick={handleAddToCart}
                  className="flex h-13 flex-[1.6] items-center justify-center rounded-full bg-blue px-8 text-center text-sm font-semibold text-white shadow-[0_18px_36px_rgba(157,23,77,0.28)] duration-200 hover:bg-blue-dark"
                >
                  Adicionar ao orçamento
                </Link>
                <button
                  type="button"
                  onClick={() => setShowTags((value) => !value)}
                  className="h-13 rounded-full border border-gray-3 bg-white px-6 text-sm font-semibold text-dark duration-200 hover:border-blue hover:text-blue"
                >
                  {showTags ? "Descrição" : "Tags"}
                </button>
              </div>

            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mx-auto w-full max-w-[1800px] px-4 pb-16 sm:px-3">
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

    </>
  );
};

export default ShopDetails;
