"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithTimeout } from "@/lib/timed-fetch";
import type { HeaderMenuGroup } from "@/types/header-menu";

const CACHE_TIME = 10 * 60 * 1000;
const FULL_KEY = "maggenta:header-menu:v5";
const CATEGORIES_KEY = "maggenta:header-categories:v5";
const hasCategories = (groups?: HeaderMenuGroup[]) =>
  Boolean(groups?.find((group) => group.id === "categorias")?.items?.length);

const localPath = (value: unknown) => typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
function validMenu(value: unknown): value is HeaderMenuGroup[] {
  return Array.isArray(value) && value.every((group) =>
    group && typeof group.id === "string" && typeof group.title === "string" &&
    (group.path === undefined || localPath(group.path)) &&
    (group.items === undefined || (Array.isArray(group.items) && group.items.every((item) =>
      item && typeof item.id === "string" && typeof item.title === "string" && localPath(item.path)
    )))
  ) && hasCategories(value);
}

async function fetchMenu(key: string, signal: AbortSignal): Promise<HeaderMenuGroup[]> {
  const url = key === CATEGORIES_KEY ? "/api/menu?section=categories" : "/api/menu";
  const response = await fetchWithTimeout(url, { signal, cache: "no-store" }, 12000);
  if (!response.ok) throw new Error("Menu temporariamente indisponível.");
  const payload = await response.json();
  if (!validMenu(payload.data)) throw new Error("Menu inválido.");
  try {
    sessionStorage.setItem(key, JSON.stringify({ data: payload.data, updatedAt: Date.now() }));
  } catch { /* Navigation also works with storage disabled. */ }
  return payload.data;
}

export function useHeaderMenu(fallback: HeaderMenuGroup[]) {
  const client = useQueryClient();
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    for (const key of [FULL_KEY, CATEGORIES_KEY]) {
      try {
        const saved = JSON.parse(sessionStorage.getItem(key) || "null");
        const age = Date.now() - saved?.updatedAt;
        if (age >= 0 && age < CACHE_TIME && validMenu(saved?.data)) {
          const current = client.getQueryState([key]);
          if (!current?.data || current.dataUpdatedAt < saved.updatedAt) {
            client.setQueryData([key], saved.data, { updatedAt: saved.updatedAt });
          }
        }
      } catch { /* Ignore unavailable storage and malformed snapshots. */ }
    }
    setRestored(true);
  }, [client]);

  const full = useQuery({
    queryKey: [FULL_KEY], queryFn: ({ signal }) => fetchMenu(FULL_KEY, signal),
    initialData: hasCategories(fallback) ? fallback : undefined,
    enabled: restored, staleTime: CACHE_TIME, gcTime: CACHE_TIME,
    refetchInterval: CACHE_TIME,
    refetchOnWindowFocus: true, retry: 1,
  });
  const categories = useQuery({
    queryKey: [CATEGORIES_KEY], queryFn: ({ signal }) => fetchMenu(CATEGORIES_KEY, signal),
    enabled: restored && !hasCategories(full.data),
    staleTime: CACHE_TIME, gcTime: CACHE_TIME, retry: 1,
    refetchInterval: CACHE_TIME,
  });

  // Ranking and secondary groups enrich the fast category list when available.
  const groups = full.data || (categories.data ? [
    ...fallback.filter((group) => group.id !== "categorias"), ...categories.data,
  ] : fallback);
  return {
    groups,
    isError: !hasCategories(groups) && full.isError && categories.isError,
    retry: () => { void full.refetch(); void categories.refetch(); },
  };
}
