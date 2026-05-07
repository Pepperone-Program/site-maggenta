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

const ClientShell = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ClarityInit />
      <ReduxProvider>
        <CartModalProvider>
          <PreviewSliderProvider>
            <Header />
            {children}
            <CartSidebarModal />
            <PreviewSliderModal />
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
