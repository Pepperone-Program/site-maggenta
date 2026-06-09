"use client";

import React, { useEffect, useState } from "react";

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
};

const fallbackImage = "/images/logo/logo.svg";

const ImageWithFallback = ({ src, fill, style, ...props }: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  if (!src) {
    return null;
  }

  if (hasError) {
    return null;
  }

  const imageStyle: React.CSSProperties = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "contain",
        ...style,
      }
    : {
        ...style,
      };

  return (
    <img
      src={currentSrc}
      alt={props.alt}
      width={props.width}
      height={props.height}
      loading={props.priority ? "eager" : props.loading}
      decoding="async"
      className={props.className}
      style={imageStyle}
      onError={() => {
        if (currentSrc !== fallbackImage) {
          setCurrentSrc(fallbackImage);
          return;
        }

        setHasError(true);
      }}
    />
  );
};

export default ImageWithFallback;
