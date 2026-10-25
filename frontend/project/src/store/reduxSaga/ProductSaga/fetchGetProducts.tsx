import { call, put, takeLatest } from "redux-saga/effects";

import type { SagaIterator } from "redux-saga";
import { apiRequest } from "../../../utilities/HeaderFunction.js";
import {
  setClearLoading,
  setError,
  setLoading,
} from "../../reduxSlice/LoadingSlice/LoadingAndErrorSlice.js";
import { setProducts } from "../../reduxSlice/ProductSlice/ProductSlice.js";

async function FetchApiUrl() {
  const data = await apiRequest({
    api: "products",
    method: "GET",
    endpoint: "",
  });
  const products = data.products;
  return products;
}

function* FetchGetProducts(): SagaIterator {
  try {
    yield put(setLoading());

    const products = yield call(FetchApiUrl);
    yield put(setProducts(products));
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }

    yield put(setError(message));
  } finally {
    yield put(setClearLoading());
  }
}

export function* WatchFetchGetProducts() {
  yield takeLatest("FETCH-PRODUCTS", FetchGetProducts);
}
