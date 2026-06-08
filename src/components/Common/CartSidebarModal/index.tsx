"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { removeItemFromCart } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import EmptyCart from "./EmptyCart";
import SingleItem from "./SingleItem";

const CartSidebarModal = () => {
  const { isCartModalOpen, closeCartModal } = useCartModalContext();
  const cartItems = useAppSelector((state) => state.cartReducer.items);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      if (!target.closest(".modal-content")) {
        closeCartModal();
      }
    }

    if (isCartModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartModalOpen, closeCartModal]);

  return (
    <div
      className={`fixed left-0 top-0 z-99999 flex h-screen w-full items-start justify-end overflow-y-auto bg-dark/70 px-3 py-4 duration-300 sm:px-5 sm:py-6 ${
        isCartModalOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="modal-content relative flex max-h-[calc(100vh-32px)] w-full max-w-[430px] flex-col rounded-lg bg-white px-4 shadow-1 sm:max-h-[calc(100vh-48px)] sm:px-6">
        <div className="flex items-start justify-between gap-4 border-b border-gray-3 bg-white pb-4 pt-4 sm:pt-6">
          <div>
            <h2 className="text-lg font-medium text-dark sm:text-xl">Orçamento</h2>
            <p className="mt-1 text-custom-sm text-dark-4">
              {cartItems.length
                ? `${cartItems.length} produto${cartItems.length > 1 ? "s" : ""} selecionado${
                    cartItems.length > 1 ? "s" : ""
                  }`
                : "Nenhum produto selecionado"}
            </p>
          </div>

          <button
            onClick={() => closeCartModal()}
            aria-label="Fechar orçamento"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-1 text-dark-5 duration-150 hover:text-dark"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5379 11.2121C12.1718 10.846 11.5782 10.846 11.212 11.2121C10.8459 11.5782 10.8459 12.1718 11.212 12.5379L13.6741 15L11.2121 17.4621C10.846 17.8282 10.846 18.4218 11.2121 18.7879C11.5782 19.154 12.1718 19.154 12.5379 18.7879L15 16.3258L17.462 18.7879C17.8281 19.154 18.4217 19.154 18.7878 18.7879C19.154 18.4218 19.154 17.8282 18.7878 17.462L16.3258 15L18.7879 12.5379C19.154 12.1718 19.154 11.5782 18.7879 11.2121C18.4218 10.846 17.8282 10.846 17.462 11.2121L15 13.6742L12.5379 11.2121Z"
                fill=""
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15 1.5625C7.57867 1.5625 1.5625 7.57867 1.5625 15C1.5625 22.4213 7.57867 28.4375 15 28.4375C22.4213 28.4375 28.4375 22.4213 28.4375 15C28.4375 7.57867 22.4213 1.5625 15 1.5625ZM3.4375 15C3.4375 8.61421 8.61421 3.4375 15 3.4375C21.3858 3.4375 26.5625 8.61421 26.5625 15C26.5625 21.3858 21.3858 26.5625 15 26.5625C8.61421 26.5625 3.4375 21.3858 3.4375 15Z"
                fill=""
              />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto py-4 pr-1">
          <div className="flex flex-col gap-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <SingleItem
                  key={item.id}
                  item={item}
                  removeItemFromCart={removeItemFromCart}
                />
              ))
            ) : (
              <EmptyCart />
            )}
          </div>
        </div>

        <div className="border-t border-gray-3 bg-white pb-4 pt-4 sm:pb-6">
          <Link
            href="/orcamentos"
            onClick={() => closeCartModal()}
            className="flex w-full justify-center rounded-md bg-dark px-6 py-[13px] font-medium text-white duration-200 hover:bg-opacity-95"
          >
            Finalizar Orçamento
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartSidebarModal;
