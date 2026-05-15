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
          
          <p className="mb-3 mt-5 font-medium text-dark">Nos acompanhe em nossas redes:</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="https://www.instagram.com/pepperonebrindes/" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"  height="25" width="25"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="#bdbdbd"></path> <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="#bdbdbd"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" fill="#bdbdbd"></path> </g></svg>
            </Link>
            <Link href="https://www.linkedin.com/company/pepperone/" aria-label="Linkedin">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height="25" width="25" stroke=""><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8Z" fill="#bdbdbd"></path> <path d="M5 10C5 9.44772 5.44772 9 6 9H7C7.55228 9 8 9.44771 8 10V18C8 18.5523 7.55228 19 7 19H6C5.44772 19 5 18.5523 5 18V10Z" fill="#bdbdbd"></path> <path d="M11 19H12C12.5523 19 13 18.5523 13 18V13.5C13 12 16 11 16 13V18.0004C16 18.5527 16.4477 19 17 19H18C18.5523 19 19 18.5523 19 18V12C19 10 17.5 9 15.5 9C13.5 9 13 10.5 13 10.5V10C13 9.44771 12.5523 9 12 9H11C10.4477 9 10 9.44772 10 10V18C10 18.5523 10.4477 19 11 19Z" fill="#bdbdbd"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z" fill="#bdbdbd"></path> </g></svg>
            </Link>
            <Link href="https://www.facebook.com/pepperonepromocional" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height="25" width="25"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H15V13.9999H17.0762C17.5066 13.9999 17.8887 13.7245 18.0249 13.3161L18.4679 11.9871C18.6298 11.5014 18.2683 10.9999 17.7564 10.9999H15V8.99992C15 8.49992 15.5 7.99992 16 7.99992H18C18.5523 7.99992 19 7.5522 19 6.99992V6.31393C19 5.99091 18.7937 5.7013 18.4813 5.61887C17.1705 5.27295 16 5.27295 16 5.27295C13.5 5.27295 12 6.99992 12 8.49992V10.9999H10C9.44772 10.9999 9 11.4476 9 11.9999V12.9999C9 13.5522 9.44771 13.9999 10 13.9999H12V21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z" fill="#c4c4c4"></path> </g></svg>
            </Link>
            <Link href="https://x.com/pepperonebrinde" aria-label="X" target="_blank" rel="noopener noreferrer">
              <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                height="30" width="30" viewBox="0 0 50.000000 50.000000"
                preserveAspectRatio="xMidYMid meet">

                <g transform="translate(0.000000,50.000000) scale(0.100000,-0.100000)"
                fill="#c4c4c4" stroke="none">
                <path d="M62 437 c-21 -22 -22 -33 -22 -188 0 -221 -12 -209 211 -209 221 0
                209 -12 209 211 0 221 12 209 -211 209 -160 0 -166 -1 -187 -23z m362 -13 c24
                -23 24 -325 0 -348 -23 -24 -325 -24 -348 0 -24 23 -24 325 0 348 23 24 325
                24 348 0z"/>
                <path d="M176 305 c52 -74 54 -62 -20 -142 -19 -21 -25 -33 -16 -33 8 0 32 21
                54 46 l41 46 33 -46 c30 -41 37 -46 73 -46 l39 0 -51 71 c-55 78 -55 71 5 137
                21 22 25 32 15 32 -9 0 -30 -18 -48 -41 l-33 -40 -30 40 c-26 36 -35 41 -69
                41 l-38 0 45 -65z m92 -52 c39 -54 65 -100 59 -102 -12 -4 -35 22 -107 127
                -34 48 -46 72 -36 72 8 0 46 -44 84 -97z"/>
                </g>
                </svg>
            </Link>
            <Link href="https://wa.me/11989597801" aria-label="Whatsapp">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height="27" width="27"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.50002 12C3.50002 7.30558 7.3056 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C10.3278 20.5 8.77127 20.0182 7.45798 19.1861C7.21357 19.0313 6.91408 18.9899 6.63684 19.0726L3.75769 19.9319L4.84173 17.3953C4.96986 17.0955 4.94379 16.7521 4.77187 16.4751C3.9657 15.176 3.50002 13.6439 3.50002 12ZM12 1.5C6.20103 1.5 1.50002 6.20101 1.50002 12C1.50002 13.8381 1.97316 15.5683 2.80465 17.0727L1.08047 21.107C0.928048 21.4637 0.99561 21.8763 1.25382 22.1657C1.51203 22.4552 1.91432 22.5692 2.28599 22.4582L6.78541 21.1155C8.32245 21.9965 10.1037 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5ZM14.2925 14.1824L12.9783 15.1081C12.3628 14.7575 11.6823 14.2681 10.9997 13.5855C10.2901 12.8759 9.76402 12.1433 9.37612 11.4713L10.2113 10.7624C10.5697 10.4582 10.6678 9.94533 10.447 9.53028L9.38284 7.53028C9.23954 7.26097 8.98116 7.0718 8.68115 7.01654C8.38113 6.96129 8.07231 7.046 7.84247 7.24659L7.52696 7.52195C6.76823 8.18414 6.3195 9.2723 6.69141 10.3741C7.07698 11.5163 7.89983 13.314 9.58552 14.9997C11.3991 16.8133 13.2413 17.5275 14.3186 17.8049C15.1866 18.0283 16.008 17.7288 16.5868 17.2572L17.1783 16.7752C17.4313 16.5691 17.5678 16.2524 17.544 15.9269C17.5201 15.6014 17.3389 15.308 17.0585 15.1409L15.3802 14.1409C15.0412 13.939 14.6152 13.9552 14.2925 14.1824Z" fill="#bdbdbd"></path> </g></svg>
            </Link>
            <Link href="https://www.youtube.com/channel/UC_5I5Dl0two_DqBNsZdRlfA" aria-label="Youtube">
              <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" height="30" width="30"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.168 19.0028C20.4724 19.0867 22.41 17.29 22.5 14.9858V9.01982C22.41 6.71569 20.4724 4.91893 18.168 5.00282H6.832C4.52763 4.91893 2.58998 6.71569 2.5 9.01982V14.9858C2.58998 17.29 4.52763 19.0867 6.832 19.0028H18.168Z" stroke="#bdbdbd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.008 9.17784L15.169 11.3258C15.3738 11.4454 15.4997 11.6647 15.4997 11.9018C15.4997 12.139 15.3738 12.3583 15.169 12.4778L12.008 14.8278C11.408 15.2348 10.5 14.8878 10.5 14.2518V9.75184C10.5 9.11884 11.409 8.77084 12.008 9.17784Z" stroke="#bdbdbd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </Link>
          </div>
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
              <Link className="duration-200 hover:text-blue" href="/brindes-personalizados">
                Loja completa
              </Link>
            </li>
            <li>
              <Link className="duration-200 hover:text-blue" href="/brindes-para-empresas">
                Brindes para empresas
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
            <Image src="/images/payment/payment-03.svg" alt="Mastercard" width={43} height={24} />
            <Image src="/images/payment/paypal.png" alt="payPal" width={66} height={22} />  
            <Image src="/images/payment/payment-05.svg" alt="Google Pay" width={56} height={22} />    
          </div>
          <p className="mb-3 mt-5 font-medium text-dark">Certificados:</p>
          <div className="flex flex-wrap items-center gap-5">
            <Image src="/images/logo/certificado-brindice-guia-de-brindes-personalizados-m-a2 (1).png" alt="Certificado Bríndice" width={100} height={42} />
            <Image src="/images/logo/logo_abrinq.png" alt="Certificado Abrinq" width={73} height={44} />
          </div>
        </div>
      </div>

      <div className="bg-gray-1 py-5">
        <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-3 px-2 text-sm text-dark-3 sm:px-3 md:flex-row md:items-center md:justify-between">
          <p>&copy; {year} Pepperone Brindes Corporativos. Todos os direitos reservados.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/fale-conosco" className="hover:text-blue">
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
