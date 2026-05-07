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

export const productDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    updateproductDetails: (_, action) => {
      return {
        value: {
          ...action.payload,
        },
      };
    },
  },
});

export const { updateproductDetails } = productDetails.actions;
export default productDetails.reducer;
