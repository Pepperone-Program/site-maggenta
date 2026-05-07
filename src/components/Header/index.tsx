"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { formatDisplayPrice } from "@/lib/products";
import { useAppSelector } from "@/redux/store";
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

const defaultMenuGroups: HeaderMenuGroup[] = [
  { id: "inicio", title: "Inicio", path: "/" },
  {
    id: "categorias",
    title: "Categorias",
    items: [{ id: "1", title: "Produtos", path: "/shop-with-sidebar" }],
  },
  {
    id: "brindes",
    title: "Brindes",
    items: [{ id: "1", title: "Corporativos", path: "/shop-with-sidebar?tipo=1" }],
  },
  {
    id: "publicos",
    title: "Publicos alvos",
    items: [{ id: "1", title: "Empresas", path: "/shop-with-sidebar?publico=1" }],
  },
  {
    id: "datas",
    title: "Datas promocionais",
    items: [{ id: "1", title: "Black Friday", path: "/shop-with-sidebar?data=1" }],
  },
];

const topbarItems = [
  "(11) 2971-5252 / (11) 2950-3923",
  "Seja Bem-Vindo à Pepperone Brindes Corporativos!",
  "Faturamento mínimo R$1.000,00",
];

const Header = () => {
  const router = useRouter();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [menuGroups, setMenuGroups] = useState(defaultMenuGroups);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSearchQuery = useRef("");
  const { openCartModal } = useCartModalContext();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const menuColumnCount = (itemsCount: number) =>
    Math.max(1, Math.min(4, Math.ceil(itemsCount / 8)));

  const openMenu = (menuId: string) => {
    if (menuCloseTimer.current) {
      clearTimeout(menuCloseTimer.current);
    }

    setActiveMenuId(menuId);
  };

  const closeMenu = () => {
    menuCloseTimer.current = setTimeout(() => {
      setActiveMenuId(null);
    }, 160);
  };

  useEffect(() => {
    const handleStickyMenu = () => setStickyMenu(window.scrollY >= 24);

    handleStickyMenu();
    window.addEventListener("scroll", handleStickyMenu);

    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    latestSearchQuery.current = query;

    if (query.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    setSearchSuggestions([]);
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/produtos/busca?q=${encodeURIComponent(query)}&limit=10`, {
        signal: controller.signal,
      })
        .then((response) => {
          if (response.status === 404) {
            return null;
          }

          return response.ok ? response.json() : null;
        })
        .then((payload) => {
          if (latestSearchQuery.current !== query) {
            return;
          }

          if (Array.isArray(payload?.data)) {
            setSearchSuggestions(payload.data);
          }
        })
        .catch(() => undefined);
    }, 220);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();

    if (!query) {
      window.location.assign("/");
      return;
    }

    try {
      const response = await fetch(
        `/api/produtos/busca?q=${encodeURIComponent(query)}&limit=1`
      );

      if (response.status === 404) {
        setSearchFocused(false);
        setSearchSuggestions([]);
        window.location.assign("/");
        return;
      }

      const payload = response.ok ? await response.json() : null;
      const firstSuggestion = Array.isArray(payload?.data) ? payload.data[0] : null;

      if (firstSuggestion?.path) {
        router.push(firstSuggestion.path);
        setSearchFocused(false);
        return;
      }
    } catch {
      // Keep the search flow deterministic even when the suggestion endpoint fails.
    }

    window.location.assign("/");
  };

  useEffect(() => {
    let active = true;

    fetch("/api/menu")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (active && Array.isArray(payload?.data)) {
          setMenuGroups(payload.data);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (menuCloseTimer.current) {
        clearTimeout(menuCloseTimer.current);
      }
    };
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-9999 w-full bg-white transition-all duration-300 ${
        stickyMenu ? "shadow" : ""
      }`}
    >
      <div className="bg-[#249230] text-white">
        <div className="mx-auto w-full max-w-[1800px] px-2 py-2 text-center text-xs font-semibold sm:hidden">
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
          className={`relative grid grid-cols-[auto_1fr_auto] items-center gap-4 transition-all duration-200 ${
            stickyMenu ? "py-3" : "py-4"
          }`}
        >
          <Link className="flex-shrink-0" href="/" aria-label="Pepperone">
            <Image
              src="/images/logo/logo.svg"
              alt="Pepperone"
              width={190}
              height={32}
              priority
              className="h-auto w-[118px] sm:w-[170px] lg:w-[190px]"
            />
          </Link>

          <nav
            className={`absolute right-2 top-full w-[300px] rounded-md border border-gray-3 bg-white p-5 shadow-lg xl:left-1/2 xl:right-auto xl:top-1/2 xl:block xl:w-auto xl:-translate-x-1/2 xl:-translate-y-1/2 xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none ${
              navigationOpen ? "block" : "hidden"
            }`}
          >
            <ul className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-center xl:gap-9">
              {menuGroups.map((menuItem) => (
                <li
                  key={menuItem.id}
                  onMouseEnter={() => openMenu(menuItem.id)}
                  onMouseLeave={closeMenu}
                  className="relative before:absolute before:left-0 before:top-0 before:h-[3px] before:w-0 before:rounded-b-[3px] before:bg-blue before:duration-200 hover:before:w-full"
                >
                  {menuItem.items?.length ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId((current) =>
                            current === menuItem.id ? null : menuItem.id
                          )
                        }
                        className="flex items-center gap-1 py-2 text-left text-custom-sm font-medium text-dark hover:text-blue xl:py-0"
                      >
                        {menuItem.title}
                        <span className="text-xs">⌄</span>
                      </button>

                      <div
                        onMouseEnter={() => openMenu(menuItem.id)}
                        onMouseLeave={closeMenu}
                        className={`static pt-0 xl:fixed xl:left-1/2 xl:top-[104px] xl:w-[calc(100vw-32px)] xl:max-w-[1170px] xl:-translate-x-1/2 xl:pt-0 ${
                          activeMenuId === menuItem.id ? "block" : "hidden"
                        }`}
                      >
                        <div className="rounded-md border border-gray-3 bg-white p-4 shadow-lg xl:rounded-none xl:border-x-0 xl:border-b xl:border-t-0 xl:px-8 xl:py-5">
                          <ul
                            className="flex flex-col gap-x-12 gap-y-1 xl:grid"
                            style={{
                              gridTemplateColumns: `repeat(${menuColumnCount(
                                menuItem.items.length
                              )}, minmax(0, 1fr))`,
                            }}
                          >
                            {menuItem.items.map((item) => (
                              <li key={item.id}>
                                <Link
                                  href={item.path}
                                  onClick={() => setNavigationOpen(false)}
                                  className="block rounded px-3 py-2 text-sm font-medium uppercase text-dark hover:bg-gray-1 hover:text-blue"
                                >
                                  {item.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={menuItem.path || "/"}
                      onClick={() => setNavigationOpen(false)}
                      className="flex py-2 text-custom-sm font-medium text-dark hover:text-blue xl:py-0"
                    >
                      {menuItem.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex w-[132px] items-center justify-end transition-all duration-300 xsm:w-[150px] sm:w-[220px] lg:w-[320px]"
            >
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => {
                  setTimeout(() => setSearchFocused(false), 140);
                }}
                type="search"
                name="search"
                aria-label="Buscar produtos"
                placeholder="Buscar produtos"
                className="h-11 w-full rounded-md border border-gray-3 bg-gray-1 pl-4 pr-11 text-sm text-dark outline-none transition-all duration-300 placeholder:text-dark-4 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-md text-dark transition-colors duration-200 hover:bg-gray-2 hover:text-blue"
              >
                <svg className="fill-current" width="19" height="19" viewBox="0 0 18 18">
                  <path d="M17.27 15.67 12.63 11.9a6.72 6.72 0 1 0-.84.96l4.69 3.8a.64.64 0 0 0 .88-.08.64.64 0 0 0-.09-.91ZM7.2 13.39a5.46 5.46 0 1 1 0-10.92 5.46 5.46 0 0 1 0 10.92Z" />
                </svg>
              </button>
              {searchFocused && searchSuggestions.length > 0 && (
                <div className="absolute right-0 top-full z-50 mt-1 w-[min(420px,calc(100vw-24px))] overflow-hidden rounded-md border border-gray-3 bg-white py-2 shadow-lg">
                  {searchSuggestions.map((suggestion) => (
                    <Link
                      key={suggestion.id}
                      href={suggestion.path}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setSearchQuery("");
                        setSearchFocused(false);
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
              className="flex h-11 items-center gap-2 rounded-md border border-gray-3 bg-white px-3 text-dark transition-colors duration-200 hover:border-blue hover:text-blue"
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
              className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-3 xl:hidden"
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
