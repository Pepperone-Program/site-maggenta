import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { getLandingPageByPath } from "@/lib/api";
import {
  brandOpenGraphImages,
  buildSeoOther,
  siteName,
  siteUrl,
  uniqueSeoKeywords,
} from "@/lib/seo";

export const revalidate = 300;

type PageProps = { params: Promise<{ path: string[] }> };

const keywordsFromText = (keywords: string) =>
  uniqueSeoKeywords(
    keywords
      .split(/[,;\n]/)
      .map((keyword) => keyword.trim())
      .filter(Boolean)
  );

const requestedPathFromParams = async (params: PageProps["params"]) => {
  const { path = [] } = await params;
  return `/${path.join("/")}`;
};

const findLandingPage = cache((requestedPath: string) =>
  getLandingPageByPath(requestedPath)
);

const resolveLandingPage = async (params: PageProps["params"]) => {
  const requestedPath = await requestedPathFromParams(params);
  return findLandingPage(requestedPath);
};

const safeLandingPageUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const landingPage = await resolveLandingPage(params);
  if (!landingPage) return { robots: { index: false, follow: false } };

  const description =
    landingPage.description ||
    `Conheça ${landingPage.title} na Maggenta e solicite um orçamento personalizado para sua empresa.`;
  const canonical = new URL(landingPage.path, siteUrl).toString();
  const keywords = keywordsFromText(landingPage.keywords);
  const title = /maggenta/i.test(landingPage.title)
    ? landingPage.title
    : `${landingPage.title} | Maggenta Brindes`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName,
      locale: "pt_BR",
      images: brandOpenGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: brandOpenGraphImages.map((image) => image.url),
    },
    other: buildSeoOther({
      title,
      description,
      canonical,
      subject: keywords.join(", "),
    }),
  };
}

export default async function LandingPage({ params }: PageProps) {
  const requestedPath = await requestedPathFromParams(params);
  const landingPage = await findLandingPage(requestedPath);

  if (!landingPage) notFound();
  if (requestedPath !== landingPage.path) permanentRedirect(landingPage.path);

  const targetUrl = safeLandingPageUrl(landingPage.url);
  if (!targetUrl) notFound();

  return (
    <main style={{ width: "100%", height: "100dvh", overflow: "hidden" }}>
      <iframe
        src={targetUrl}
        title={landingPage.title}
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
        allow="clipboard-write"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          border: 0,
          background: "#ffffff",
        }}
      />
      <noscript>
        <p>
          Esta campanha precisa de JavaScript. Acesse a{" "}
          <a href={targetUrl}>landing page completa</a>.
        </p>
      </noscript>
    </main>
  );
}
