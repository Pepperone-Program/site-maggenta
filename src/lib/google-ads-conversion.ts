import { googleAdsConversionLabel, googleAdsId, googleAnalyticsId } from "@/lib/google-tags";

type ConversionWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

export type QuoteConversionData = {
  email?: string;
  phone_number?: string;
  transaction_id?: string;
  value?: number;
};

const normalizeBrazilianPhone = (value?: string) => {
  const digits = String(value || "").replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return digits.startsWith("55") ? `+${digits}` : `+55${digits}`;
};

export const sendQuoteConversion = (data: QuoteConversionData) => {
  if (
    typeof window === "undefined" ||
    !googleAdsId.startsWith("AW-") ||
    !googleAdsConversionLabel
  ) {
    return false;
  }

  const conversionWindow = window as ConversionWindow;
  conversionWindow.dataLayer = conversionWindow.dataLayer || [];
  conversionWindow.gtag =
    conversionWindow.gtag ||
    ((...args: unknown[]) => {
      conversionWindow.dataLayer?.push(args);
    });

  const email = data.email?.trim().toLocaleLowerCase("pt-BR");
  const phoneNumber = normalizeBrazilianPhone(data.phone_number);
  const transactionId = data.transaction_id?.trim();
  const conversionValue = Number(data.value);

  if (email || phoneNumber) {
    conversionWindow.gtag("set", "user_data", {
      ...(email ? { email } : {}),
      ...(phoneNumber ? { phone_number: phoneNumber } : {}),
    });
  }

  conversionWindow.gtag("event", "conversion", {
    send_to: `${googleAdsId}/${googleAdsConversionLabel}`,
    value: Number.isFinite(conversionValue) && conversionValue > 0 ? conversionValue : 1,
    currency: "BRL",
    ...(transactionId ? { transaction_id: transactionId } : {}),
  });

  const leadKey = transactionId ? `maggenta:ga4-lead:${transactionId}` : "";
  let shouldSendLead = true;
  if (leadKey) {
    try {
      shouldSendLead = sessionStorage.getItem(leadKey) !== "sent";
      if (shouldSendLead) sessionStorage.setItem(leadKey, "sent");
    } catch {
      // A medição não pode impedir o fluxo de orçamento.
    }
  }

  if (shouldSendLead) {
    conversionWindow.gtag("event", "generate_lead", {
      send_to: googleAnalyticsId,
      value: Number.isFinite(conversionValue) && conversionValue > 0 ? conversionValue : 1,
      currency: "BRL",
      ...(transactionId ? { transaction_id: transactionId } : {}),
    });
  }

  return true;
};
