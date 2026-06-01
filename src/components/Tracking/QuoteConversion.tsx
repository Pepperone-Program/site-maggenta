"use client";

import { useEffect } from "react";
import {
  googleAdsConversionLabel,
  googleAdsId,
  quoteConversionStorageKey,
} from "@/lib/google-tags";

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

type ConversionCustomer = {
  email?: string;
  phone_number?: string;
};

const readConversionCustomer = (): ConversionCustomer | null => {
  try {
    const stored = sessionStorage.getItem(quoteConversionStorageKey);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as ConversionCustomer;
  } catch {
    return null;
  }
};

const QuoteConversion = () => {
  useEffect(() => {
    const conversionWindow = window as GtagWindow;

    if (typeof conversionWindow.gtag !== "function") {
      conversionWindow.dataLayer = conversionWindow.dataLayer || [];
      conversionWindow.gtag = (...args: unknown[]) => {
        conversionWindow.dataLayer?.push(args);
      };
    }

    const customer = readConversionCustomer();

    if (!customer) {
      return;
    }

    const email = customer.email?.trim();
    const phoneNumber = customer.phone_number?.replace(/[^\d+]/g, "");

    if (email || phoneNumber) {
      conversionWindow.gtag("set", "user_data", {
        ...(email ? { email } : {}),
        ...(phoneNumber ? { phone_number: phoneNumber } : {}),
      });
    }

    conversionWindow.gtag("event", "conversion", {
      send_to: `${googleAdsId}/${googleAdsConversionLabel}`,
      value: 1.0,
      currency: "BRL",
    });

    sessionStorage.removeItem(quoteConversionStorageKey);
  }, []);

  return null;
};

export default QuoteConversion;
