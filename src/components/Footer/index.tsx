import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="overflow-hidden border-t border-gray-3 bg-white">
      <div className="mx-auto grid w-full max-w-[1800px] gap-10 px-2 py-14 sm:px-3 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
        <div>
          <Link href="/" aria-label="Pepperone">
            <Image
              src="/images/logo/logo.svg"
              alt="Pepperone"
              width={160}
              height={40}
            />
          </Link>
          <p className="mt-6 max-w-[360px] leading-7 text-dark-3">
            Brindes de alta qualidade, equipamentos premium para trilhas, viagens e rotinas com
            clima imprevisível. Curadoria técnica, orçamento rápido e atendimento
            próximo.
          </p>
          <div className="mt-6 grid gap-2 text-sm text-dark-3">
            <span>Atendimento: seg. a sex., 9h às 18h</span>
            <a href="mailto:vendas@pepperone.com.br" className="hover:text-blue">
              vendas@pepperone.com.br
            </a>
            <a href="tel:+551129715252" className="hover:text-blue">
              (11) 2971-5252 / (11) 2950-3923
            </a>
          </div>
        </div>

        <div>
          <h2 className="mb-5 text-custom-1 font-medium text-dark">Orçar</h2>
          <ul className="flex flex-col gap-3 text-dark-3">
            <li>
              <Link className="duration-200 hover:text-blue" href="/">
                Início
              </Link>
            </li>
            <li>
              <Link className="duration-200 hover:text-blue" href="/shop-with-sidebar">
                Loja completa
              </Link>
            </li>
            <li>
              <Link className="duration-200 hover:text-blue" href="/shop-without-sidebar">
                Vitrine
              </Link>
            </li>
            <li>
              <Link className="duration-200 hover:text-blue" href="/cart">
                Orçamento
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-5 text-custom-1 font-medium text-dark">Empresa</h2>
          <ul className="flex flex-col gap-3 text-dark-3">
            <li>
              <Link className="duration-200 hover:text-blue" href="/empresa-de-brindes">
                Quem somos
              </Link>
            </li>
            <li>
              <Link className="duration-200 hover:text-blue" href="/fale-conosco">
                Fale conosco
              </Link>
            </li>
            <li>
              <Link className="duration-200 hover:text-blue" href="/termos-de-uso">
                Termos de uso
              </Link>
            </li>
            <li>
              <Link className="duration-200 hover:text-blue" href="/politicas-de-privacidade">
                Politicas de Privacidade
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-5 text-custom-1 font-medium text-dark">Endereço</h2>
          <p className="mb-5 text-sm leading-6 text-dark-3">
            Rua Jaguarete, 43 - Casa Verde, São Paulo - SP, 02515-010
          </p>
          <p className="mb-3 font-medium text-dark">Aceitamos:</p>
          <div className="flex flex-wrap items-center gap-5">
            <Image src="/images/payment/payment-01.svg" alt="Visa" width={66} height={22} />
            <Image src="/images/payment/payment-03.svg" alt="Mastercard" width={33} height={24} />
            <Image src="/images/payment/payment-05.svg" alt="Google Pay" width={56} height={22} />
          </div>
        </div>
      </div>

      <div className="bg-gray-1 py-5">
        <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-3 px-2 text-sm text-dark-3 sm:px-3 md:flex-row md:items-center md:justify-between">
          <p>&copy; {year} Pepperone Brindes Corporativos. Todos os direitos reservados.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="hover:text-blue">
              Atendimento
            </Link>
            <Link href="/politicas-de-privacidade" className="hover:text-blue">
              Política de privacidade
            </Link>
            <Link href="/termos-de-uso" className="hover:text-blue">
              Trocas e devoluções
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
