export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const friendlyParam = (id: number | string, title: string, suffix = "") => {
  const slug = slugify(`${title}${suffix ? ` ${suffix}` : ""}`);
  return slug ? `${id}-${slug}` : String(id);
};

export const personalizedSuffix = (value: string) => {
  const normalized = slugify(value).replace(/-/g, "");

  if (normalized.endsWith("as")) {
    return "personalizadas";
  }

  if (
    normalized.endsWith("os") ||
    normalized.endsWith("s") ||
    normalized.endsWith("er")
  ) {
    return "personalizados";
  }

  return normalized.endsWith("a") ? "personalizada" : "personalizado";
};

export const personalizedTitle = (value: string) => {
  const title = value.trim() || "Brinde";
  return `${title} ${personalizedSuffix(title)}`;
};

export const friendlyPersonalizedParam = (
  id: number | string,
  title: string
) => friendlyParam(id, title, personalizedSuffix(title));
