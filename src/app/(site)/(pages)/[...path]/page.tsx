import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
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
    keywords.split(/[,;\n]/).map((keyword) => keyword.trim()).filter(Boolean)
  );

const resolveLandingPage = async (params: PageProps["params"]) => {
  const { path = [] } = await params;
  return getLandingPageByPath(path.join("/"));
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const landingPage = await resolveLandingPage(params);
  if (!landingPage) return { robots: { index: false, follow: false } };

  const description =
    landingPage.description ||
    `Conheça ${landingPage.title} na Maggenta e solicite um orçamento personalizado para sua empresa.`;
  const canonical = new URL(landingPage.path, siteUrl).toString();
  const keywords = keywordsFromText(landingPage.keywords);

  return {
    title: landingPage.title,
    description,
    keywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: landingPage.title,
      description,
      type: "website",
      url: canonical,
      siteName,
      locale: "pt_BR",
      images: brandOpenGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title: landingPage.title,
      description,
      images: brandOpenGraphImages.map((image) => image.url),
    },
    other: buildSeoOther({
      title: landingPage.title,
      description,
      canonical,
      subject: keywords.join(", "),
    }),
  };
}

export default async function LandingPage({ params }: PageProps) {
  const { path = [] } = await params;
  const requestedPath = `/${path.join("/")}`;
  const landingPage = await getLandingPageByPath(requestedPath);

  if (!landingPage) notFound();
  if (requestedPath !== landingPage.path) permanentRedirect(landingPage.path);

  const description =
    landingPage.description ||
    `Encontre ${landingPage.title.toLocaleLowerCase("pt-BR")} para ações, eventos e campanhas da sua empresa.`;
  const keywords = keywordsFromText(landingPage.keywords).slice(0, 8);

  return (
    <main>
      <section className="overflow-hidden bg-gradient-to-br from-[#f7f8fc] via-white to-[#eef3ff] py-16 sm:py-24 lg:py-32">
        <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] lg:px-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-blue">Maggenta Brindes Corporativos</span>
            <h1 className="mt-5 max-w-[850px] text-4xl font-semibold leading-tight text-dark sm:text-5xl lg:text-6xl">{landingPage.title}</h1>
            <p className="mt-6 max-w-[760px] text-lg leading-8 text-dark-4">{description}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/brindes-para-empresas" className="inline-flex justify-center rounded-md bg-blue px-7 py-3.5 font-medium text-white duration-200 hover:bg-blue-dark">Ver produtos</Link>
              <Link href="/orcamentos" className="inline-flex justify-center rounded-md border border-blue px-7 py-3.5 font-medium text-blue duration-200 hover:bg-blue hover:text-white">Solicitar orçamento</Link>
            </div>
          </div>
          <aside className="rounded-2xl border border-gray-3 bg-white p-6 shadow-1 sm:p-8">
            <h2 className="text-xl font-semibold text-dark">Soluções para sua marca</h2>
            <p className="mt-3 leading-7 text-dark-4">Atendimento consultivo para escolher produtos, personalização, quantidades e prazos adequados à sua campanha.</p>
            {keywords.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Temas relacionados">
                {keywords.map((keyword) => <li key={keyword} className="rounded-full bg-gray-2 px-3 py-1.5 text-sm text-dark-4">{keyword}</li>)}
              </ul>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
