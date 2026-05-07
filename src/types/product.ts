export type Product = {
  title: string;
  slug: string;
  category: string;
  codigo?: string;
  idTipoProduto?: number;
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
  imgs: {
    thumbnails: string[];
    previews: string[];
  };
};
