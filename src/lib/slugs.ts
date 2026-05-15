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
