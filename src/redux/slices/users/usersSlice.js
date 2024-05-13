import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalActions";

const initialState = {
  loading: false,
  error: null,
  users: [],
  user: null,
  profile: {},
  userAuth: {
    loading: false,
    error: null,
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
  },
};

export const registerUserAction = createAsyncThunk(
  "users/register",
  async ({ fullName, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${baseURL}/users/register`, {
        fullName,
        email,
        password,
      });
      return data;
    } catch (error) {
      console.error("Error registering user:", error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const updateUserShippingAddressAction = createAsyncThunk(
  "users/update-shipping-address",
  async (
    { firstName, lastName, address, city, postalCode, province, phone, country },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getState().users.userAuth.userInfo.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${baseURL}/users/update/shipping`,
        {
          firstName,
          lastName,
          address,
          city,
          postalCode,
          province,
          phone,
          country,
        },
        config
      );
      return data;
    } catch (error) {
      console.error("Error updating shipping address:", error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const getUserProfileAction = createAsyncThunk(
  "users/profile-fetched",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().users.userAuth.userInfo?.token;
      if (!token) {
        return rejectWithValue("No token found");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${baseURL}/users/profile`, config);
      return data;
    } catch (error) {
      console.log("Error fetching user profile");
    }
  });
export const loginUserAction = createAsyncThunk(
  "users/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${baseURL}/users/login`, {
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Error logging in:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutAction = createAsyncThunk("users/logout", async () => {
  localStorage.removeItem("userInfo");
  return true;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAction.pending, (state) => {
        state.userAuth.loading = true;
      })
      .addCase(loginUserAction.fulfilled, (state, action) => {
        state.userAuth.userInfo = action.payload;
        console.log(action.payload);
        state.userAuth.loading = false;
      })
      .addCase(loginUserAction.rejected, (state, action) => {
        state.userAuth.error = action.payload;
        state.userAuth.loading = false;
      })
      .addCase(registerUserAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUserAction.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(registerUserAction.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.userAuth.userInfo = null;
      })
      .addCase(getUserProfileAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfileAction.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(getUserProfileAction.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        console.error("Error fetching user profile:", action.error);
      })
      .addCase(
        updateUserShippingAddressAction.pending,
        (state, action) => {
          state.loading = true;
        }
      )
      .addCase(
        updateUserShippingAddressAction.fulfilled,
        (state, action) => {
          state.user = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        updateUserShippingAddressAction.rejected,
        (state, action) => {
          state.error = action.payload;
          state.loading = false;
        }
      )
      .addCase(resetErrAction.pending, (state) => {
        state.error = null;
      });
  },
});

export const selectUser = (state) => state.users.user;
export const selectLoading = (state) => state.users.loading;
export const selectError = (state) => state.users.error;

const usersReducer = usersSlice.reducer;

export default usersReducer;
