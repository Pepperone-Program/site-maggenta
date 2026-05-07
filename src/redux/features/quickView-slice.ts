import { createSlice } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product;
};

const emptyProduct: Product = {
  title: "",
  slug: "",
  category: "",
  shortDescription: "",
  description: "",
  features: [],
  specs: [],
  reviews: 0,
  price: 0,
  discountedPrice: 0,
  id: 0,
  imgs: { thumbnails: [], previews: [] },
};

const initialState: InitialState = {
  value: {
    ...emptyProduct,
  },
};

export const quickView = createSlice({
  name: "quickView",
  initialState,
  reducers: {
    updateQuickView: (_, action) => {
      return {
        value: {
          ...action.payload,
        },
      };
    },

    resetQuickView: () => {
      return {
        value: initialState.value,
      };
    },
  },
});

export const { updateQuickView, resetQuickView } = quickView.actions;
export default quickView.reducer;
