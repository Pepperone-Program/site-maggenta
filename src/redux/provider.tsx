"use client";

import { store } from "./store";
import { Provider } from "react-redux";
import React, { useEffect } from "react";
import { hydrateCartFromStorage, type CartItem } from "./features/cart-slice";

const CART_STORAGE_KEY = "maggenta:quote-cart";

const readStoredCart = (): CartItem[] | null => {
  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return null;
    }

    const parsedCart = JSON.parse(storedCart);
    return Array.isArray(parsedCart) ? parsedCart : null;
  } catch {
    return null;
  }
};

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const storedCart = readStoredCart();

    if (storedCart) {
      store.dispatch(hydrateCartFromStorage(storedCart));
    }

    const unsubscribe = store.subscribe(() => {
      try {
        const items = store.getState().cartReducer.items;
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // localStorage can be unavailable in restricted browsers.
      }
    });

    return unsubscribe;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
