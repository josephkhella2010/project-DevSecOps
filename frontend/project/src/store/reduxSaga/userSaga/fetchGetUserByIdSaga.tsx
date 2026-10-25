import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";

import { apiRequest } from "../../../utilities/HeaderFunction";
import { setUserById } from "../../reduxSlice/UserSlice/UserSlice";
import {
  setLoading,
  setError,
  setClearLoading,
} from "../../reduxSlice/LoadingSlice/LoadingAndErrorSlice";

interface GetUserByIdPayload {
  id: string;
  token: string;
}

interface GetUserByIdAction {
  type: string;
  payload: GetUserByIdPayload;
}

interface ApiUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ApiResponse {
  user: ApiUser;
}

function* getUserByIdSaga(action: GetUserByIdAction): SagaIterator {
  try {
    yield put(setLoading());

    const { id, token } = action.payload;

    if (!id || !token) {
      throw new Error("User ID or authentication token is missing.");
    }

    const response: ApiResponse = yield call(apiRequest, {
      api: "",
      endpoint: `user/${id}`,
      method: "GET",
      token,
    });

    yield put(setUserById(response.user));
  } catch (error: unknown) {
    let message = "Failed to fetch user.";

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

export function* WatchGetUserById(): SagaIterator {
  yield takeLatest("FETCH-USER-BY-ID", getUserByIdSaga);
}
