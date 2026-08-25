"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import {
  bingUetId,
  cloudflareBeaconToken,
  googleAdsId,
  googleAnalyticsId,
  rdStationAccountId,
  universalAnalyticsId,
} from "@/lib/google-tags";

const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const integrazapSrc =
  "https://integrazap.com.br/gadget-v.1/wapp-flutuante.js?x=019d7ce4c9075179faf49505675e4494&y=349319781679&z=maggenta.com.br";

type MarketingWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  ga?: (...args: unknown[]) => void;
  uetq?: unknown[];
};

const useMarketingPageViews = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasSkippedInitialPageView = useRef(false);

  useEffect(() => {
    if (!hasSkippedInitialPageView.current) {
      hasSkippedInitialPageView.current = true;
      return;
    }

    const marketingWindow = window as MarketingWindow;
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    marketingWindow.gtag?.("config", googleAnalyticsId, { page_path: pagePath });
    marketingWindow.gtag?.("config", universalAnalyticsId, { page_path: pagePath });
    marketingWindow.gtag?.("config", googleAdsId, { page_path: pagePath });

    marketingWindow.ga?.("set", "page", pagePath);
    marketingWindow.ga?.("send", "pageview");

    marketingWindow.uetq = marketingWindow.uetq || [];
    marketingWindow.uetq.push("event", "page_view", { page_path: pagePath });
  }, [pathname, searchParams]);
};

const MarketingPixels = () => {
  useMarketingPageViews();
  const [canLoadIntegrazap, setCanLoadIntegrazap] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase();
    setCanLoadIntegrazap(
      hostname === "maggenta.com.br" || hostname === "www.maggenta.com.br"
    );
  }, []);

  return (
    <>
      <Script
        id="google-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
            gtag('config', '${universalAnalyticsId}');
            gtag('config', '${googleAdsId}');
          `,
        }}
      />
      <Script
        id="universal-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
            ga('create', '${universalAnalyticsId}', 'auto');
            ga('send', 'pageview');
          `,
        }}
      />
      <Script
        id="bing-uet"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){
            var o={ti:"${bingUetId}", enableAutoSpaTracking: true};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},
            n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){
            var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},
            i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})
            (window,document,"script","//bat.bing.com/bat.js","uetq");
          `,
        }}
      />
      <Script
        id="rdstation-tracker"
        src={`https://www.rdstation.com.br/api/1.3/conversions.js?account_id=${rdStationAccountId}`}
        strategy="lazyOnload"
      />
      <Script
        id="rdstation-popup"
        src={`https://popups.rdstation.com.br/accounts/${rdStationAccountId}/popups.js`}
        strategy="lazyOnload"
      />
      {canLoadIntegrazap && (
        <Script id="integrazap-floating-widget" src={integrazapSrc} strategy="lazyOnload" />
      )}
      {cloudflareBeaconToken && (
        <Script
          id="cloudflare-insights"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="lazyOnload"
          data-cf-beacon={JSON.stringify({ token: cloudflareBeaconToken })}
        />
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
