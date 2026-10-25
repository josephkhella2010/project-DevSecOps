import { all } from "redux-saga/effects";
import { WatchFetchGetUsers } from "./userSaga/fetchGetUsers";
import { WatchFetchRegisterUser } from "./userSaga/fetchRegisterUser";
import { WatchFetchGetProducts } from "./ProductSaga/fetchGetProducts";
import { WatchFetchGetProductById } from "./ProductSaga/fetchGetProductById";
import { WatchAddUserProduct } from "./ProductSaga/fetchAddUserProductSaga";
import { WatchLoginUser } from "./userSaga/fetchLoginSaga";
import { WatchDeleteUser } from "./userSaga/fetchDeleteUserSaga";
import { WatchUpdateUser } from "./userSaga/fetchUpdateUserSaga";
import { WatchGetUserById } from "./userSaga/fetchGetUserByIdSaga";
import { WatchDeleteUserProduct } from "./ProductSaga/fetchDeleteUserProductSaga";

export default function* RootSaga() {
  yield all([
    WatchFetchGetUsers(),
    WatchFetchRegisterUser(),
    WatchLoginUser(),
    WatchDeleteUser(),
    WatchUpdateUser(),
    WatchGetUserById(),
    WatchFetchGetProducts(),
    WatchFetchGetProductById(),
    WatchAddUserProduct(),
    WatchDeleteUserProduct(),
  ]);
}
