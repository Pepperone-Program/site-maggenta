type TrackParams = Record<string, string | number | boolean | null | undefined>;

type TrackingWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

export type AttributionParams = Partial<Record<(typeof attributionKeys)[number], string>>;

export const trackEvent = (eventName: string, params: TrackParams = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  const trackingWindow = window as TrackingWindow;
  const eventPayload = {
    event: eventName,
    ...params,
  };

  if (!trackingWindow.dataLayer) {
    trackingWindow.dataLayer = [];
  }

  trackingWindow.dataLayer.push(eventPayload);

  if (typeof trackingWindow.gtag === "function") {
    trackingWindow.gtag("event", eventName, params);
  }

  if (typeof trackingWindow.fbq === "function") {
    trackingWindow.fbq("trackCustom", eventName, params);

    if (eventName === "lead_submit") {
      trackingWindow.fbq("track", "Lead");
    }
  }
};

export const readAttributionParams = (searchParams: { get: (key: string) => string | null }): AttributionParams => {
  const attribution: AttributionParams = {};

  for (const key of attributionKeys) {
    const value = searchParams.get(key);

    if (value) {
      attribution[key] = value;
    }
  }

  return attribution;
};

export const persistAttribution = (attribution: AttributionParams) => {
  if (typeof window === "undefined") {
    return;
  }

  const hasAttribution = Object.values(attribution).some(Boolean);

  if (!hasAttribution) {
    return;
  }

  window.localStorage.setItem("pepperone_attribution", JSON.stringify(attribution));
};

export const getPersistedAttribution = (): AttributionParams => {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem("pepperone_attribution");

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as AttributionParams;
    return parsed || {};
  } catch {
    return {};
  }
};

export const attributionToObsSuffix = (attribution: AttributionParams) => {
  const entries = Object.entries(attribution).filter(([, value]) => Boolean(value));

  if (entries.length === 0) {
    return "";
  }

  const serialized = entries
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");

  return `\n\n[Atribuicao]\n${serialized}`;
};
