"use client";

import { ReactNode } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import ClarityInit from "@/components/Common/ClarityInit";
import WhatsAppButton from "@/components/Common/WhatsAppButton";
import MarketingPixels from "@/components/Common/MarketingPixels";
import { Toaster } from "sonner";

const ClientShell = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <MarketingPixels />
      <ClarityInit />
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
