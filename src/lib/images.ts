export const isValidImageSrc = (value: unknown): value is string => {
  if (typeof value !== "string") {
    return false;
  }

  const src = value.trim();

  if (!src || src.startsWith("<")) {
    return false;
  }

  if (src.startsWith("/") && !src.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(src);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const safeImageSrc = (value: unknown, fallback: string) =>
  isValidImageSrc(value) ? value.trim() : fallback;
