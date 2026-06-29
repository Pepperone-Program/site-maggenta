import React from "react";
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
};

const fallbackImage = "/images/logo/logo.svg";

const ImageWithFallback = ({ src, fill, style, ...props }: ImageWithFallbackProps) => {
  if (!src) {
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
      src={safeImageSrc(src, fallbackImage)}
      alt={props.alt}
      width={props.width}
      height={props.height}
      loading={props.priority ? "eager" : props.loading}
      decoding="async"
      className={props.className}
      style={imageStyle}
    />
  );
};

export default ImageWithFallback;
