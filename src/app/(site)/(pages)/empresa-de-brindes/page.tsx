import { Metadata } from "next";
import InstitutionalPage from "@/components/InstitutionalPage";

export const metadata: Metadata = {
  title: "Empresa de Brindes",
  description:
    "Conheça a Maggenta Promocional, nossos serviços de gravação, políticas de frete e garantia.",
  alternates: {
    canonical: "/empresa-de-brindes",
  },
};

const sections = [
  {
    title: "Maggenta PROMOCIONAL",
    paragraphs: [
      "Obrigado por acessar nosso site. Estamos prontos para entender e atender suas necessidades promocionais.",
    ],
  },
  {
    title: "SOBRE NÓS",
    paragraphs: [
      "Um grupo de profissionais altamente capacitados e comprometidos em oferecer excelência e qualidade nos serviços prestados como foco nas suas ideias, mantendo a criatividade com tônica predominante de suas atuações, sem abrir mão de atender com excelência.",
      "Com a missão de oferecer produtos de alta qualidade voltados para a área corporativa, buscando assim o reconhecimento da nossa empresa. Com total respeito e atenção aos nossos clientes.",
      "Com a visão de ser no Brasil e no exterior, referência com os melhores produtos através da inovação no mercado promocional.",
      "Nossos valores são: o desenvolvimento contínuo, comprometimento ético, transparência nas ações, visualização dos colaboradores, qualidades, criatividade, inovação e diferencial.",
    ],
  },
  {
    title: "Serviços de Gravação",
    paragraphs: [
      "Fazemos todo tipo de gravação adequado a cada produto comercializado por nós.",
      "Serigrafia ou Silk-Screen, tampografia, Laser (madeira, Metal e Vidro), Digital, sublimação e bordado. Todas as técnicas foram estudadas e testadas a cada produto para oferecermos a melhor gravação para apresentação de sua marca.",
    ],
  },
  {
    title: "Políticas de Frete",
    paragraphs: [
      "A entrega do material em São Paulo e grande São Paulo são feitas em até 12 horas após a emissão da nota fiscal.",
      "Para o resto do Brasil o frete é de responsabilidade do cliente, respeitando os prazos das transportadoras após a emissão da nota fiscal.",
    ],
  },
  {
    title: "Garantia",
    paragraphs: [
      "O período de garantia é estabelecido de acordo com o produto solicitado, será informado diretamente por um de nossos consultores no ato da compra, bem como irão determinar se há alguma limitação de uso.",
      "Apenas os consumidores que tenham adquirido nossos produtos de maneira legal e autorizada poderão obter cobertura sob esta garantia.",
      "Atenção: A Maggenta Promocional isenta-se da responsabilidade de atender às solicitações de troca ou devolução de produtos fora do prazo ou com ausência dos itens ou acessórios que o acompanham.",
    ],
  },
];

export default function EmpresaDeBrindesPage() {
  return (
    <InstitutionalPage
      eyebrow="Empresa de brindes"
      title="Maggenta Promocional"
      intro="Produtos corporativos, gravação especializada e atendimento consultivo para marcas que precisam entregar qualidade."
      sections={sections}
    />
  );
}
