import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";

import { apiRequest } from "../../../utilities/HeaderFunction.js";
import {
  setClearLoading,
  setError,
  setLoading,
  setSuccess,
} from "../../reduxSlice/LoadingSlice/LoadingAndErrorSlice.js";
import { setRegisterUser } from "../../reduxSlice/UserSlice/UserSlice.js";

interface RegisterPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

async function FetchApiUrl(payload: RegisterPayload) {
  console.log("Registration payload:", payload);

  const data = await apiRequest({
    api: "register-user",
    method: "POST",
    body: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      username: payload.username,
      email: payload.email,
      password: payload.password,
    },
  });

  return data.user;
}

function* FetchRegisterUser(action: {
  type: string;
  payload: RegisterPayload;
}): SagaIterator {
  try {
    yield put(setLoading());

    const user = yield call(FetchApiUrl, action.payload);

    yield put(setRegisterUser(user));
    yield put(setSuccess(true));
  } catch (error: unknown) {
    let message = "Registration failed. Please try again.";

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 409) {
        message = data?.error ?? "Username or email already exists.";
      } else if (status === 400 && Array.isArray(data?.details)) {
        message = data.details
          .map(
            (item: { field: string; message: string }) =>
              `${item.field}: ${item.message}`,
          )
          .join(", ");
      } else {
        message = data?.error ?? data?.message ?? message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    yield put(setError(message));
  } finally {
    yield put(setClearLoading());
  }
}

export function* WatchFetchRegisterUser(): SagaIterator {
  yield takeLatest("FETCH-REGISTER-USER", FetchRegisterUser);
}
