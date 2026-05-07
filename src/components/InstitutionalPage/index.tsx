import React from "react";

type InstitutionalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type InstitutionalPageProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  sections: InstitutionalSection[];
};

const InstitutionalPage = ({
  eyebrow,
  title,
  intro,
  sections,
}: InstitutionalPageProps) => {
  return (
    <main className="bg-white pt-[124px] sm:pt-[112px]">
      <section className="border-b border-gray-3 bg-[#f7faf8]">
        <div className="mx-auto grid w-full max-w-[1800px] gap-10 px-2 py-14 sm:px-3 lg:grid-cols-[0.9fr_1.4fr] lg:py-20">
          <div>
            <span className="mb-4 inline-flex rounded-full bg-blue px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white">
              {eyebrow}
            </span>
            <h1 className="max-w-[680px] text-4xl font-semibold leading-tight text-dark sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          </div>
          {intro && (
            <p className="max-w-[760px] self-end text-lg leading-8 text-dark-3">
              {intro}
            </p>
          )}
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1800px] gap-8 px-2 sm:px-3 lg:grid-cols-[320px_1fr] xl:grid-cols-[380px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-32 border-l-4 border-blue bg-gray-1 p-7">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue">
                Conteudo
              </p>
              <nav className="mt-5 flex flex-col gap-3">
                {sections.map((section) => (
                  <a
                    key={section.title}
                    href={`#${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="text-sm font-medium text-dark-3 duration-200 hover:text-blue"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="grid gap-6">
            {sections.map((section) => (
              <article
                id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                key={section.title}
                className="border-b border-gray-3 pb-8 last:border-b-0"
              >
                <h2 className="mb-4 text-2xl font-semibold text-dark lg:text-3xl">
                  {section.title}
                </h2>
                <div className="grid gap-4 text-base leading-8 text-dark-3">
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets && (
                    <ul className="grid gap-3">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-3 h-1.5 w-1.5 flex-none rounded-full bg-blue" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default InstitutionalPage;
