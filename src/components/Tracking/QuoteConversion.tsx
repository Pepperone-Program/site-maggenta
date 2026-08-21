"use client";

import { useEffect } from "react";
import {
  quoteConversionStorageKey,
} from "@/lib/google-tags";
import { sendQuoteConversion, type QuoteConversionData } from "@/lib/google-ads-conversion";

const readConversionCustomer = (): QuoteConversionData | null => {
  try {
    const stored = sessionStorage.getItem(quoteConversionStorageKey);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as QuoteConversionData;
  } catch {
    return null;
  }
};

const QuoteConversion = () => {
  useEffect(() => {
    const customer = readConversionCustomer();

    if (!customer) {
      return;
    }

    if (sendQuoteConversion(customer)) {
      try {
        sessionStorage.removeItem(quoteConversionStorageKey);
      } catch {
        // O evento já foi enfileirado; falhas de storage não devem repeti-lo aqui.
      }
    }
  }, []);

  return null;
};

export default QuoteConversion;
