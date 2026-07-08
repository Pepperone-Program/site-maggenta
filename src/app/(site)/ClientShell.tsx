"use client";

import { ReactNode, Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Header, { type HeaderMenuGroup } from "../../components/Header";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import ClarityInit from "@/components/Common/ClarityInit";
import MarketingPixels from "@/components/Common/MarketingPixels";
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ROUTE_STORAGE_KEY = "maggenta:last-internal-route";
const ROUTE_CURRENT_KEY = "maggenta:current-internal-route";

const RouteHistoryTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const currentRoute = query ? `${pathname}?${query}` : pathname;
    const previousRoute = sessionStorage.getItem(ROUTE_CURRENT_KEY);

    if (previousRoute && previousRoute !== currentRoute) {
      sessionStorage.setItem(ROUTE_STORAGE_KEY, previousRoute);
    }

    sessionStorage.setItem(ROUTE_CURRENT_KEY, currentRoute);
  }, [pathname, searchParams]);

  return null;
};

const ClientShell = ({
  children,
  initialMenuGroups,
}: {
  children: ReactNode;
  initialMenuGroups?: HeaderMenuGroup[];
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 60 * 1000,
            gcTime: 60 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <>
      <Suspense fallback={null}>
        <MarketingPixels />
      </Suspense>
      <ClarityInit />
      <Analytics/>
      <QueryClientProvider client={queryClient}>
        <ReduxProvider>
          <CartModalProvider>
            <PreviewSliderProvider>
            <Suspense fallback={null}>
              <RouteHistoryTracker />
            </Suspense>
            <Header initialMenuGroups={initialMenuGroups} />
            {children}
            <CartSidebarModal />
            <PreviewSliderModal />
            <Toaster
              richColors
              closeButton
              position="bottom-right"
              toastOptions={{
                style: {
                  zIndex: 2147483647,
                },
              }}
            />
            </PreviewSliderProvider>
          </CartModalProvider>
        </ReduxProvider>
      </QueryClientProvider>
      <ScrollToTop />
    </>
  );
};

export default ClientShell;
