import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Hook para prefetch automático de links quando eles ficam visíveis
 * Melhora a performance de navegação através de Intersection Observer
 */
export function useLinkPrefetch() {
  const router = useRouter();

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const href = (entry.target as HTMLAnchorElement).getAttribute("href");
          if (href && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
            // Prefetch links que ficam visíveis
            router.prefetch(href);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "50px",
      threshold: 0.1,
    });

    // Observar todos os links na página
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => observer.observe(link));

    return () => {
      links.forEach((link) => observer.unobserve(link));
    };
  }, [router]);
}

export default useLinkPrefetch;
