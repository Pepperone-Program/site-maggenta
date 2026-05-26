"use client";

import Image from "next/image";
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
};

const ImageWithFallback = ({ src, fill, style, ...props }: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src) {
    return null;
  }

  if (hasError) {
    const fallbackStyle: React.CSSProperties = fill
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
        src={src}
        alt={props.alt}
        width={props.width}
        height={props.height}
        className={props.className}
        style={fallbackStyle}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={props.alt}
      fill={fill}
      width={props.width}
      height={props.height}
      sizes={props.sizes}
      priority={props.priority}
      loading={props.loading}
      placeholder={props.placeholder}
      blurDataURL={props.blurDataURL}
      className={props.className}
      style={style}
      onError={() => setHasError(true)}
    />
  );
};

export default ImageWithFallback;