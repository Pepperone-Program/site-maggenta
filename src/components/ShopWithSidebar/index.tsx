"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import Breadcrumb from "../Common/Breadcrumb";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import shopData from "../Shop/shopData";
import type { CatalogoOption, CatalogoProdutos } from "@/lib/api";
import { friendlyParam } from "@/lib/slugs";
import type { Product } from "@/types/product";

type ActiveFilters = {
  categoria?: string;
  publico_alvo?: string;
  data_promocional?: string;
  subcategorias?: string;
  publicos_alvos?: string;
  quantidade_minima_min?: string;
  quantidade_minima_max?: string;
  datas_promocionais?: string;
  limit?: string;
};

type FilterOption = {
  id: number;
  label: string;
  total: number;
};

const defaultCatalogo: CatalogoProdutos = {
  categoria: {
    id_empresa: 1,
    id_categoria: 1,
    categoria: "Brindes",
    descricao: null,
    icon: null,
    habilitado: "S",
    url_capa: null,
  },
  filtros: {
    subcategorias: [],
    publicos_alvos: [],
    datas_promocionais: [],
    quantidade_minima: {
      min: 0,
      max: 0,
    },
  },
  items: shopData,
  total: shopData.length,
  page: 1,
  limit: 24,
  totalPages: 1,
};

const parseIds = (value = "") =>
  value
    .split(",")
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(value);

const sanitizeCategoryDescription = (value = "") =>
  value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");

const FilterGroup = ({
  title,
  options,
  selectedIds,
  onToggle,
}: {
  title: string;
  options: FilterOption[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-md border border-gray-3 bg-white shadow-1">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full cursor-pointer items-center justify-between py-3 pl-6 pr-5.5 ${
          open ? "shadow-filter" : ""
        }`}
      >
        <span className="font-medium text-dark">{title}</span>
        <svg
          className={`fill-current text-dark duration-200 ${open ? "rotate-180" : ""}`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
            fill=""
          />
        </svg>
      </button>

      <div className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${open ? "flex" : "hidden"}`}>
        {options.length ? (
          options.map((option) => {
            const selected = selectedIds.includes(option.id);

            return (
              <button
                key={option.id}
                type="button"
                className={`group flex items-center justify-between gap-3 text-left duration-200 hover:text-blue ${
                  selected ? "text-blue" : ""
                }`}
                onClick={() => onToggle(option.id)}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      selected ? "border-blue bg-blue" : "border-gray-3 bg-white"
                    }`}
                  >
                    <svg
                      className={selected ? "block" : "hidden"}
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
                        stroke="white"
                        strokeWidth="1.94437"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="min-w-0 truncate">{option.label}</span>
                </span>

                <span
                  className={`inline-flex shrink-0 rounded-[30px] px-2 text-custom-xs duration-200 group-hover:bg-blue group-hover:text-white ${
                    selected ? "bg-blue text-white" : "bg-gray-2"
                  }`}
                >
                  {option.total}
                </span>
              </button>
            );
          })
        ) : (
          <p className="text-custom-sm text-dark-4">Nenhuma opcao disponivel</p>
        )}
      </div>
    </div>
  );
};

const ShopWithSidebar = ({
  catalogo = defaultCatalogo,
  products,
  activeFilters = {},
  categoryOptions = [],
  publicOptions: globalPublicOptions = [],
  dateOptions = [],
  pageTitle: customPageTitle,
  basePath = "/brindes-personalizados",
}: {
  catalogo?: CatalogoProdutos;
  products?: Product[];
  activeFilters?: ActiveFilters;
  categoryOptions?: CatalogoOption[];
  publicOptions?: CatalogoOption[];
  dateOptions?: CatalogoOption[];
  pageTitle?: string;
  basePath?: string;
}) => {
  const router = useRouter();
  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const hasMountedRef = useRef(false);

  const categoryName = catalogo.categoria?.categoria || "Brindes";
  const categoryDescription = sanitizeCategoryDescription(
    catalogo.categoria?.descricao || ""
  );
  const activeCategoryId =
    parseInt(String(activeFilters.categoria || catalogo.categoria?.id_categoria || 1), 10) || 1;
  const pageTitle = customPageTitle || `${categoryName} personalizados`;
  const items = products || catalogo.items;
  const selectedSubcategorias = useMemo(
    () => parseIds(activeFilters.subcategorias),
    [activeFilters.subcategorias]
  );
  const selectedPublicos = useMemo(
    () => parseIds(activeFilters.publicos_alvos),
    [activeFilters.publicos_alvos]
  );
  const selectedDatas = useMemo(
    () => parseIds(activeFilters.datas_promocionais),
    [activeFilters.datas_promocionais]
  );
  const quantityMin = catalogo.filtros.quantidade_minima.min || 0;
  const quantityMax = catalogo.filtros.quantidade_minima.max || 0;
  const selectedQuantityMin = Number(activeFilters.quantidade_minima_min || quantityMin);
  const selectedQuantityMax = Number(activeFilters.quantidade_minima_max || quantityMax);
  const [quantityRange, setQuantityRange] = useState<[number, number]>([
    selectedQuantityMin,
    selectedQuantityMax,
  ]);

  const subcategoryOptions = catalogo.filtros.subcategorias.map((item) => ({
    id: item.id_subcategoria,
    label: item.subcategoria,
    total: item.total || 0,
  }));
  const publicOptions = useMemo(() => {
    const totals = new Map(
      catalogo.filtros.publicos_alvos.map((item) => [
        item.id_publico_alvo,
        item.total || 0,
      ])
    );
    const merged = [
      ...globalPublicOptions,
      ...catalogo.filtros.publicos_alvos.map((item) => ({
        id: item.id_publico_alvo,
        title: item.publico_alvo,
      })),
    ];
    const unique = new Map<number, FilterOption>();

    merged.forEach((item) => {
      if (Number.isFinite(item.id) && item.title) {
        unique.set(item.id, {
          id: item.id,
          label: item.title,
          total: totals.get(item.id) || 0,
        });
      }
    });

    return Array.from(unique.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "pt-BR", { sensitivity: "base" })
    );
  }, [catalogo.filtros.publicos_alvos, globalPublicOptions]);
  const dateFilterOptions = useMemo(() => {
    const totals = new Map(
      catalogo.filtros.datas_promocionais.map((item) => [
        item.id_data_promocional,
        item.total || 0,
      ])
    );
    const merged = [
      ...dateOptions,
      ...catalogo.filtros.datas_promocionais.map((item) => ({
        id: item.id_data_promocional,
        title: item.data_promocional,
      })),
    ];
    const unique = new Map<number, FilterOption>();

    merged.forEach((item) => {
      if (Number.isFinite(item.id) && item.title) {
        unique.set(item.id, {
          id: item.id,
          label: item.title,
          total: totals.get(item.id) || 0,
        });
      }
    });

    return Array.from(unique.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "pt-BR", { sensitivity: "base" })
    );
  }, [catalogo.filtros.datas_promocionais, dateOptions]);
  const firstItem = catalogo.total === 0 ? 0 : (catalogo.page - 1) * catalogo.limit + 1;
  const lastItem = Math.min(catalogo.page * catalogo.limit, catalogo.total);
  const categories = useMemo(() => {
    const currentCategory = catalogo.categoria
      ? {
          id: catalogo.categoria.id_categoria,
          title: catalogo.categoria.categoria,
        }
      : null;
    const merged = [...categoryOptions, ...(currentCategory ? [currentCategory] : [])];
    const unique = new Map<number, CatalogoOption>();

    merged.forEach((category) => {
      if (Number.isFinite(category.id) && category.title) {
        unique.set(category.id, category);
      }
    });

    return Array.from(unique.values()).sort((a, b) =>
      a.title.localeCompare(b.title, "pt-BR", { sensitivity: "base" })
    );
  }, [catalogo.categoria, categoryOptions]);
  const hasFilters =
    selectedSubcategorias.length > 0 ||
    selectedPublicos.length > 0 ||
    selectedDatas.length > 0 ||
    activeFilters.quantidade_minima_min ||
    activeFilters.quantidade_minima_max;
  const isSubcategoryRoute = basePath.startsWith("/subcategorias/");

  const buildCatalogHref = (
    updates: Record<string, string | number | null | undefined>
  ) => {
    const params = new URLSearchParams();
  const isCleanCategoryRoute = basePath.startsWith("/categorias/");
    const isCleanPublicRoute = basePath.startsWith("/publicos-alvos/");
    const isCleanDateRoute = basePath.startsWith("/datas-promocionais/");
    const current: Record<string, string | undefined> = {
      categoria: isCleanCategoryRoute ? undefined : activeFilters.categoria,
      publico_alvo: isCleanPublicRoute ? undefined : activeFilters.publico_alvo,
      data_promocional: isCleanDateRoute ? undefined : activeFilters.data_promocional,
      subcategorias: activeFilters.subcategorias,
      publicos_alvos: activeFilters.publicos_alvos,
      quantidade_minima_min: activeFilters.quantidade_minima_min,
      quantidade_minima_max: activeFilters.quantidade_minima_max,
      datas_promocionais: activeFilters.datas_promocionais,
      limit: activeFilters.limit,
      page: String(catalogo.page),
    };

    Object.entries({ ...current, ...updates }).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (key === "categoria" && String(value) === "1") ||
        (key === "limit" && String(value) === "24") ||
        (key === "page" && String(value) === "1")
      ) {
        return;
      }

      params.set(key, String(value));
    });

    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  useEffect(() => {
    const handleStickyMenu = () => {
      setStickyMenu(window.scrollY >= 80);
    };

    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  useEffect(() => {
    setQuantityRange([selectedQuantityMin, selectedQuantityMax]);
  }, [selectedQuantityMin, selectedQuantityMax]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      if (!target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [productSidebar]);

  const navigateWith = (updates: Record<string, string | number | null | undefined>) => {
    router.push(buildCatalogHref({ ...updates, page: updates.page ?? 1 }));
  };

  const toggleMultiFilter = (
    key: "subcategorias" | "publicos_alvos" | "datas_promocionais",
    id: number
  ) => {
    const current =
      key === "subcategorias"
        ? selectedSubcategorias
        : key === "publicos_alvos"
          ? selectedPublicos
          : selectedDatas;
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];

    navigateWith({ [key]: next.join(",") || null });
  };

  const selectSubcategory = (id: number) => {
    const selectedSubcategory = subcategoryOptions.find((option) => option.id === id);
    const subcategoryParam = selectedSubcategory
      ? friendlyParam(id, selectedSubcategory.label, "personalizado")
      : String(id);

    router.push(`/subcategorias/${encodeURIComponent(subcategoryParam)}`);
  };

  const selectCategory = (id: number) => {
    const selectedCategory = categories.find((category) => category.id === id);
    const categoryParam = selectedCategory
      ? friendlyParam(id, selectedCategory.title, "personalizados")
      : String(id);

    router.push(`/categorias/${encodeURIComponent(categoryParam)}`);
  };

  const applyQuantityFilter = () => {
    navigateWith({
      quantidade_minima_min: quantityRange[0] > quantityMin ? quantityRange[0] : null,
      quantidade_minima_max: quantityRange[1] < quantityMax ? quantityRange[1] : null,
    });
  };

  const clearFilters = () => {
    router.push(
      buildCatalogHref({
        subcategorias: null,
        publicos_alvos: activeFilters.publico_alvo ? activeFilters.publico_alvo : null,
        datas_promocionais: activeFilters.data_promocional ? activeFilters.data_promocional : null,
        quantidade_minima_min: null,
        quantidade_minima_max: null,
        page: 1,
      })
    );
  };

  const pageNumbers = Array.from(
    { length: Math.min(catalogo.totalPages, 7) },
    (_, index) => {
      const start = Math.max(
        1,
        Math.min(catalogo.page - 3, Math.max(catalogo.totalPages - 6, 1))
      );
      return start + index;
    }
  ).filter((page) => page <= catalogo.totalPages);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [catalogo.page]);

  return (
    <>
      <Breadcrumb title={pageTitle} pages={["brindes personalizados"]} />
      <section className="relative overflow-hidden bg-[#f3f4f6] pb-20 pt-5 lg:pt-12 xl:pt-16">
        <div className="mx-auto w-full max-w-[1800px] px-2 sm:px-3">
          <div className="flex gap-6 xl:gap-8">
            <div
              className={`sidebar-content fixed left-0 top-0 z-9999 w-full max-w-[310px] shrink-0 duration-200 ease-out xl:static xl:z-1 xl:max-w-[292px] xl:translate-x-0 ${
                productSidebar
                  ? "h-screen translate-x-0 overflow-y-auto bg-white p-5"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="Abrir filtros"
                className={`absolute -right-12.5 flex h-8 w-8 items-center justify-center rounded-md bg-white shadow-1 sm:-right-8 xl:hidden ${
                  stickyMenu ? "top-35 sm:top-34.5 lg:top-20" : "top-37 sm:top-39 lg:top-24"
                }`}
              >
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z"
                    fill=""
                  />
                </svg>
              </button>

              <form onSubmit={(event) => event.preventDefault()}>
                <div className="flex flex-col gap-5">
                  <div className="rounded-md border border-gray-3 bg-white px-5 py-4 shadow-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-dark">Filtros</p>
                      <button
                        type="button"
                        onClick={clearFilters}
                        disabled={!hasFilters}
                        className="text-blue disabled:cursor-not-allowed disabled:text-dark-4"
                      >
                        Limpar filtros
                      </button>
                    </div>
                  </div>

                  {!isSubcategoryRoute && (
                    <div className="rounded-md border border-gray-3 bg-white shadow-1">
                      <label
                        htmlFor="catalog-category"
                        className="block py-3 pl-6 pr-5.5 font-medium text-dark shadow-filter"
                      >
                        Categoria
                      </label>
                      <div className="p-5">
                        <select
                          id="catalog-category"
                          value={activeCategoryId}
                          onChange={(event) => selectCategory(Number(event.target.value))}
                          className="h-11 w-full rounded-md border border-gray-3 bg-white px-3 text-custom-sm text-dark outline-none duration-200 focus:border-blue"
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <FilterGroup
                    title="Subcategorias"
                    options={subcategoryOptions}
                    selectedIds={selectedSubcategorias}
                    onToggle={selectSubcategory}
                  />

                  <FilterGroup
                    title="Publico-alvo"
                    options={publicOptions}
                    selectedIds={selectedPublicos}
                    onToggle={(id) => toggleMultiFilter("publicos_alvos", id)}
                  />

                  <FilterGroup
                    title="Datas promocionais"
                    options={dateFilterOptions}
                    selectedIds={selectedDatas}
                    onToggle={(id) => toggleMultiFilter("datas_promocionais", id)}
                  />
                
                </div>
              </form>
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-6 rounded-md border border-gray-3 bg-white px-4 py-3 shadow-1 sm:px-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <p>
                      Mostrando{" "}
                      <span className="text-dark">
                        {formatNumber(firstItem)}-{formatNumber(lastItem)}
                      </span>{" "}
                      de <span className="text-dark">{formatNumber(catalogo.total)}</span>{" "}
                      produtos
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    <button
                      onClick={() => setProductStyle("grid")}
                      aria-label="Visualizacao em grade"
                      className={`${
                        productStyle === "grid"
                          ? "border-blue bg-blue text-white"
                          : "border-gray-3 bg-gray-1 text-dark"
                      } flex h-9 w-10.5 items-center justify-center rounded-[5px] border duration-200 hover:border-blue hover:bg-blue hover:text-white`}
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 2h5v5H2V2Zm9 0h5v5h-5V2ZM2 11h5v5H2v-5Zm9 0h5v5h-5v-5Z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => setProductStyle("list")}
                      aria-label="Visualizacao em lista"
                      className={`${
                        productStyle === "list"
                          ? "border-blue bg-blue text-white"
                          : "border-gray-3 bg-gray-1 text-dark"
                      } flex h-9 w-10.5 items-center justify-center rounded-[5px] border duration-200 hover:border-blue hover:bg-blue hover:text-white`}
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 3h3v3H2V3Zm5 0h9v3H7V3ZM2 8h3v3H2V8Zm5 0h9v3H7V8Zm-5 5h3v3H2v-3Zm5 0h9v3H7v-3Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {items.length ? (
                <div
                  className={`${
                    productStyle === "grid"
                      ? "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                      : "flex flex-col gap-7.5"
                  }`}
                >
                  {items.map((item) =>
                    productStyle === "grid" ? (
                      <SingleGridItem item={item} key={item.id} />
                    ) : (
                      <SingleListItem item={item} key={item.id} />
                    )
                  )}
                </div>
              ) : (
                <div className="rounded-md border border-gray-3 bg-white p-8 text-center shadow-1">
                  <h2 className="text-lg font-medium text-dark">Nenhum produto encontrado</h2>
                  <p className="mt-2 text-custom-sm text-dark-4">
                    Ajuste os filtros para ver mais opcoes desta categoria.
                  </p>
                </div>
              )}

              {catalogo.totalPages > 1 && (
                <div className="mt-15 flex justify-center">
                  <div className="rounded-md bg-white p-2 shadow-1">
                    <ul className="flex items-center">
                      <li>
                        <Link
                          aria-label="Pagina anterior"
                          href={buildCatalogHref({
                            page: catalogo.page > 1 ? catalogo.page - 1 : catalogo.page,
                          })}
                          className={`flex h-9 w-8 items-center justify-center rounded-[3px] duration-200 ${
                            catalogo.page <= 1
                              ? "pointer-events-none text-gray-4"
                              : "hover:bg-blue hover:text-white"
                          }`}
                        >
                          &lt;
                        </Link>
                      </li>

                      {pageNumbers.map((page) => (
                        <li key={page}>
                          <Link
                            href={buildCatalogHref({ page })}
                            className={`flex rounded-[3px] px-3.5 py-1.5 duration-200 hover:bg-blue hover:text-white ${
                              page === catalogo.page ? "bg-blue text-white" : ""
                            }`}
                          >
                            {page}
                          </Link>
                        </li>
                      ))}

                      <li>
                        <Link
                          aria-label="Próxima página"
                          href={buildCatalogHref({
                            page:
                              catalogo.page < catalogo.totalPages
                                ? catalogo.page + 1
                                : catalogo.page,
                          })}
                          className={`flex h-9 w-8 items-center justify-center rounded-[3px] duration-200 ${
                            catalogo.page >= catalogo.totalPages
                              ? "pointer-events-none text-gray-4"
                              : "hover:bg-blue hover:text-white"
                          }`}
                        >
                          &gt;
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {categoryDescription && (
                <section className="mx-auto mt-16 max-w-[1500px] rounded-md border border-gray-3 bg-white px-5 py-8 text-center shadow-1 sm:px-8 lg:px-12">
                  <h2 className="mb-8 text-center text-3xl font-semibold leading-tight text-dark sm:text-4xl">
                    {categoryName}
                  </h2>
                  <div
                    className="text-justify text-base leading-8 text-dark-4 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-center [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-dark"
                    style={{ whiteSpace: "pre-line" }}
                    dangerouslySetInnerHTML={{ __html: categoryDescription }}
                  />
                </section>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;
