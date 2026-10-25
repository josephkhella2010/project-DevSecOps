/* import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserType } from "../../../utilities/interfaces.js";

interface LoggedInUserType {
  userInfo: UserType;
  token: string;
}

interface InitialStateType {
  users: UserType[];
  user: LoggedInUserType | null;
  userById: UserType | null;
}

const getStoredUser = (): LoggedInUserType | null => {
  try {
    const storedUser = localStorage.getItem("user");

    return storedUser ? (JSON.parse(storedUser) as LoggedInUserType) : null;
  } catch {
    return null;
  }
};

const initialState: InitialStateType = {
  users: [],
  user: getStoredUser(),
  userById: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,

  reducers: {
    setUsers: (state, action: PayloadAction<UserType[]>) => {
      state.users = action.payload;
    },
    setUserById: (state, action: PayloadAction<UserType>) => {
      state.userById = action.payload;
    },

    setRegisterUser: (state, action: PayloadAction<UserType>) => {
      state.users.push(action.payload);
    },

    setLoginUser: (state, action: PayloadAction<LoggedInUserType>) => {
      state.user = action.payload;
    },

    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    setDeleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(
        (user) => String(user._id ?? user.id) !== action.payload,
      );
      state.user = null;
      localStorage.removeItem("user");
    },
    setUpdateUser: (
      state,
      action: PayloadAction<{ userPayload: UserType; id: string }>,
    ) => {
      const { userPayload, id } = action.payload;

      const findUserIndex = state.users.findIndex(
        (u) => String(u._id ?? u.id) === id,
      );
      if (findUserIndex !== -1) {
        state.users[findUserIndex] = { ...userPayload };
      }
      if (
        state.user &&
        String(state.user.userInfo.id ?? state.user.userInfo._id) === id
      ) {
        state.user.userInfo = {
          ...state.user.userInfo,
          ...userPayload,
        };
      }
    },
  },
});

export const {
  setUsers,
  setRegisterUser,
  setLoginUser,
  logoutUser,
  setDeleteUser,
  setUpdateUser,
  setUserById,
} = userSlice.actions;

export default userSlice.reducer;
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductType, UserType } from "../../../utilities/interfaces.js";

interface LoggedInUserType {
  userInfo: UserType;
  token: string;
}

interface InitialStateType {
  users: UserType[];
  user: LoggedInUserType | null;
  userById: UserType | null;
}

const getStoredUser = (): LoggedInUserType | null => {
  try {
    const storedUser = localStorage.getItem("user");

    return storedUser ? (JSON.parse(storedUser) as LoggedInUserType) : null;
  } catch {
    return null;
  }
};

const initialState: InitialStateType = {
  users: [],
  user: getStoredUser(),
  userById: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,

  reducers: {
    setUsers: (state, action: PayloadAction<UserType[]>) => {
      state.users = action.payload;
    },

    setUserById: (state, action: PayloadAction<UserType>) => {
      state.userById = action.payload;
    },

    setRegisterUser: (state, action: PayloadAction<UserType>) => {
      state.users.push(action.payload);
    },
    setLoginUser: (state, action: PayloadAction<LoggedInUserType>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    logoutUser: (state) => {
      // Preserve the user's products separately before clearing the session.
      try {
        const products = state.user?.userInfo.products ?? [];
        localStorage.setItem("cartProducts", JSON.stringify(products));
      } catch (error) {
        console.error("Failed to preserve cart products:", error);
      }

      state.user = null;
      localStorage.removeItem("user");
    },

    setDeleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(
        (user) => String(user._id ?? user.id) !== action.payload,
      );

      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("cartProducts");
    },

    setUpdateUser: (
      state,
      action: PayloadAction<{ userPayload: UserType; id: string }>,
    ) => {
      const { userPayload, id } = action.payload;

      const findUserIndex = state.users.findIndex(
        (user) => String(user._id ?? user.id) === id,
      );

      if (findUserIndex !== -1) {
        state.users[findUserIndex] = { ...userPayload };
      }

      if (
        state.user &&
        String(state.user.userInfo.id ?? state.user.userInfo._id) === id
      ) {
        state.user.userInfo = {
          ...state.user.userInfo,
          ...userPayload,
        };

        try {
          localStorage.setItem("user", JSON.stringify(state.user));
        } catch (error) {
          console.error("Failed to save updated user:", error);
        }
      }
    },
    setUpdateUserProducts: (state, action: PayloadAction<ProductType[]>) => {
      if (!state.user) return;

      state.user.userInfo = {
        ...state.user.userInfo,
        products: action.payload,
      };

      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const {
  setUsers,
  setRegisterUser,
  setLoginUser,
  logoutUser,
  setDeleteUser,
  setUpdateUser,
  setUserById,
  setUpdateUserProducts,
} = userSlice.actions;

export default userSlice.reducer;
