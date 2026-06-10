import React from "react";

type ProductListingSkeletonProps = {
  withSidebar?: boolean;
  itemCount?: number;
};

const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-3/70 ${className}`} />
);

const ProductCardSkeleton = () => (
  <div className="flex min-h-[430px] flex-col">
    <SkeletonBlock className="mb-4 aspect-square w-full rounded-lg bg-white shadow-1" />
    <SkeletonBlock className="mx-auto mb-2 h-4 w-32" />
    <SkeletonBlock className="mx-auto mb-2 h-5 w-4/5" />
    <SkeletonBlock className="mx-auto mb-5 h-5 w-36" />
    <SkeletonBlock className="mx-auto mt-auto h-11 w-full max-w-[220px] rounded-[5px] bg-white shadow-1" />
  </div>
);

const SidebarSkeleton = () => (
  <aside className="hidden w-full max-w-[292px] shrink-0 xl:block" aria-hidden="true">
    <div className="flex flex-col gap-5">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="rounded-md border border-gray-3 bg-white p-5 shadow-1">
          <SkeletonBlock className="mb-5 h-5 w-32" />
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
            <SkeletonBlock className="h-4 w-4/6" />
          </div>
        </div>
      ))}
    </div>
  </aside>
);

const ProductListingSkeleton = ({
  withSidebar = false,
  itemCount = 12,
}: ProductListingSkeletonProps) => {
  return (
    <section className="relative min-h-[900px] overflow-hidden bg-[#f3f4f6] pb-20 pt-5 lg:pt-12 xl:pt-16">
      <div className="mx-auto w-full max-w-[1800px] px-2 sm:px-3">
        <div className="flex gap-6 xl:gap-8">
          {withSidebar && <SidebarSkeleton />}

          <div className="min-w-0 flex-1">
            <div className="mb-6 rounded-md border border-gray-3 bg-white px-4 py-3 shadow-1 sm:px-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <SkeletonBlock className="h-5 w-56" />
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  <SkeletonBlock className="h-9 w-10.5 rounded-[5px]" />
                  <SkeletonBlock className="h-9 w-10.5 rounded-[5px]" />
                </div>
              </div>
            </div>

            <div
              className="grid min-h-[720px] grid-cols-1 gap-x-6 gap-y-10 opacity-95 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
              aria-hidden="true"
            >
              {Array.from({ length: itemCount }, (_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListingSkeleton;
