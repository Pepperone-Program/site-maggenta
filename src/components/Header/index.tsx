"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { formatDisplayPrice } from "@/lib/products";
import { fetchWithTimeout } from "@/lib/timed-fetch";
import { useAppSelector } from "@/redux/store";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// @ts-ignore -- Side-effect CSS import resolved by Next.js bundler.
import "swiper/css";

import CategoryNavigation from "./CategoryNavigation";
import { useHeaderMenu } from "./useHeaderMenu";
import type { HeaderMenuGroup } from "@/types/header-menu";
export type { HeaderMenuGroup } from "@/types/header-menu";

type SearchSuggestion = {
  id: number;
  label: string;
  path: string;
};

type SearchSubmitPayload = {
  data?: {
    items?: SearchSuggestion[];
  };
  destino_busca?: {
    tipo?: string | null;
    path?: string | null;
  } | null;
};

type SearchPayload = SearchSubmitPayload;

const SEARCH_FIELD_WIDTH = 800;
const HEADER_LOGO_WIDTH = 180;
const SEARCH_STALE_TIME = 30 * 1000;
const SEARCH_CACHE_TIME = 5 * 60 * 1000;
const SEARCH_CACHE_KEY = "product-search-v2";
const SEARCH_API_PAGE_SIZE = 24;
const SEARCH_SUGGESTION_LIMIT = 10;

const searchProducts = async (
  query: string,
  limit: number,
  signal?: AbortSignal
): Promise<SearchPayload | null> => {
  const response = await fetchWithTimeout(
    `/api/produtos/busca?q=${encodeURIComponent(query)}&limit=${limit}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(`A busca respondeu HTTP ${response.status}.`);
  }

  return response.json();
};

const showSearchNotFoundMessage = () => {
  toast.error("Busca não encontrada", {
    description: "Tente outro código, nome ou categoria.",
    duration: 2500,
  });
};

const showSearchUnavailableMessage = () => {
  toast.error("Busca temporariamente indisponível", {
    description: "Não foi possível consultar os produtos. Tente novamente em instantes.",
    duration: 3500,
  });
};

const SearchButtonIcon = ({ loading }: { loading: boolean }) =>
  loading ? (
    <span
      aria-hidden="true"
      className="block h-[18px] w-[18px] animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  ) : (
    <svg className="fill-current" width="19" height="19" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.27 15.67 12.63 11.9a6.72 6.72 0 1 0-.84.96l4.69 3.8a.64.64 0 0 0 .88-.08.64.64 0 0 0-.09-.91ZM7.2 13.39a5.46 5.46 0 1 1 0-10.92 5.46 5.46 0 0 1 0 10.92Z" />
    </svg>
  );

const defaultMenuGroups: HeaderMenuGroup[] = [
  { id: "inicio", title: "Inicio", path: "/" },
  {
    id: "brindes",
    title: "Tipos de Produtos",
    path: "/brindes-para-empresas",
  },
  {
    id: "lancamentos",
    title: "Lançamentos",
    path: "/lancamentos",
  },
];

const topbarItems = [
  "(11) 2287-6444",
  "Seja Bem-Vindo à Maggenta Brindes Corporativos!",
  "Faturamento mínimo R$500,00",
];

const searchPathFromQuery = (query: string) =>
  `/busca?q=${encodeURIComponent(query.trim())}`;

const Header = ({
  initialMenuGroups = defaultMenuGroups,
}: {
  initialMenuGroups?: HeaderMenuGroup[];
}) => {
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;
    const update = () => document.documentElement.style.setProperty("--site-header-height", element.getBoundingClientRect().height + "px");
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => { observer.disconnect(); document.documentElement.style.removeProperty("--site-header-height"); };
  }, []);
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const closeNavigation = useCallback(() => setNavigationOpen(false), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);

  const [searching, setSearching] = useState(false);

  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const { openCartModal } = useCartModalContext();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const trimmedSearchQuery = searchQuery.trim();
  const normalizedSearchQuery = trimmedSearchQuery.toLocaleLowerCase("pt-BR");
  const menu = useHeaderMenu(initialMenuGroups);
  const suggestionsQuery = useQuery({
    queryKey: [SEARCH_CACHE_KEY, debouncedSearchQuery, SEARCH_API_PAGE_SIZE],
    queryFn: ({ signal }) =>
      searchProducts(debouncedSearchQuery, SEARCH_API_PAGE_SIZE, signal),
    enabled: debouncedSearchQuery.length >= 2,
    staleTime: SEARCH_STALE_TIME,
    gcTime: SEARCH_CACHE_TIME,
    retry: false,
  });
  const searchSuggestions =
    debouncedSearchQuery === normalizedSearchQuery && searchFocused
      ? Array.isArray(suggestionsQuery.data?.data?.items)
        ? suggestionsQuery.data.data.items.slice(0, SEARCH_SUGGESTION_LIMIT)
        : []
      : [];

  const closeSearchUi = useCallback(() => {
    setNavigationOpen(false);

    setSearchFocused(false);
    setMobileSearchOpen(false);
  }, []);

  useEffect(() => {
    if (!mobileSearchOpen) {
      return;
    }

    setNavigationOpen(false);
    const focusFrame = window.requestAnimationFrame(() => {
      mobileSearchInputRef.current?.focus();
    });

    const handlePointerDown = (event: PointerEvent) => {
      if (!mobileSearchRef.current?.contains(event.target as Node)) {
        setMobileSearchOpen(false);
        setSearchFocused(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [mobileSearchOpen]);

  useEffect(() => {
    closeSearchUi();
  }, [pathname, closeSearchUi]);

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["product-search"] });
    queryClient.invalidateQueries({ queryKey: [SEARCH_CACHE_KEY] });
  }, [queryClient]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const updateStickyMenu = () => {
      setStickyMenu(window.scrollY >= 24);
    };

    const handleScroll = () => {
      if (timer) {
        return;
      }

      timer = setTimeout(() => {
        updateStickyMenu();
        timer = null;
      }, 100);
    };

    updateStickyMenu();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (timer) {
        clearTimeout(timer);
      }

      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(normalizedSearchQuery);
    }, 220);

    return () => {
      clearTimeout(timer);
    };
  }, [normalizedSearchQuery]);

  const handleSearchSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const query = searchQuery.trim().toLocaleLowerCase("pt-BR");

      if (!query) {
        closeSearchUi();
        window.location.assign("/");
        return;
      }

      if (searching) {
        return;
      }

      closeSearchUi();
      setSearching(true);

      try {
        const cachedSuggestions = queryClient.getQueryData<SearchPayload | null>([
          SEARCH_CACHE_KEY,
          query,
          SEARCH_API_PAGE_SIZE,
        ]);
        const payload =
          cachedSuggestions !== undefined
            ? cachedSuggestions
            : await queryClient.fetchQuery({
                queryKey: [SEARCH_CACHE_KEY, query, SEARCH_API_PAGE_SIZE],
                queryFn: ({ signal }) =>
                  searchProducts(query, SEARCH_API_PAGE_SIZE, signal),
                staleTime: SEARCH_STALE_TIME,
                gcTime: SEARCH_CACHE_TIME,
              });
        const destinationPath = payload?.destino_busca?.path;
        const items = Array.isArray(payload?.data?.items) ? payload.data.items : [];

        if (destinationPath) {
          router.push(destinationPath);
          return;
        }

        if (items.length > 0) {
          router.push(searchPathFromQuery(query));
          return;
        }

        showSearchNotFoundMessage();
      } catch {
        showSearchUnavailableMessage();
      } finally {
        setSearching(false);
      }
    },
    [searchQuery, router, searching, closeSearchUi, queryClient]
  );

  return (
    <header
      ref={headerRef}
      className={`fixed left-0 top-0 z-9999 w-full transition-all duration-300 ${
        stickyMenu ? "bg-white/95 shadow-2 backdrop-blur-xl" : "bg-white/92 backdrop-blur-xl"
      }`}
    >
      <div className="border-b border-blue bg-white text-blue">
        <div className="mx-auto h-9 w-full max-w-[1600px] px-2 text-center text-sm font-semibold">
          <Swiper
            loop
            direction="vertical"
            autoplay={{ delay: 2600, disableOnInteraction: false }}
            modules={[Autoplay]}
            slidesPerView={1}
            className="h-9"
          >
            {topbarItems.map((item) => (
              <SwiperSlide key={item} className="!flex items-center justify-center">
                {item}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-2 sm:px-3">
        <div
          className={`relative flex flex-nowrap items-center gap-4 transition-all duration-200 ${
            stickyMenu ? "py-3" : "py-4"
          }`}
        >
          <Link className={styles.logo} style={{ width: `min(${HEADER_LOGO_WIDTH}px, 38vw)` }} href="/" aria-label="Maggenta">
            <img
              src="/images/logo/NOVO_LOGO_MAGG_HORIZONTAL_COR.png"
              alt="Maggenta"
              width={HEADER_LOGO_WIDTH}
              height={31}
              style={{ width: "100%", height: "auto", maxWidth: "100%" }}
            />
          </Link>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-4 lg:gap-6">
            <div ref={mobileSearchRef} className="relative flex h-12 items-center justify-end sm:hidden">
              <form
                onSubmit={handleSearchSubmit}
                style={{ maxWidth: SEARCH_FIELD_WIDTH }}
                className={`relative flex h-12 origin-right items-center overflow-visible transition-[width,opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
                  mobileSearchOpen
                    ? "w-[calc(100vw-168px)] scale-x-100 opacity-100 min-[375px]:w-[calc(100vw-192px)]"
                    : "pointer-events-none w-0 scale-x-95 opacity-0"
                }`}
              >
                <input
                  ref={mobileSearchInputRef}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  type="search"
                  name="search"
                  aria-label="Buscar produtos"
                  placeholder="Buscar produtos"
                  tabIndex={mobileSearchOpen ? 0 : -1}
                  className="h-12 w-full rounded-full border border-gray-3 bg-gray-2 pl-4 pr-12 text-base text-dark outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-dark-4 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
                <button
                  type="submit"
                  aria-label="Buscar"
                  disabled={searching}
                  aria-busy={searching}
                  className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center rounded-full text-blue transition-colors duration-200 hover:bg-gray-2 hover:text-blue disabled:cursor-wait disabled:opacity-70"
                >
                  <SearchButtonIcon loading={searching} />
                </button>
                {searchFocused && searchSuggestions.length > 0 && mobileSearchOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-[min(78vw,360px)] overflow-hidden rounded-2xl border border-gray-3 bg-white py-2 shadow-2" onPointerDown={(event) => event.preventDefault()}>
                    {searchSuggestions.map((suggestion) => (
                      <Link
                        key={suggestion.id}
                        href={suggestion.path}
                        onClick={() => {
                          setSearchQuery("");
                          closeSearchUi();
                        }}
                        className="block px-4 py-2 text-left text-sm font-medium text-dark hover:bg-gray-1 hover:text-blue"
                      >
                        {suggestion.label}
                      </Link>
                    ))}
                  </div>
                )}
              </form>

              <div
                aria-hidden={mobileSearchOpen}
                className={`flex items-center gap-2 overflow-hidden transition-[max-width,opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
                  mobileSearchOpen
                    ? "pointer-events-none max-w-0 translate-x-2 opacity-0"
                    : "max-w-[148px] translate-x-0 opacity-100"
                }`}
              >
                <button
                  type="button"
                  onClick={openCartModal}
                  tabIndex={mobileSearchOpen ? -1 : 0}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-dark shadow-1 transition-colors duration-200 hover:text-blue"
                  aria-label="Abrir orçamento"
                >
                  <span className="relative inline-flex">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M7 7h13l-1.2 7.2a2 2 0 0 1-2 1.8H9.4a2 2 0 0 1-2-1.6L5.8 4.8H3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 20h.01M17 20h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue text-2xs font-medium text-white">
                      {cartItems.length}
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileSearchOpen(true)}
                  tabIndex={mobileSearchOpen ? -1 : 0}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-3 bg-white text-dark shadow-1 transition-colors duration-200 hover:text-blue"
                  aria-label="Abrir busca"
                  aria-expanded={mobileSearchOpen}
                >
                  <SearchButtonIcon loading={false} />
                </button>

                <button
                  aria-label="Abrir menu"
                  aria-controls="category-navigation"
                  aria-expanded={navigationOpen}
                  tabIndex={mobileSearchOpen ? -1 : 0}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-3 bg-white shadow-1"
                  onClick={() => setNavigationOpen((value) => !value)}
                  type="button"
                >
                  <span className="relative block h-4 w-5" aria-hidden="true">
                    <span className="absolute left-0 top-0 block h-0.5 w-full rounded bg-dark" />
                    <span className="absolute left-0 top-1/2 block h-0.5 w-full -translate-y-1/2 rounded bg-dark" />
                    <span className="absolute bottom-0 left-0 block h-0.5 w-full rounded bg-dark" />
                  </span>
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              style={{ width: SEARCH_FIELD_WIDTH, maxWidth: "100%" }}
              className="relative mx-auto hidden min-w-0 shrink items-center justify-end sm:flex sm:ml-4 lg:mx-auto"
            >
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => {
                  setTimeout(() => setSearchFocused(false), 300);
                }}
                type="search"
                name="search"
                aria-label="Buscar produtos"
                placeholder="Buscar produtos"
                className="h-14 w-full rounded-full border border-gray-3 bg-gray-2 pl-5 pr-14 text-base text-dark outline-none transition-all duration-300 placeholder:text-dark-4 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
              <button
                type="submit"
                aria-label="Buscar"
                disabled={searching}
                aria-busy={searching}
                className="absolute right-0 top-0 flex h-14 w-14 items-center justify-center rounded-full text-blue transition-colors duration-200 hover:bg-gray-2 hover:text-blue disabled:cursor-wait disabled:opacity-70"
              >
                <SearchButtonIcon loading={searching} />
              </button>
              {searchFocused && searchSuggestions.length > 0 && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[min(420px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-gray-3 bg-white py-2 shadow-2" onMouseDown={(e) => e.preventDefault()}>
                  {searchSuggestions.map((suggestion) => (
                    <Link
                      key={suggestion.id}
                      href={suggestion.path}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setSearchQuery("");
                        closeSearchUi();
                      }}
                      className="block px-4 py-2 text-left text-sm font-medium text-dark hover:bg-gray-1 hover:text-blue"
                    >
                      {suggestion.label}
                    </Link>
                  ))}
                </div>
              )}
            </form>

            <a
              href="tel:+551122876444"
              className="hidden min-w-max flex-col leading-tight text-blue min-[1200px]:flex"
              aria-label="Ligue para Maggenta Brindes"
            >
              <span className="text-sm font-medium text-blue/80">Ligue-nos agora</span>
              <span className="text-xl font-bold tracking-tight">(11) 2287-6444</span>
            </a>

            <button
              type="button"
              onClick={openCartModal}
              className="hidden h-11 items-center gap-2 rounded-full bg-white px-3.5 text-dark shadow-1 transition-colors duration-200 hover:text-blue sm:flex"
              aria-label="Abrir orçamento"
            >
              <span className="relative inline-flex">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 7h13l-1.2 7.2a2 2 0 0 1-2 1.8H9.4a2 2 0 0 1-2-1.6L5.8 4.8H3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 20h.01M17 20h.01"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue text-2xs font-medium text-white">
                  {cartItems.length}
                </span>
              </span>
              <span className="hidden text-sm font-medium sm:inline">
                {formatDisplayPrice(totalPrice)}
              </span>
            </button>

            <button
              aria-label="Abrir menu"
                  aria-controls="category-navigation"
                  aria-expanded={navigationOpen}
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-gray-3 bg-white shadow-1 sm:flex min-[1200px]:hidden"
              onClick={() => setNavigationOpen((value) => !value)}
              type="button"
            >
              <span className="relative block h-4 w-5">
                <span className="absolute left-0 top-0 block h-0.5 w-full rounded bg-dark" />
                <span className="absolute left-0 top-1/2 block h-0.5 w-full -translate-y-1/2 rounded bg-dark" />
                <span className="absolute bottom-0 left-0 block h-0.5 w-full rounded bg-dark" />
              </span>
            </button>
          </div>
        </div>
      </div>
      <CategoryNavigation groups={menu.groups} mobileOpen={navigationOpen} onClose={closeNavigation}
        menuError={menu.isError} retryMenu={menu.retry} />
    </header>
  );
};

export default Header;
