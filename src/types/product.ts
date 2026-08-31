export type Product = {
  title: string;
  slug: string;
  category: string;
  categoryId?: number;
  codigo?: string;
  idTipoProduto?: number;
  quantidadeMinima?: number;
  shortDescription: string;
  description: string;
  features: string[];
  specs: {
    label: string;
    value: string;
  }[];
  dimensions?: {
    altura?: string;
    largura?: string;
    profundidade?: string;
    peso?: string;
  };
  reviews: number;
  price: number;
  discountedPrice: number;
  id: number;
  badge?: string;
  dataInclusao?: string;
  updatedAt?: string;
  seoTaxonomy?: {
    subcategories: Array<{ id: number; title: string }>;
    audiences: Array<{ id: number; title: string }>;
    promotionalDates: Array<{ id: number; title: string }>;
  };
  lancamento?: boolean;
  promocao?: boolean;
  premium?: boolean;
  totalOrcamentos?: number;
  video?: string | null;
  imgs: {
    thumbnails: string[];
    previews: string[];
  };
};
