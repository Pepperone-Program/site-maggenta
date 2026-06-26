import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type InitialState = {
  items: CartItem[];
};

export type CartItem = {
  id: number;
  title: string;
  slug?: string;
  codigo?: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  quantidadeMinima?: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};

const initialState: InitialState = {
  items: [],
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, title, slug, codigo, price, quantity, discountedPrice, quantidadeMinima, imgs } =
        action.payload;
      const minimumQuantity = Math.max(1, Number(quantidadeMinima || 1));
      const safeQuantity = Math.max(minimumQuantity, Number(quantity || minimumQuantity));
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += safeQuantity;
        existingItem.quantidadeMinima = minimumQuantity;
      } else {
        state.items.push({
          id,
          title,
          slug,
          codigo,
          price,
          quantity: safeQuantity,
          discountedPrice,
          quantidadeMinima: minimumQuantity,
          imgs,
        });
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        const minimumQuantity = Math.max(1, Number(existingItem.quantidadeMinima || 1));
        existingItem.quantity = Math.max(minimumQuantity, Number(quantity || minimumQuantity));
      }
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
    },
    hydrateCartFromStorage: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
        .filter((item) => item && Number.isFinite(Number(item.id)))
        .map((item) => {
          const minimumQuantity = Math.max(1, Number(item.quantidadeMinima || 1));

          return {
            ...item,
            id: Number(item.id),
            price: Number(item.price || 0),
            discountedPrice: Number(item.discountedPrice || 0),
            quantidadeMinima: minimumQuantity,
            quantity: Math.max(minimumQuantity, Number(item.quantity || minimumQuantity)),
          };
        });
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity;
  }, 0);
});

export const {
  addItemToCart,
  hydrateCartFromStorage,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
} = cart.actions;
export default cart.reducer;
