const publicEnv = (value: string | undefined, fallback = "") =>
  value?.trim() || fallback;

export const googleTagManagerId = publicEnv(process.env.NEXT_PUBLIC_GTM_ID);

export const googleAnalyticsId = publicEnv(
  process.env.NEXT_PUBLIC_GA4_ID,
  "G-EVYDJZ7M1P"
);
export const universalAnalyticsId = publicEnv(
  process.env.NEXT_PUBLIC_UA_ID,
  "UA-37937142-1"
);
export const googleAdsId = publicEnv(
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  "AW-928315079"
);
export const googleAdsConversionLabel =
  publicEnv(process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL);
export const bingUetId = publicEnv(
  process.env.NEXT_PUBLIC_BING_UET_ID,
  "187200970"
);
export const rdStationAccountId = publicEnv(
  process.env.NEXT_PUBLIC_RD_STATION_ACCOUNT_ID,
  "1138671"
);
export const cloudflareBeaconToken = publicEnv(
  process.env.NEXT_PUBLIC_CLOUDFLARE_BEACON_TOKEN
);
export const quoteConversionStorageKey = "maggenta:quote-conversion";
