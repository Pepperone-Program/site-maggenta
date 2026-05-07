import { Product } from "@/types/product";

const shopData: Product[] = [
  {
    title: "Mochila Expedition 42L",
    slug: "mochila-expedition-42l",
    category: "Mochilas e bolsas",
    shortDescription:
      "Mochila tecnica com acesso amplo, capa de chuva integrada e ajuste ergonomico para trilhas longas.",
    description:
      "A Mochila Expedition 42L foi pensada para quem alterna trilha, viagem e rotina outdoor. O costado ventilado, as fitas de compressao e os bolsos de facil acesso ajudam a manter carga, organizacao e conforto em equilibrio.",
    features: [
      "Costado respiravel com ajuste de altura",
      "Capa de chuva embutida",
      "Compartimento para reservatorio de hidratacao",
      "Bolsos laterais elasticos para garrafas",
    ],
    specs: [
      { label: "Capacidade", value: "42 litros" },
      { label: "Peso", value: "1,35 kg" },
      { label: "Material", value: "Ripstop com tratamento repelente a agua" },
      { label: "Garantia", value: "12 meses contra defeitos de fabricacao" },
    ],
    reviews: 15,
    price: 459.9,
    discountedPrice: 349.9,
    id: 1,
    badge: "Mais vendido",
    imgs: {
      thumbnails: [
        "/images/products/product-1-sm-1.png",
        "/images/products/product-1-sm-2.png",
      ],
      previews: [
        "/images/products/product-1-bg-1.png",
        "/images/products/product-1-bg-2.png",
      ],
    },
  },
  {
    title: "Jaqueta StormShell Pro",
    slug: "jaqueta-stormshell-pro",
    category: "Jaquetas e blusoes",
    shortDescription:
      "Jaqueta impermeavel, leve e compactavel para vento, chuva e mudancas rapidas de clima.",
    description:
      "A StormShell Pro combina protecao climatica com mobilidade. O tecido laminado corta vento, resiste a chuva e ocupa pouco espaco na mochila, ideal para montanha, camping e deslocamentos urbanos.",
    features: [
      "Coluna d'agua de 10.000 mm",
      "Capuz ajustavel com aba estruturada",
      "Ziperes com acabamento repelente a agua",
      "Bolso interno para celular ou documentos",
    ],
    specs: [
      { label: "Tecnologia", value: "Impermeavel e respiravel" },
      { label: "Modelagem", value: "Regular com ajustes nos punhos" },
      { label: "Uso indicado", value: "Trekking, viagem e chuva urbana" },
      { label: "Garantia", value: "12 meses contra defeitos de fabricacao" },
    ],
    reviews: 12,
    price: 699.9,
    discountedPrice: 529.9,
    id: 2,
    badge: "Novidade",
    imgs: {
      thumbnails: [
        "/images/products/product-2-sm-1.png",
        "/images/products/product-2-sm-2.png",
      ],
      previews: [
        "/images/products/product-2-bg-1.png",
        "/images/products/product-2-bg-2.png",
      ],
    },
  },
  {
    title: "Reservatorio HydroFlow 2L",
    slug: "reservatorio-hydroflow-2l",
    category: "Hidratacao",
    shortDescription:
      "Reservatorio de hidratacao com mangueira de fluxo rapido para manter o ritmo na trilha.",
    description:
      "O HydroFlow 2L foi feito para mochilas compativeis com sistema de hidratacao. A abertura larga facilita limpeza e abastecimento, enquanto a valvula de mordida reduz vazamentos durante o movimento.",
    features: [
      "Capacidade de 2 litros",
      "Valvula com trava anti-vazamento",
      "Abertura larga para gelo e limpeza",
      "Material livre de BPA",
    ],
    specs: [
      { label: "Capacidade", value: "2 litros" },
      { label: "Compatibilidade", value: "Mochilas com saida para mangueira" },
      { label: "Material", value: "TPU livre de BPA" },
      { label: "Garantia", value: "6 meses contra defeitos de fabricacao" },
    ],
    reviews: 8,
    price: 189.9,
    discountedPrice: 139.9,
    id: 3,
    imgs: {
      thumbnails: [
        "/images/products/product-3-sm-1.png",
        "/images/products/product-3-sm-2.png",
      ],
      previews: [
        "/images/products/product-3-bg-1.png",
        "/images/products/product-3-bg-2.png",
      ],
    },
  },
  {
    title: "Camisa Trek Dry UV50+",
    slug: "camisa-trek-dry-uv50",
    category: "Roupas",
    shortDescription:
      "Camisa tecnica de secagem rapida com protecao solar para caminhadas sob sol forte.",
    description:
      "A Trek Dry UV50+ entrega conforto termico em dias longos. O tecido leve seca rapido, tem toque macio e ajuda a proteger a pele em travessias, viagens e uso diario.",
    features: [
      "Protecao solar UV50+",
      "Tecido leve com secagem rapida",
      "Tratamento antiodor",
      "Costuras posicionadas para reduzir atrito",
    ],
    specs: [
      { label: "Protecao", value: "UV50+" },
      { label: "Composicao", value: "Poliamida e elastano" },
      { label: "Modelagem", value: "Confortavel para movimento" },
      { label: "Garantia", value: "6 meses contra defeitos de fabricacao" },
    ],
    reviews: 17,
    price: 249.9,
    discountedPrice: 179.9,
    id: 4,
    imgs: {
      thumbnails: [
        "/images/products/product-4-sm-1.png",
        "/images/products/product-4-sm-2.png",
      ],
      previews: [
        "/images/products/product-4-bg-1.png",
        "/images/products/product-4-bg-2.png",
      ],
    },
  },
  {
    title: "Relogio Altimeter Trail",
    slug: "relogio-altimeter-trail",
    category: "Acessorios",
    shortDescription:
      "Relogio outdoor com altimetro, bussola digital e monitoramento para atividades ao ar livre.",
    description:
      "O Altimeter Trail acompanha treinos, trilhas e viagens com dados essenciais no pulso. A tela de alto contraste facilita leitura em sol direto e a pulseira resiste ao uso intenso.",
    features: [
      "Altimetro e barometro integrados",
      "Bussola digital",
      "Resistencia a agua para uso esportivo",
      "Bateria de longa duracao",
    ],
    specs: [
      { label: "Sensores", value: "Altimetro, barometro e bussola" },
      { label: "Resistencia", value: "Uso esportivo e chuva" },
      { label: "Pulseira", value: "Silicone de alta resistencia" },
      { label: "Garantia", value: "12 meses contra defeitos de fabricacao" },
    ],
    reviews: 6,
    price: 899.9,
    discountedPrice: 699.9,
    id: 5,
    badge: "Premium",
    imgs: {
      thumbnails: [
        "/images/products/product-5-sm-1.png",
        "/images/products/product-5-sm-2.png",
      ],
      previews: [
        "/images/products/product-5-bg-1.png",
        "/images/products/product-5-bg-2.png",
      ],
    },
  },
  {
    title: "Bastao Carbon Hike",
    slug: "bastao-carbon-hike",
    category: "Acessorios",
    shortDescription:
      "Bastao de caminhada dobravel em carbono para mais estabilidade em subidas e descidas.",
    description:
      "O Carbon Hike reduz impacto nos joelhos e aumenta a seguranca em terrenos irregulares. O sistema dobravel facilita transporte e a manopla anatomica melhora a pegada em percursos longos.",
    features: [
      "Estrutura leve em carbono",
      "Sistema dobravel de montagem rapida",
      "Ponteira para trilha e asfalto",
      "Manopla ergonomica com ajuste de punho",
    ],
    specs: [
      { label: "Peso", value: "245 g por unidade" },
      { label: "Comprimento", value: "Ajustavel de 110 a 130 cm" },
      { label: "Material", value: "Carbono e aluminio" },
      { label: "Garantia", value: "6 meses contra defeitos de fabricacao" },
    ],
    reviews: 11,
    price: 389.9,
    discountedPrice: 289.9,
    id: 6,
    imgs: {
      thumbnails: [
        "/images/products/product-6-sm-1.png",
        "/images/products/product-6-sm-2.png",
      ],
      previews: [
        "/images/products/product-6-bg-1.png",
        "/images/products/product-6-bg-2.png",
      ],
    },
  },
  {
    title: "Calca Alpine Flex",
    slug: "calca-alpine-flex",
    category: "Roupas",
    shortDescription:
      "Calca elastica e resistente para trekking, escalada leve e viagens de aventura.",
    description:
      "A Alpine Flex combina mobilidade, resistencia e acabamento repelente a agua. A modelagem acompanha o movimento sem sobras excessivas, mantendo conforto em trilhas tecnicas.",
    features: [
      "Tecido com elasticidade em quatro direcoes",
      "Tratamento repelente a agua",
      "Bolsos com ziper",
      "Cintura ajustavel",
    ],
    specs: [
      { label: "Composicao", value: "Nylon e elastano" },
      { label: "Uso indicado", value: "Trekking e viagem" },
      { label: "Modelagem", value: "Regular com articulacao nos joelhos" },
      { label: "Garantia", value: "6 meses contra defeitos de fabricacao" },
    ],
    reviews: 14,
    price: 429.9,
    discountedPrice: 319.9,
    id: 7,
    imgs: {
      thumbnails: [
        "/images/products/product-7-sm-1.png",
        "/images/products/product-7-sm-2.png",
      ],
      previews: [
        "/images/products/product-7-bg-1.png",
        "/images/products/product-7-bg-2.png",
      ],
    },
  },
  {
    title: "Lanterna Headbeam 600",
    slug: "lanterna-headbeam-600",
    category: "Acessorios",
    shortDescription:
      "Lanterna de cabeca com 600 lumens, foco ajustavel e bateria recarregavel por USB-C.",
    description:
      "A Headbeam 600 ilumina acampamentos, travessias noturnas e emergencias com potencia regulavel. A faixa elastica segura bem sem incomodar durante caminhadas longas.",
    features: [
      "600 lumens de potencia maxima",
      "Bateria recarregavel USB-C",
      "Modos de luz branca e vermelha",
      "Corpo resistente a respingos",
    ],
    specs: [
      { label: "Potencia", value: "600 lumens" },
      { label: "Bateria", value: "Recarregavel por USB-C" },
      { label: "Autonomia", value: "Ate 18 horas no modo economico" },
      { label: "Garantia", value: "6 meses contra defeitos de fabricacao" },
    ],
    reviews: 9,
    price: 229.9,
    discountedPrice: 169.9,
    id: 8,
    imgs: {
      thumbnails: [
        "/images/products/product-8-sm-1.png",
        "/images/products/product-8-sm-2.png",
      ],
      previews: [
        "/images/products/product-8-bg-1.png",
        "/images/products/product-8-bg-1.png",
      ],
    },
  },
];

export default shopData;
