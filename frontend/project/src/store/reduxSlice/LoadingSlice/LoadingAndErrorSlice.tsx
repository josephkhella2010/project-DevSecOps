import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface LoadingErrorType {
  isLoading: boolean;
  error: string | null;
  fields: string[];
  isSuccess: boolean;
}

const initialState: LoadingErrorType = {
  isLoading: false,
  error: null,
  fields: [],
  isSuccess: false,
};

const loadingAndErrorSlice = createSlice({
  name: "loadingSlice",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
      state.isSuccess = false;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isSuccess = false;
    },

    setClearLoading: (state) => {
      state.isLoading = false;
    },

    setFields: (state, action: PayloadAction<string[]>) => {
      state.fields = action.payload;
    },

    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.isSuccess = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
  },
});

export const { setLoading, setError, setClearLoading, setFields, setSuccess } =
  loadingAndErrorSlice.actions;

export default loadingAndErrorSlice.reducer;
