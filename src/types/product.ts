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
  reviews: number;
  price: number;
  discountedPrice: number;
  id: number;
  badge?: string;
  dataInclusao?: string;
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
