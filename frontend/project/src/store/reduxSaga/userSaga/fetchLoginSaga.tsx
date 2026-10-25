/* import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";

import { apiRequest } from "../../../utilities/HeaderFunction.js";
import {
  setClearLoading,
  setError,
  setLoading,
  setSuccess,
} from "../../reduxSlice/LoadingSlice/LoadingAndErrorSlice.js";
import { setLoginUser } from "../../reduxSlice/UserSlice/UserSlice.js";
import type { UserType } from "../../../utilities/interfaces.js";

interface LoginPayload {
  login: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: UserType;
}

interface LoggedInUserType {
  userInfo: UserType;
  token: string;
}

interface LoginAction {
  type: string;
  payload: LoginPayload;
}

async function fetchLoginApi(payload: LoginPayload): Promise<LoginResponse> {
  return apiRequest({
    api: "login",
    method: "POST",
    body: payload,
  });
}

function* fetchLoginUser(action: LoginAction): SagaIterator {
  try {
    yield put(setLoading());

    const data: LoginResponse = yield call(fetchLoginApi, action.payload);

    if (!data?.token || !data?.user) {
      throw new Error("Invalid login response from server.");
    }

    const loggedInUser: LoggedInUserType = {
      userInfo: data.user,
      token: data.token,
    };

    // Store the combined user object.
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    // Update Redux.
    yield put(setLoginUser(loggedInUser));
    yield put(setSuccess(true));
  } catch (error: unknown) {
    let message = "Login failed. Please try again.";

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;

      message = responseData?.error ?? responseData?.message ?? message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    yield put(setError(message));
  } finally {
    yield put(setClearLoading());
  }
}

export function* WatchLoginUser(): SagaIterator {
  yield takeLatest("FETCH-LOGIN-USER", fetchLoginUser);
}
 */

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

import { setLoginUser } from "../../reduxSlice/UserSlice/UserSlice.js";

import type { UserType, ProductsType } from "../../../utilities/interfaces.js";

interface LoginPayload {
  login: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: UserType & {
    products?: ProductsType[];
  };
}

interface LoggedInUserType {
  userInfo: UserType & {
    products?: ProductsType[];
  };
  token: string;
}

interface LoginAction {
  type: string;
  payload: LoginPayload;
}

async function fetchLoginApi(payload: LoginPayload): Promise<LoginResponse> {
  return apiRequest({
    api: "login",
    method: "POST",
    body: payload,
  });
}

function* fetchLoginUser(action: LoginAction): SagaIterator {
  try {
    yield put(setLoading());

    const data: LoginResponse = yield call(fetchLoginApi, action.payload);

    if (!data?.token || !data?.user) {
      throw new Error("Invalid login response from server.");
    }

    // Confirm the backend returns populated products.
    console.log("Products from login API:", data.user.products);

    const loggedInUser: LoggedInUserType = {
      userInfo: {
        ...data.user,
        products: data.user.products ?? [],
      },
      token: data.token,
    };

    // Update Redux.
    yield put(setLoginUser(loggedInUser));

    yield put(setSuccess(true));
  } catch (error: unknown) {
    let message = "Login failed. Please try again.";

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;

      message = responseData?.error ?? responseData?.message ?? message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    yield put(setError(message));
  } finally {
    yield put(setClearLoading());
  }
}

export function* WatchLoginUser(): SagaIterator {
  yield takeLatest("FETCH-LOGIN-USER", fetchLoginUser);
}
