import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { toast } from "react-toastify";

import { setUserProducts } from "../../reduxSlice/ProductSlice/ProductSlice.js";
import {
  setLoading,
  setError,
  setClearLoading,
} from "../../reduxSlice/LoadingSlice/LoadingAndErrorSlice.js";

import { apiRequest } from "../../../utilities/HeaderFunction.js";
import type { ProductsType } from "../../../utilities/interfaces.js";
import { setUpdateUserProducts } from "../../reduxSlice/UserSlice/UserSlice.js";

interface AddUserProductPayload {
  productId: string;
  quantity: number;
}

interface AddUserProductAction {
  type: string;
  payload: AddUserProductPayload;
}

interface AddUserProductResponse {
  message?: string;
  products: ProductsType[];
}

async function AddUserProductApi(
  productId: string,
  quantity: number,
): Promise<AddUserProductResponse> {
  if (!productId) {
    throw new Error("Product ID is missing.");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a positive integer.");
  }

  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    throw new Error("Please log in to add products.");
  }

  let user: { token?: string; accessToken?: string };

  try {
    user = JSON.parse(storedUser);
  } catch {
    throw new Error("Stored user information is invalid. Please log in again.");
  }

  const token = user.token ?? user.accessToken;

  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  console.log("Adding product:", productId);
  console.log("Requested quantity:", quantity);

  const data = await apiRequest({
    api: "",
    endpoint: `add-user-product/${productId}`,
    method: "POST",
    token,
    body: { quantity },
  });

  return data as AddUserProductResponse;
}

function* addUserProductSaga(action: AddUserProductAction): SagaIterator {
  try {
    yield put(setLoading());
    yield put(setError(""));

    const { productId, quantity } = action.payload;

    const response: AddUserProductResponse = yield call(
      AddUserProductApi,
      productId,
      quantity,
    );

    yield put(setUserProducts(response.products));

    yield put(setUpdateUserProducts(response.products));

    yield call(
      [toast, toast.success],
      response.message ?? "Product quantity updated successfully!",
    );
  } catch (error: unknown) {
    let message = "Failed to add product.";

    if (error instanceof Error) {
      message = error.message;

      // Support Axios-style errors containing the backend response.
      const apiError = error as Error & {
        response?: {
          status?: number;
          data?: { message?: string; error?: string };
        };
      };

      if (apiError.response?.data?.message) {
        message = apiError.response.data.message;
      } else if (apiError.response?.data?.error) {
        message = apiError.response.data.error;
      } else if (apiError.response?.status === 409) {
        message = "This product is already in your products.";
      }
    }

    yield put(setError(message));
    yield call([toast, toast.error], message);
  } finally {
    yield put(setClearLoading());
  }
}

export function* WatchAddUserProduct(): SagaIterator {
  yield takeLatest("ADD-USER-PRODUCT", addUserProductSaga);
}
