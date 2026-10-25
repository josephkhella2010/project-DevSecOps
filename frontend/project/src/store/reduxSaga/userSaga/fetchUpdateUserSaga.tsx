import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";

import { setUpdateUser } from "../../reduxSlice/UserSlice/UserSlice";
import {
  setLoading,
  setError,
  setSuccess,
  setClearLoading,
} from "../../reduxSlice/LoadingSlice/LoadingAndErrorSlice";
import { apiRequest } from "../../../utilities/HeaderFunction";

interface UpdateUserPayload {
  id: string;
  token: string;
  userPayload: {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  };
}

interface UpdateUserAction {
  type: string;
  payload: UpdateUserPayload;
}

function* updateUserSaga(action: UpdateUserAction): SagaIterator {
  try {
    yield put(setLoading());

    const { id, token, userPayload } = action.payload;

    const response = yield call(apiRequest, {
      api: "",
      endpoint: `update-user/${id}`,
      method: "PUT",
      token,
      body: userPayload,
    });

    const updatedUser = response.user;

    const loggedInUser = {
      userInfo: {
        id: String(updatedUser.id ?? id),
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      },
      token,
    };

    // Update localStorage while preserving the token.
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    // Update Redux state.
    yield put(
      setUpdateUser({
        userPayload: loggedInUser.userInfo,
        id: String(id),
      }),
    );

    yield put(setSuccess(true));
  } catch (error: unknown) {
    let message = "Failed to update user.";

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

export function* WatchUpdateUser(): SagaIterator {
  yield takeLatest("FETCH-UPDATE-USER", updateUserSaga);
}
