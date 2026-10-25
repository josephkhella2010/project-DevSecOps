import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { toast } from "react-toastify";

import { deleteUserProduct } from "../../reduxSlice/ProductSlice/ProductSlice.js";
import {
  setLoading,
  setError,
  setClearLoading,
} from "../../reduxSlice/LoadingSlice/LoadingAndErrorSlice.js";

import { apiRequest } from "../../../utilities/HeaderFunction.js";
import type { ProductsType } from "../../../utilities/interfaces.js";
import { setUpdateUserProducts } from "../../reduxSlice/UserSlice/UserSlice.js";

interface DeleteUserProductResponse {
  message?: string;
  products: ProductsType[];
}

interface DeleteUserProductAction {
  type: string;
  payload: string;
}

async function DeleteUserProductApi(
  productId: string,
): Promise<DeleteUserProductResponse> {
  if (!productId) {
    throw new Error("Product ID is missing.");
  }

  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    throw new Error("Please log in to remove products.");
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

  const data = await apiRequest({
    api: "",
    endpoint: `delete-user-product/${productId}`,
    method: "DELETE",
    token,
  });

  return data as DeleteUserProductResponse;
}

function* deleteUserProductSaga(action: DeleteUserProductAction): SagaIterator {
  try {
    yield put(setLoading());
    yield put(setError(""));

    const productId = action.payload;

    const response: DeleteUserProductResponse = yield call(
      DeleteUserProductApi,
      productId,
    );

    // Update Redux by filtering out the deleted product ID.
    yield put(deleteUserProduct(productId));
    yield put(setUpdateUserProducts(response.products));

    yield call(
      [toast, toast.success],
      response.message ?? "Product removed successfully!",
    );
  } catch (error: unknown) {
    let message = "Failed to remove product.";

    if (error instanceof Error) {
      message = error.message;

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
      } else if (apiError.response?.status === 404) {
        message = "Product not found in your products.";
      }
    }

    yield put(setError(message));
    yield call([toast, toast.error], message);
  } finally {
    yield put(setClearLoading());
  }
}

export function* WatchDeleteUserProduct(): SagaIterator {
  yield takeLatest("DELETE-USER-PRODUCT", deleteUserProductSaga);
}
