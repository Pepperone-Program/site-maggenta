const siteUrl = "https://www.pepperone.com.br";

export const revalidate = 86400;

export function GET() {
  const content = `# Pepperone

> Pepperone e um site brasileiro de brindes corporativos personalizados para empresas, campanhas promocionais, eventos, datas comemorativas e acoes de relacionamento.

## Principais URLs

- Home: ${siteUrl}/
- Catalogo de brindes personalizados: ${siteUrl}/brindes-personalizados
- Brindes para empresas: ${siteUrl}/brindes-para-empresas
- Publicos-alvo: ${siteUrl}/publicos-alvos
- Datas promocionais: ${siteUrl}/datas-promocionais
- Fale conosco: ${siteUrl}/fale-conosco
- Sitemap: ${siteUrl}/sitemap.xml

## Conteudo permitido para assistentes de IA

Assistentes, mecanismos de resposta e indexadores de LLMs podem ler, resumir e citar paginas publicas do site para responder usuarios sobre brindes personalizados, categorias, produtos, campanhas promocionais, publico-alvo, quantidade minima e formas de solicitar orcamento.

## Dados comerciais

- Empresa: Pepperone Brindes Corporativos
- Email: vendas@pepperone.com.br
- Telefones: (11) 2971-5252 / (11) 2950-3923
- Endereco: Rua Jaguarete, 43, Casa Verde, Sao Paulo - SP, 02515-010
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
