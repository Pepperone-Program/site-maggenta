"use client";

import { ReactNode, Suspense, useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
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

const ROUTE_STORAGE_KEY = "pepperone:last-internal-route";
const ROUTE_CURRENT_KEY = "pepperone:current-internal-route";

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

const ClientShell = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <MarketingPixels />
      <ClarityInit />
      <Script
        async
        src="https://integrazap.com.br/gadget-v.1/wapp-flutuante.js?x=396a64b52d20d34d1e7ba4a95a975231&y=349273426667&z=pepperone.com.br"
        strategy="afterInteractive"
      />
      <Analytics/>
      <ReduxProvider>
        <CartModalProvider>
          <PreviewSliderProvider>
            <Suspense fallback={null}>
              <RouteHistoryTracker />
            </Suspense>
            <Header />
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
      <ScrollToTop />
      <Footer />
    </>
  );
};

export default ClientShell;
