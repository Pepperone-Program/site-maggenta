"use client";

import Script from "next/script";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

const MarketingPixels = () => {
  const hasGoogleTags = Boolean(gtmId || ga4Id || googleAdsId);

  return (
    <>
      {gtmId && (
        <>
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
          />
          <Script
            id="gtm-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || []; window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });`,
            }}
          />
        </>
      )}

      {hasGoogleTags && (
        <>
          <Script
            id="gtag-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id || googleAdsId || gtmId}`}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                window.gtag = gtag;
                gtag('js', new Date());
                ${ga4Id ? `gtag('config', '${ga4Id}');` : ""}
                ${googleAdsId ? `gtag('config', '${googleAdsId}');` : ""}
              `,
            }}
          />
        </>
      )}

      {metaPixelId && (
        <>
          <Script
            id="meta-pixel-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${metaPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  );
};

export default MarketingPixels;
