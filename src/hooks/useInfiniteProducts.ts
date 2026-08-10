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
}: {
  initialItems: Product[];
  initialPage: number;
  totalPages: number;
  total: number;
  endpoint?: string;
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
      const url = new URL(endpoint, window.location.origin);
      url.searchParams.set("page", String(page + 1));
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error("Falha ao carregar produtos");
      const data = (await response.json()) as InfiniteResponse;
      const nextItems = data.items || [];

      setItems((current) => {
        const ids = new Set(current.map((item) => String(item.id)));
        return [...current, ...nextItems.filter((item) => !ids.has(String(item.id)))];
      });
      setPage(Number(data.page || page + 1));
      setPageCount(Number(data.totalPages ?? pageCount));
      setItemCount(Number(data.total ?? itemCount));
    } catch (caught) {
      if (!(caught instanceof DOMException && caught.name === "AbortError")) setError(true);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [endpoint, itemCount, page, pageCount]);

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

  return { items, total: itemCount, loading, error, hasMore: page < pageCount, loadNext, sentinelRef };
}
