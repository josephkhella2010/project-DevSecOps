import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";

import { setDeleteUser } from "../../reduxSlice/UserSlice/UserSlice";
import {
  setLoading,
  setError,
  setClearLoading,
} from "../../reduxSlice/LoadingSlice/LoadingAndErrorSlice";
import { apiRequest } from "../../../utilities/HeaderFunction";

interface DeleteUserPayload {
  id: string;
  token: string;
}

interface DeleteUserAction {
  type: string;
  payload: DeleteUserPayload;
}

function* deleteUserSaga(action: DeleteUserAction): SagaIterator {
  try {
    yield put(setLoading());

    const { id, token } = action.payload;

    if (!id || !token) {
      throw new Error("User ID or authentication token is missing.");
    }

    yield call(apiRequest, {
      api: "",
      endpoint: `delete-user/${id}`,
      method: "DELETE",
      token,
    });

    // Clear the session only after successful deletion.
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    yield put(setDeleteUser(id));
  } catch (error: unknown) {
    let message = "Failed to delete your account.";

    if (typeof error === "object" && error !== null && "response" in error) {
      const response = (
        error as {
          response?: {
            data?: { error?: string; message?: string };
          };
        }
      ).response;

      message = response?.data?.error ?? response?.data?.message ?? message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    yield put(setError(message));
  } finally {
    yield put(setClearLoading());
  }
}

export function* WatchDeleteUser(): SagaIterator {
  yield takeLatest("FETCH-DELETE-USER", deleteUserSaga);
}
