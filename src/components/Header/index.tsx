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

type HeaderMenuGroup = {
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

const SEARCH_CACHE_TIME = 60 * 60 * 1000;
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

  if (response.status === 404) {
    return null;
  }

  return response.ok ? response.json() : null;
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
    id: "categorias",
    title: "Categorias",
    items: [{ id: "1", title: "Produtos", path: "/brindes-personalizados" }],
  },
  {
    id: "brindes",
    title: "Brindes",
    path: "/brindes-para-empresas",
    items: [{ id: "1", title: "Corporativos", path: "/brindes-personalizados" }],
  },
  {
    id: "lancamentos",
    title: "Lançamentos",
    path: "/lancamentos",
  },
  {
    id: "publicos",
    title: "Publicos alvos",
    items: [{ id: "1", title: "Empresas", path: "/publicos-alvos/1-empresas" }],
  },
  {
    id: "datas",
    title: "Datas promocionais",
    items: [{ id: "1", title: "Black Friday", path: "/brindes-personalizados" }],
  },
];

const topbarItems = [
  "(11) 2971-5252 / (11) 2950-3923",
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

const Header = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const menuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchMenuHandled = useRef(false);
  const { openCartModal } = useCartModalContext();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const trimmedSearchQuery = searchQuery.trim();
  const menuQuery = useQuery<HeaderMenuGroup[]>({
    queryKey: [MENU_CACHE_KEY],
    queryFn: ({ signal }) => fetchMenuGroups(signal),
    staleTime: MENU_CACHE_TIME,
    gcTime: MENU_CACHE_TIME,
    refetchInterval: MENU_CACHE_TIME,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    retry: 1,
  });
  const menuGroups: HeaderMenuGroup[] = menuQuery.data ?? defaultMenuGroups;
  const suggestionsQuery = useQuery({
    queryKey: [SEARCH_CACHE_KEY, debouncedSearchQuery, 10],
    queryFn: ({ signal }) => searchProducts(debouncedSearchQuery, 10, signal),
    enabled: debouncedSearchQuery.length >= 2,
    staleTime: SEARCH_CACHE_TIME,
    gcTime: SEARCH_CACHE_TIME,
    retry: false,
  });
  const searchSuggestions =
    debouncedSearchQuery === trimmedSearchQuery && searchFocused
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
  }, []);

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
      setDebouncedSearchQuery(trimmedSearchQuery);
    }, 220);

    return () => {
      clearTimeout(timer);
    };
  }, [trimmedSearchQuery]);

  const handleSearchSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const query = searchQuery.trim();

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
                staleTime: SEARCH_CACHE_TIME,
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
        showSearchNotFoundMessage();
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
      <div className="bg-[#241827] text-white">
        <div className="mx-auto w-full max-w-[1800px] px-2 py-2 text-center text-sm font-semibold sm:hidden">
          <Swiper
            loop
            autoplay={{ delay: 2600, disableOnInteraction: false }}
            modules={[Autoplay]}
            slidesPerView={1}
          >
            {topbarItems.map((item) => (
              <SwiperSlide key={item}>{item}</SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="mx-auto hidden w-full max-w-[1800px] items-center justify-between gap-1 px-2 py-2 text-center text-xs font-semibold sm:flex sm:px-3 sm:text-sm">
          {topbarItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1800px] px-2 sm:px-3">
        <div
          className={`relative grid grid-cols-[auto_1fr_auto] items-center gap-4 transition-all duration-200 sm:grid-cols-[auto_1fr_auto] xl:grid-cols-[auto_1fr_auto] ${
            stickyMenu ? "py-3" : "py-4"
          }`}
        >
          <Link className="flex-shrink-0 sm:flex-shrink-0 xl:flex-shrink-0" href="/" aria-label="Maggenta">
            <img
              src="/images/logo/logo.svg?v=20260623"
              alt="Maggenta"
              width={190}
              height={32}
              className="h-auto w-[118px] sm:w-[170px] lg:w-[190px]"
            />
          </Link>

          <nav
            className={`absolute left-0 right-0 top-full w-full flex-col rounded-b-[28px] border-none border-gray-3 bg-white p-0 shadow-2 sm:static sm:block sm:w-auto sm:translate-x-0 sm:translate-y-0 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none ${
            
              navigationOpen ? "flex" : "hidden"
            }`}
          >
            <ul className="flex flex-col gap-5 px-2 py-3 sm:flex-row sm:px-0 sm:py-0 sm:items-center sm:justify-center sm:gap-9">
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
                        className="flex min-h-11 items-center gap-1 py-2 text-left text-sm font-medium text-dark hover:text-blue sm:min-h-0 sm:py-0"
                      >
                        <span className="relative before:absolute before:left-0 before:-top-2 before:h-[3px] before:w-0 before:rounded-b-[3px] before:bg-blue before:duration-200 sm:group-hover:before:w-full">
                          {menuItem.title}
                        </span>
                      </button>

                      <div
                        onMouseEnter={() => openMenu(menuItem.id)}
                        onMouseLeave={closeMenu}
                        data-active={activeMenuId === menuItem.id ? "true" : undefined}
                        data-dropdown-id={menuItem.id}
                        className={`static pt-0 sm:absolute sm:left-[calc(50%+140px)] sm:top-full sm:z-9999 sm:w-auto sm:max-w-[calc(100vw-32px)] sm:-translate-x-1/2 sm:pt-0 ${
                          activeMenuId === menuItem.id ? "block" : "hidden"
                        }`}
                      >
                        <div className="mt-0 overflow-x-auto rounded-2xl border border-gray-3 bg-white p-2 pt-0 shadow-2 sm:rounded-[24px] sm:px-8 sm:py-7 sm:pt-7">
                          <div className="flex flex-col gap-x-12 gap-y-1 sm:flex-row">
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
                                      className="block min-h-11 rounded-full px-3 py-1 text-sm font-light uppercase text-dark hover:bg-gray-1 hover:text-blue sm:min-h-0 sm:text-xs"
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
                      className="relative flex min-h-11 items-center py-2 text-sm font-medium text-dark hover:text-blue before:absolute before:left-0 before:-top-2 before:h-[3px] before:w-0 before:rounded-b-[3px] before:bg-blue before:duration-200 sm:min-h-0 sm:hover:before:w-full sm:py-0"
                    >
                      {menuItem.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <form
              onSubmit={handleSearchSubmit}
              className="relative mx-2 mb-3 flex w-auto items-center justify-end transition-all duration-300 sm:hidden"
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
                onClick={closeSearchUi}
                aria-label="Buscar"
                disabled={searching}
                aria-busy={searching}
                className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full text-dark transition-colors duration-200 hover:bg-gray-2 hover:text-blue disabled:cursor-wait disabled:opacity-70"
              >
                <SearchButtonIcon loading={searching} />
              </button>
              {searchFocused && searchSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-3 bg-white py-2 shadow-2" onMouseDown={(e) => e.preventDefault()}>
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
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-4">
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

            <button
              type="button"
              onClick={openCartModal}
              className="flex h-11 items-center gap-2 rounded-full border border-gray-3 bg-white px-3.5 text-dark shadow-1 transition-colors duration-200 hover:border-blue hover:text-blue"
              aria-label="Abrir orÃ§amento"
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
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-3 bg-white shadow-1 sm:hidden"
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
