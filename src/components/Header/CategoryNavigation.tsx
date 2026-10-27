"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchWithTimeout } from "@/lib/timed-fetch";
import type { HeaderMenuGroup, HeaderMenuItem } from "@/types/header-menu";
import styles from "./CategoryNavigation.module.css";

function CategoryImage({ item, large = false }: { item: HeaderMenuItem; large?: boolean }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return <span className={large ? styles.largeImage : styles.image} aria-hidden="true">
    {item.image && failedSource !== item.image ? <img src={item.image} alt="" decoding="async" onError={() => setFailedSource(item.image!)} /> :
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m3 7 9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4M12 11v10M7 5l10 4" /></svg>}
  </span>;
}

function Subcategories({ category, close }: { category: HeaderMenuItem; close: () => void }) {
  const query = useQuery<HeaderMenuItem[]>({
    queryKey: ["menu-subcategories", category.id],
    queryFn: async ({ signal }) => {
      const response = await fetchWithTimeout(`/api/menu/categories/${encodeURIComponent(category.id)}`, { signal });
      if (!response.ok) throw new Error("Subcategorias indisponíveis");
      const payload = await response.json();
      if (!Array.isArray(payload.data)) throw new Error("Resposta inválida");
      return payload.data;
    },
    staleTime: 10 * 60 * 1000, gcTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000, retry: false,
  });
  return <div className={styles.categoryContent}>
    <div className={styles.categoryLinks}>
      <Link href={category.path} onClick={close} className={styles.title}>{category.title}</Link>
      {query.isPending ? <p role="status" className={styles.status}>Carregando subcategorias…</p> : query.isError ?
        <p role="status" className={styles.status}>Não foi possível carregar as subcategorias. <button type="button" onClick={() => query.refetch()}>Tentar novamente</button></p> :
        query.data.length ? <ul className={styles.subcategories}>{query.data.map((item) => <li key={item.id}><Link href={item.path} onClick={close}>{item.title}</Link></li>)}</ul> :
          <p className={styles.status}>Explore todos os produtos desta categoria.</p>}
      <Link className={styles.viewAll} href={category.path} onClick={close}>Ver todos os produtos <span aria-hidden="true">→</span></Link>
    </div>
    <Link href={category.path} onClick={close} className={styles.visual} aria-label={`Ver ${category.title}`}><CategoryImage item={category} large /></Link>
  </div>;
}

export default function CategoryNavigation({ groups, mobileOpen, onClose, menuError, retryMenu }: {
  groups: HeaderMenuGroup[]; mobileOpen: boolean; onClose: () => void;
  menuError: boolean; retryMenu: () => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const categories = [...(groups.find((item) => item.id === "categorias")?.items || [])].sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
  const featured = categories.filter((item) => item.featuredOrder !== undefined).sort((a, b) => a.featuredOrder! - b.featuredOrder!).slice(0, 5);
  const extras = ["brindes", "publicos", "datas", "lancamentos"].map((id) => groups.find((item) => item.id === id)).filter((item): item is HeaderMenuGroup => Boolean(item));
  const category = categories.find((item) => `category-${item.id}` === active);
  const extra = extras.find((item) => `group-${item.id}` === active);
  const cancel = () => { if (timer.current) clearTimeout(timer.current); };
  const close = () => { cancel(); setActive(null); onClose(); };
  const open = (id: string, element?: HTMLElement) => { cancel(); if (element) trigger.current = element; setActive(id); };
  const toggle = (id: string, element: HTMLElement) => { cancel(); trigger.current = element; setActive((current) => current === id ? null : id); };
  useEffect(() => { setActive(null); }, [pathname, mobileOpen]);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!root.current?.contains(target) && !target.closest('[aria-controls="category-navigation"]')) { setActive(null); onClose(); }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { cancel(); setActive(null); onClose();
        const mobileTrigger = Array.from(document.querySelectorAll<HTMLElement>('[aria-controls="category-navigation"]')).find((element) => element.offsetParent !== null);
        (mobileOpen ? mobileTrigger : trigger.current)?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [onClose, mobileOpen]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const hover = (id: string, element: HTMLElement) => {
    if (window.matchMedia("(min-width: 1200px) and (hover: hover)").matches) open(id, element);
  };
  return <nav id="category-navigation" ref={root} aria-label="Categorias de produtos" className={`${styles.navigation} ${mobileOpen ? styles.mobileOpen : ""}`}
    onMouseEnter={cancel} onMouseLeave={() => {
      cancel();
      if (window.matchMedia("(min-width: 1200px) and (hover: hover)").matches && !root.current?.contains(document.activeElement)) timer.current = setTimeout(() => setActive(null), 180);
    }}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) { cancel(); setActive(null); } }}>
    <div className={styles.bar}>
      <button className={styles.allTrigger} type="button" aria-expanded={active === "all"} aria-controls="category-panel"
        onMouseEnter={(event) => hover("all", event.currentTarget)} onClick={(event) => open("all", event.currentTarget)}>
        <span aria-hidden="true">☰</span> Veja todas as categorias
      </button>
      {featured.map((item) => <div className={styles.featured} key={item.id} onMouseEnter={(event) => hover(`category-${item.id}`, event.currentTarget.querySelector("button")!)}>
        <Link href={item.path} onClick={close}><CategoryImage item={item} /><span>{item.title}</span></Link>
        <button type="button" aria-label={`Abrir subcategorias de ${item.title}`} aria-expanded={active === `category-${item.id}`} aria-controls="category-panel" onClick={(event) => toggle(`category-${item.id}`, event.currentTarget)}>⌄</button>
      </div>)}
      <Link className={styles.launches} href="/lancamentos" onMouseEnter={() => { cancel(); setActive(null); }} onClick={close}>Lançamentos</Link>
    </div>
    {(active || mobileOpen) && <div id="category-panel" className={styles.panel}>
      {category ? <><button type="button" className={styles.back} onClick={() => open("all")}>← Todas as categorias</button><Subcategories key={category.id} category={category} close={close} /></> : extra ?
        <div><button type="button" className={styles.back} onClick={() => open("all")}>← Todas as categorias</button><h2 className={styles.title}>{extra.title}</h2><ul className={styles.subcategories}>{extra.items?.map((item) => <li key={item.id}><Link href={item.path} onClick={close}>{item.title}</Link></li>)}</ul></div> :
        <div className={styles.allContent}>
          <div>{categories.length ? <ul className={styles.categories}>{categories.map((item) => <li key={item.id}>
            <Link href={item.path} onClick={close}><CategoryImage item={item} /><span>{item.title}</span></Link>
            <button type="button" aria-label={`Abrir subcategorias de ${item.title}`} onClick={() => open(`category-${item.id}`)}>›</button>
          </li>)}</ul> : <p role="status" className={styles.status}>{menuError ? <>Não foi possível carregar as categorias. <button type="button" onClick={retryMenu}>Tentar novamente</button></> : "Carregando categorias…"}</p>}</div>
          <aside className={styles.explore}><h2>Explore também</h2>{extras.map((item) => item.path ?
            <Link key={item.id} href={item.path} onClick={close}><span aria-hidden="true">↗</span>{item.title}</Link> :
            <button key={item.id} type="button" onClick={() => open(`group-${item.id}`)}><span aria-hidden="true">＋</span>{item.title}</button>)}</aside>
        </div>}
    </div>}
  </nav>;
}
