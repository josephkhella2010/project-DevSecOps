/* import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductsType } from "../../../utilities/interfaces.js";

interface InitialStateType {
  products: ProductsType[];
  product: ProductsType | null;
  userProducts: ProductsType[];
}

const initialState: InitialStateType = {
  products: [],
  product: null,
  userProducts: [],
};

const productSlice = createSlice({
  name: "productSlice",
  initialState,

  reducers: {
    setProducts: (state, action: PayloadAction<ProductsType[]>) => {
      state.products = action.payload;
    },
    setProduct: (state, action: PayloadAction<ProductsType>) => {
      state.product = action.payload;
    },
    setUserProducts: (state, action: PayloadAction<ProductsType[]>) => {
      state.userProducts = action.payload;
    },
    deleteUserProduct: (state, action: PayloadAction<string>) => {
      const productId = action.payload;

      state.userProducts = state.userProducts.filter(
        (product) => product._id !== productId,
      );

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);

          if (user.userInfo?.products) {
            user.userInfo.products = user.userInfo.products.filter(
              (product: ProductsType | string) =>
                typeof product === "string"
                  ? product !== productId
                  : product._id !== productId,
            );
          }

          localStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
          console.error("Failed to update stored user:", error);
        }
      }
    },
  },
});

export const { setProducts, setProduct, setUserProducts, deleteUserProduct } =
  productSlice.actions;

export default productSlice.reducer;
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductsType } from "../../../utilities/interfaces.js";

interface InitialStateType {
  products: ProductsType[];
  product: ProductsType | null;
  userProducts: ProductsType[];
}

const initialState: InitialStateType = {
  products: [],
  product: null,
  userProducts: [],
};

const productSlice = createSlice({
  name: "productSlice",
  initialState,

  reducers: {
    setProducts: (state, action: PayloadAction<ProductsType[]>) => {
      state.products = action.payload;
    },

    setProduct: (state, action: PayloadAction<ProductsType>) => {
      state.product = action.payload;
    },

    setUserProducts: (state, action: PayloadAction<ProductsType[]>) => {
      state.userProducts = action.payload;

      try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          const user = JSON.parse(storedUser);

          user.userInfo = {
            ...user.userInfo,
            products: action.payload,
          };

          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Failed to update stored products:", error);
      }
    },

    deleteUserProduct: (state, action: PayloadAction<string>) => {
      state.userProducts = state.userProducts.filter(
        (product) => product._id !== action.payload,
      );

      try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          const user = JSON.parse(storedUser);

          user.userInfo = {
            ...user.userInfo,
            products: state.userProducts,
          };

          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Failed to delete stored product:", error);
      }
    },
  },
});

export const { setProducts, setProduct, setUserProducts, deleteUserProduct } =
  productSlice.actions;

export default productSlice.reducer;
