import type { Product } from "@/types/product";

type ProductSpecsSummaryProps = {
  dimensions?: Product["dimensions"];
  className?: string;
};

const ProductSpecsSummary = ({ dimensions, className = "" }: ProductSpecsSummaryProps) => {
  if (!dimensions) {
    return null;
  }

  const dimensionParts = [
    dimensions.largura ? `L ${dimensions.largura}` : "",
    dimensions.altura ? `A ${dimensions.altura}` : "",
    dimensions.profundidade ? `P ${dimensions.profundidade}` : "",
  ].filter(Boolean);
  const hasDimensions = dimensionParts.length > 0;
  const hasWeight = Boolean(dimensions.peso);

  if (!hasDimensions && !hasWeight) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center gap-1 text-[11px] leading-4 text-dark-5 ${className}`}>
      {hasDimensions && (
        <span className="inline-flex items-center justify-center gap-1">
          <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
            <path d="M2 2.5h1v5h7v1H2z" />
            <path d="M4 6.5h1v1H4zm2 0h1v1H6zm2 0h1v1H8z" />
          </svg>
          <span>{dimensionParts.join(" | ")} cm</span>
        </span>
      )}
      {hasWeight && (
        <span className="inline-flex items-center justify-center gap-1">
          <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
            <path d="M4.7 2.2h2.6l.5 1.5H10l1 5H1l1-5h2.2zM5.4 3.2 5 4.7H2.8l-.6 3h7.6l-.6-3H7z" />
          </svg>
          <span>{dimensions.peso} g</span>
        </span>
      )}
    </div>
  );
};

export default ProductSpecsSummary;
