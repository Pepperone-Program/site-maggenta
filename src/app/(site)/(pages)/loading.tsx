const PagesLoading = () => {
  return (
    <main className="min-h-screen bg-[#f3f4f6] pt-[124px] sm:pt-[112px]">
      <div className="mx-auto w-full max-w-[1800px] px-2 py-10 sm:px-3">
        <div className="h-12 w-64 max-w-full animate-pulse rounded-md bg-white/80" />
        <div className="mt-8 grid grid-cols-1 gap-7.5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="min-h-[360px] animate-pulse rounded-lg bg-white shadow-1" />
          ))}
        </div>
      </div>
    </main>
  );
};

export default PagesLoading;
