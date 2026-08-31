"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { formatDisplayPrice } from "@/lib/products";
import { fetchWithTimeout } from "@/lib/timed-fetch";
import { personalizedSuffix } from "@/lib/slugs";
import { useAppSelector } from "@/redux/store";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// @ts-ignore -- Side-effect CSS import resolved by Next.js bundler.
import "swiper/css";

export type HeaderMenuGroup = {
  id: string;
  title: string;
  path?: string;
  items?: {
    id: string;
    title: string;
    path: string;
  }[];
};

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

const SEARCH_STALE_TIME = 30 * 1000;
const SEARCH_CACHE_TIME = 5 * 60 * 1000;
const SEARCH_CACHE_KEY = "product-search-v2";
const MENU_CACHE_TIME = 60 * 60 * 1000;
const MENU_CACHE_KEY = "header-menu-v2";

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

const fetchMenuGroups = async (signal?: AbortSignal): Promise<HeaderMenuGroup[]> => {
  const response = await fetchWithTimeout("/api/menu", {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error("Não foi possível atualizar o menu.");
  }

  const payload = await response.json();
  return Array.isArray(payload?.data) ? payload.data : defaultMenuGroups;
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
    title: "Brindes",
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
  "Faturamento mínimo R$1.000,00",
];

const menuColumns = <T,>(items: T[], rowsPerColumn = 12) =>
  Array.from({ length: Math.ceil(items.length / rowsPerColumn) }, (_, index) =>
    items.slice(index * rowsPerColumn, index * rowsPerColumn + rowsPerColumn)
  );

const normalizeSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const searchPathFromQuery = (query: string) => {
  const slug = normalizeSearchText(query).replace(/\s+/g, "-");
  const suffix = personalizedSuffix(query);

  return slug
    ? `/brindes-para-empresas/${encodeURIComponent(`${slug}-${suffix}`)}`
    : "/";
};

const Header = ({
  initialMenuGroups = defaultMenuGroups,
}: {
  initialMenuGroups?: HeaderMenuGroup[];
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const menuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const touchMenuHandled = useRef(false);
  const { openCartModal } = useCartModalContext();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const trimmedSearchQuery = searchQuery.trim();
  const normalizedSearchQuery = trimmedSearchQuery.toLocaleLowerCase("pt-BR");
  const menuQuery = useQuery<HeaderMenuGroup[]>({
    queryKey: [MENU_CACHE_KEY],
    queryFn: ({ signal }) => fetchMenuGroups(signal),
    initialData: initialMenuGroups,
    staleTime: MENU_CACHE_TIME,
    gcTime: MENU_CACHE_TIME,
    refetchInterval: MENU_CACHE_TIME,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    retry: 1,
  });
  const menuGroups: HeaderMenuGroup[] = menuQuery.data ?? initialMenuGroups;
  const suggestionsQuery = useQuery({
    queryKey: [SEARCH_CACHE_KEY, debouncedSearchQuery, 10],
    queryFn: ({ signal }) => searchProducts(debouncedSearchQuery, 10, signal),
    enabled: debouncedSearchQuery.length >= 2,
    staleTime: SEARCH_STALE_TIME,
    gcTime: SEARCH_CACHE_TIME,
    retry: false,
  });
  const searchSuggestions =
    debouncedSearchQuery === normalizedSearchQuery && searchFocused
      ? Array.isArray(suggestionsQuery.data?.data?.items)
        ? suggestionsQuery.data.data.items
        : []
      : [];

  const openMenu = (menuId: string) => {
    if (menuCloseTimer.current) {
      clearTimeout(menuCloseTimer.current);
    }

    setActiveMenuId(menuId);
  };

  const toggleMenu = (menuId: string) => {
    if (menuCloseTimer.current) {
      clearTimeout(menuCloseTimer.current);
    }

    setActiveMenuId((current) => (current === menuId ? null : menuId));
  };

  const closeMenu = () => {
    menuCloseTimer.current = setTimeout(() => {
      setActiveMenuId(null);
    }, 160);
  };

  const closeSearchUi = useCallback(() => {
    setNavigationOpen(false);
    setActiveMenuId(null);
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
          10,
        ]);
        const payload =
          cachedSuggestions !== undefined
            ? cachedSuggestions
            : await queryClient.fetchQuery({
                queryKey: [SEARCH_CACHE_KEY, query, 1],
                queryFn: ({ signal }) => searchProducts(query, 1, signal),
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

  useEffect(() => {
    return () => {
      if (menuCloseTimer.current) {
        clearTimeout(menuCloseTimer.current);
      }
    };
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-9999 w-full transition-all duration-300 ${
        stickyMenu ? "bg-white/95 shadow-2 backdrop-blur-xl" : "bg-white/92 backdrop-blur-xl"
      }`}
    >
      <div className="border-b border-blue bg-white text-blue">
        <div className="mx-auto h-9 w-full max-w-[1800px] px-2 text-center text-sm font-semibold">
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

      <div className="mx-auto w-full max-w-[1800px] px-2 sm:px-3">
        <div
          className={`relative grid grid-cols-[auto_1fr_auto] items-center gap-4 transition-all duration-200 ${
            stickyMenu ? "py-3" : "py-4"
          }`}
        >
          <Link className="ml-2 flex-shrink-0 sm:ml-3 sm:flex-shrink-0 xl:ml-0 xl:flex-shrink-0" href="/" aria-label="Maggenta">
            <img
              src="/images/logo/NOVO_LOGO_MAGG_HORIZONTAL_COR.png"
              alt="Maggenta"
              width={190}
              height={32}
              className="h-auto w-[132px] sm:w-[176px] lg:w-[190px]"
            />
          </Link>

          <nav
            className={`absolute left-0 right-0 top-full w-full flex-col rounded-b-[28px] border-none border-gray-3 bg-white p-0 shadow-2 min-[1200px]:static min-[1200px]:block min-[1200px]:w-auto min-[1200px]:translate-x-0 min-[1200px]:translate-y-0 min-[1200px]:border-0 min-[1200px]:bg-transparent min-[1200px]:p-0 min-[1200px]:shadow-none ${
            
              navigationOpen ? "flex" : "hidden"
            }`}
          >
            <ul className="flex max-h-[calc(100dvh-132px)] flex-col gap-5 overflow-y-auto overscroll-contain px-2 py-3 min-[1200px]:max-h-none min-[1200px]:flex-row min-[1200px]:items-center min-[1200px]:justify-center min-[1200px]:gap-9 min-[1200px]:overflow-visible min-[1200px]:px-0 min-[1200px]:py-0">
              {menuGroups.map((menuItem) => (
                <li
                  key={menuItem.id}
                  onMouseEnter={() => openMenu(menuItem.id)}
                  onMouseLeave={closeMenu}
                  className="group"
                >
                  {menuItem.items?.length ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={activeMenuId === menuItem.id}
                        onPointerDown={(event) => {
                          if (event.pointerType === "mouse") {
                            return;
                          }

                          event.preventDefault();
                          touchMenuHandled.current = true;
                          toggleMenu(menuItem.id);
                        }}
                        onClick={(event) => {
                          if (touchMenuHandled.current) {
                            touchMenuHandled.current = false;
                            return;
                          }

                          if (menuItem.path) {
                            setNavigationOpen(false);
                            setActiveMenuId(null);
                            router.push(menuItem.path);
                            return;
                          }

                          toggleMenu(menuItem.id);
                        }}
                        className="flex min-h-11 items-center gap-1 py-2 text-left text-sm font-medium text-dark hover:text-blue min-[1200px]:min-h-0 min-[1200px]:py-0"
                      >
                        <span className="relative before:absolute before:left-0 before:-top-2 before:h-[3px] before:w-0 before:rounded-b-[3px] before:bg-blue before:duration-200 min-[1200px]:group-hover:before:w-full">
                          {menuItem.title}
                        </span>
                      </button>

                      <div
                        onMouseEnter={() => openMenu(menuItem.id)}
                        onMouseLeave={closeMenu}
                        data-active={activeMenuId === menuItem.id ? "true" : undefined}
                        data-dropdown-id={menuItem.id}
                        className={`static pt-0 min-[1200px]:absolute min-[1200px]:left-[calc(50%+140px)] min-[1200px]:top-full min-[1200px]:z-9999 min-[1200px]:w-auto min-[1200px]:max-w-[calc(100vw-32px)] min-[1200px]:-translate-x-1/2 min-[1200px]:pt-0 ${
                          activeMenuId === menuItem.id ? "block" : "hidden"
                        }`}
                      >
                        <div className="mt-0 max-h-[min(60dvh,420px)] overflow-y-auto overscroll-contain rounded-2xl border border-gray-3 bg-white p-2 pt-0 shadow-2 min-[1200px]:max-h-none min-[1200px]:overflow-x-auto min-[1200px]:overflow-y-visible min-[1200px]:rounded-[24px] min-[1200px]:px-8 min-[1200px]:py-7 min-[1200px]:pt-7">
                          <div className="flex flex-col gap-x-12 gap-y-1 min-[1200px]:flex-row">
                            {menuColumns(menuItem.items, 16).map((column, columnIndex) => (
                              <ul
                                key={`${menuItem.id}-${columnIndex}`}
                                className="flex min-w-[240px] flex-col gap-y-1"
                              >
                                {column.map((item, itemIndex) => (
                                  <li key={item.id} className={itemIndex === 0 ? "pt-[5px]" : undefined}>
                                    <Link
                                      href={item.path}
                                      onClick={() => {
                                        setNavigationOpen(false);
                                        setActiveMenuId(null);
                                      }}
                                      className="block min-h-11 rounded-full px-3 py-1 text-sm font-light uppercase text-dark hover:bg-gray-1 hover:text-blue min-[1200px]:min-h-0 min-[1200px]:text-xs"
                                    >
                                      {item.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={menuItem.path || "/"}
                      onClick={() => setNavigationOpen(false)}
                      className="relative flex min-h-11 items-center py-2 text-sm font-medium text-dark hover:text-blue before:absolute before:left-0 before:-top-2 before:h-[3px] before:w-0 before:rounded-b-[3px] before:bg-blue before:duration-200 min-[1200px]:min-h-0 min-[1200px]:py-0 min-[1200px]:hover:before:w-full"
                    >
                      {menuItem.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <div ref={mobileSearchRef} className="relative flex h-11 items-center justify-end sm:hidden">
              <form
                onSubmit={handleSearchSubmit}
                className={`relative flex h-11 origin-right items-center overflow-visible transition-[width,opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
                  mobileSearchOpen
                    ? "w-[calc(100vw-168px)] max-w-[240px] scale-x-100 opacity-100"
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
                  className="h-11 w-full rounded-full border border-gray-3 bg-gray-1 pl-4 pr-11 text-sm text-dark outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-dark-4 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
                <button
                  type="submit"
                  aria-label="Buscar"
                  disabled={searching}
                  aria-busy={searching}
                  className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full text-dark transition-colors duration-200 hover:bg-gray-2 hover:text-blue disabled:cursor-wait disabled:opacity-70"
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
              className="relative hidden w-[132px] items-center justify-end transition-all duration-300 xsm:w-[150px] sm:flex sm:w-[220px] lg:w-[320px]"
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
                className="h-11 w-full rounded-full border border-gray-3 bg-gray-1 pl-4 pr-11 text-sm text-dark outline-none transition-all duration-300 placeholder:text-dark-4 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
              <button
                type="submit"
                aria-label="Buscar"
                disabled={searching}
                aria-busy={searching}
                className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full text-dark transition-colors duration-200 hover:bg-gray-2 hover:text-blue disabled:cursor-wait disabled:opacity-70"
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
              <span className="text-xs font-medium text-blue/80">Ligue-nos agora</span>
              <span className="text-sm font-semibold">(11) 2287-6444</span>
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
    </header>
  );
};

export default Header;
