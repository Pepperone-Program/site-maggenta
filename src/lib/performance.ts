// Performance optimization strategies for Pepperone

import React from "react";

/**
 * OTIMIZAÇÕES IMPLEMENTADAS:
 * 
 * 1. IMAGE OPTIMIZATION
 *    - Usar Next.js Image com sizes adequados para responsive
 *    - Implementar blur placeholders
 *    - Lazy load imagens fora da viewport
 * 
 * 2. COMPONENT OPTIMIZATION
 *    - React.memo para componentes puros
 *    - useMemo para cálculos pesados
 *    - useCallback para manter referência de funções
 * 
 * 3. API & CACHING
 *    - ISR (Incremental Static Regeneration) com revalidate = 60
 *    - Cache responses com Cache-Control headers
 *    - SWR para dados em tempo real (search)
 * 
 * 4. EVENT LISTENERS
 *    - Debounce scroll events
 *    - Throttle window resize
 *    - Cleanup listeners no unmount
 * 
 * 5. CODE SPLITTING
 *    - Dynamic imports para componentes pesados
 *    - Next/dynamic com loading states
 * 
 * 6. DATABASE OPTIMIZATION
 *    - Adicionar índices nas principais queries
 *    - Usar pagination para grandes datasets
 *    - Limitar campos retornados
 */

// Debounce hook para eventos frequentes
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook para eventos de scroll/resize
export function useThrottle<T>(value: T, interval: number = 100): T {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastRanRef = React.useRef(Date.now());

  React.useEffect(() => {
    const now = Date.now();
    if (now >= lastRanRef.current + interval) {
      lastRanRef.current = now;
      setThrottledValue(value);
    } else {
      const handler = setTimeout(() => {
        lastRanRef.current = Date.now();
        setThrottledValue(value);
      }, interval);

      return () => clearTimeout(handler);
    }
  }, [value, interval]);

  return throttledValue;
}

// Intersection Observer para lazy loading
export function useIntersectionObserver(ref: React.RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isVisible;
}

// Cache strategy para requests
export function getOptimalCacheHeaders(type: 'static' | 'dynamic' | 'search') {
  if (type === 'static') {
    return {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    };
  } else if (type === 'dynamic') {
    return {
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
    };
  } else {
    return {
      'Cache-Control': 'private, max-age=30, must-revalidate',
    };
  }
}

export default {
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  getOptimalCacheHeaders,
};
