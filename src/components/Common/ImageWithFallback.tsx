"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
import { safeImageSrc } from "@/lib/images";

type ImageWithFallbackProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  className?: string;
  style?: React.CSSProperties;
  unoptimized?: boolean;
  onPointerEnter?: React.PointerEventHandler<HTMLImageElement>;
  onPointerMove?: React.PointerEventHandler<HTMLImageElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLImageElement>;
};

const fallbackImage = "/images/logo/NOVO_LOGO_MAGG_HORIZONTAL_COR.png";

const canUseImageOptimizer = (src: string) => {
  if (src.startsWith("/")) return true;

  try {
    const hostname = new URL(src).hostname.toLowerCase();
    return (
      hostname === "bucket.maggenta.com.br" ||
      hostname === "cdn.xbzbrindes.com.br" ||
      hostname.endsWith(".supabase.co")
    );
  } catch {
    return false;
  }
};

const ResilientImage = ({ src, fill = false, priority = false, ...props }: ImageWithFallbackProps) => {
  const [currentSource, setCurrentSource] = useState(src);
  const commonProps = {
    src: currentSource,
    sizes: props.sizes,
    priority,
    loading: priority ? undefined : props.loading,
    placeholder: props.placeholder,
    blurDataURL: props.blurDataURL,
    className: props.className,
    style: props.style,
    unoptimized: props.unoptimized ?? !canUseImageOptimizer(currentSource),
    onError: () => {
      if (currentSource !== fallbackImage) setCurrentSource(fallbackImage);
    },
    onPointerEnter: props.onPointerEnter,
    onPointerMove: props.onPointerMove,
    onPointerLeave: props.onPointerLeave,
  };

  if (fill) {
    return <Image {...commonProps} alt={props.alt} fill />;
  }

  return (
    <Image
      {...commonProps}
      alt={props.alt}
      width={Math.max(1, props.width || 1)}
      height={Math.max(1, props.height || 1)}
    />
  );
};

const ImageWithFallback = ({ src, ...props }: ImageWithFallbackProps) => {
  const safeSource = useMemo(() => safeImageSrc(src, fallbackImage), [src]);
  return <ResilientImage key={safeSource} src={safeSource} {...props} />;
};

export default ImageWithFallback;
