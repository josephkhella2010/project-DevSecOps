import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { apiRequest } from "../../../utilities/HeaderFunction.js";
import {
  setClearLoading,
  setError,
  setLoading,
} from "../../reduxSlice/LoadingSlice/LoadingAndErrorSlice.js";
import { setProduct } from "../../reduxSlice/ProductSlice/ProductSlice.js";

// 1. API Helper that accepts the product ID
async function FetchProductByIdApi(id: string) {
  const data = await apiRequest({
    api: "products",
    method: "GET",
    endpoint: `/${id}`, // Appends the ID to the endpoint (e.g., /products/123)
  });

  return data.product; // Matches your backend response structure: { product: ... }
}

// 2. Worker Saga (receives the action containing the ID in payload)
function* FetchGetProductById(action: {
  type: string;
  payload: string;
}): SagaIterator {
  try {
    yield put(setLoading());

    // Pass the ID from the action payload into the call effect
    const product = yield call(FetchProductByIdApi, action.payload);

    // Save the single product into your Redux store
    yield put(setProduct(product));
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

// 3. Watcher Saga
export function* WatchFetchGetProductById() {
  yield takeLatest("FETCH-PRODUCT-BY-ID", FetchGetProductById);
}
