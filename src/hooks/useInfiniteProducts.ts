"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/types/product";

type InfiniteResponse = {
  items?: Product[];
  page?: number;
  totalPages?: number;
  total?: number;
};

export function useInfiniteProducts({
  initialItems,
  initialPage,
  totalPages,
  total,
  endpoint,
  pagesPerLoad = 1,
}: {
  initialItems: Product[];
  initialPage: number;
  totalPages: number;
  total: number;
  endpoint?: string;
  pagesPerLoad?: number;
}) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialPage);
  const [pageCount, setPageCount] = useState(totalPages);
  const [itemCount, setItemCount] = useState(total);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => () => requestRef.current?.abort(), []);

  useEffect(() => {
    requestRef.current?.abort();
    loadingRef.current = false;
    setItems(initialItems);
    setPage(initialPage);
    setPageCount(totalPages);
    setItemCount(total);
    setLoading(false);
    setError(false);
  }, [endpoint, initialItems, initialPage, total, totalPages]);

  const loadNext = useCallback(async () => {
    if (!endpoint || loadingRef.current || page >= pageCount) return;

    loadingRef.current = true;
    setLoading(true);
    setError(false);
    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const lastRequestedPage = Math.min(page + Math.max(1, pagesPerLoad), pageCount);
      const pages = Array.from(
        { length: lastRequestedPage - page },
        (_, index) => page + index + 1
      );
      const responses = await Promise.all(
        pages.map(async (nextPage) => {
          const url = new URL(endpoint, window.location.origin);
          url.searchParams.set("page", String(nextPage));
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) throw new Error("Falha ao carregar produtos");
          return (await response.json()) as InfiniteResponse;
        })
      );
      const nextItems = responses.flatMap((data) => data.items || []);
      const lastResponse = responses.at(-1);

      setItems((current) => [...current, ...nextItems]);
      setPage(Number(lastResponse?.page || lastRequestedPage));
      setPageCount(Number(lastResponse?.totalPages ?? pageCount));
      setItemCount(Number(lastResponse?.total ?? itemCount));
    } catch (caught) {
      if (!(caught instanceof DOMException && caught.name === "AbortError")) setError(true);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [endpoint, itemCount, page, pageCount, pagesPerLoad]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !endpoint || page >= pageCount) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && void loadNext(),
      { rootMargin: "800px 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [endpoint, loadNext, page, pageCount]);

  return {
    items,
    total: itemCount,
    page,
    totalPages: pageCount,
    loading,
    error,
    hasMore: page < pageCount,
    loadNext,
    sentinelRef,
  };
}
