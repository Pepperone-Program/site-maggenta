"use client";

import { ReactNode } from "react";
import Script from "next/script";
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
import WhatsAppButton from "@/components/Common/WhatsAppButton";
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner";

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
      <WhatsAppButton />
      <Footer />
    </>
  );
};

export default ClientShell;
