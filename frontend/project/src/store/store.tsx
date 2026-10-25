import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import LoadAndErrorSliceReducer from "./reduxSlice/LoadingSlice/LoadingAndErrorSlice";
import rootSaga from "./reduxSaga/rootSaga";
import userSliceReducer from "./reduxSlice/UserSlice/UserSlice";
import productSliceReducer from "./reduxSlice/ProductSlice/ProductSlice";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    loadingSlice: LoadAndErrorSliceReducer,
    userSlice: userSliceReducer,
    productSlice: productSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
