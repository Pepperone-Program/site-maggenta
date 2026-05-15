import Link from "next/link";
import React from "react";

type BreadcrumbProps = {
  title: string;
  pages: string[];
  titleAs?: React.ElementType;
};

const Breadcrumb = ({ title, pages, titleAs = "h1" }: BreadcrumbProps) => {
  const TitleTag = titleAs;

  return (
    <div className="overflow-hidden shadow-breadcrumb pt-[124px] sm:pt-[112px]">
      <div className="border-t border-gray-3">
        <div className="max-w-[1800px] w-full mx-auto px-2 sm:px-3 py-5 xl:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <TitleTag className="font-semibold text-dark text-xl sm:text-2xl xl:text-custom-2">
              {title}
            </TitleTag>

            <ul className="flex items-center gap-2">
              <li className="text-custom-sm hover:text-blue">
                <Link href="/">Início /</Link>
              </li>

              {pages.length > 0 &&
                pages.map((page, key) => (
                  <li className="text-custom-sm last:text-blue capitalize" key={key}>
                    {page} 
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
