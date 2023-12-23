import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  loading: false, // Corrected typo
  addressloading: false,
  usersLoading: false,
  user: null,
  successMessage: null,
  users: [],
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    LoadUserRequest: (state) => {
      state.loading = true;
    },
    LoadUserSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    },
    LoadUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // update user information
    updateUserInfoRequest: (state) => {
      state.loading = true;
    },
    updateUserInfoSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    updateUserInfoFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // update user address
    updateUserAddressRequest: (state) => {
      state.addressloading = true;
    },
    updateUserAddressSuccess: (state, action) => {
      state.addressloading = false;
      state.successMessage = action.payload.successMessage;
      state.user = action.payload.user;
    },
    updateUserAddressFailed: (state, action) => {
      state.addressloading = false;
      state.error = action.payload;
    },

    // delete user address
    deleteUserAddressRequest: (state) => {
      state.addressloading = true;
    },
    deleteUserAddressSuccess: (state, action) => {
      state.addressloading = false;
      state.successMessage = action.payload.successMessage;
      state.user = action.payload.user;
    },
    deleteUserAddressFailed: (state, action) => {
      state.addressloading = false;
      state.error = action.payload;
    },

    // get all users --- admin
    getAllUsersRequest: (state) => {
      state.usersLoading = true;
    },
    getAllUsersSuccess: (state, action) => {
      state.usersLoading = false;
      state.users = action.payload;
    },
    getAllUsersFailed: (state, action) => {
      state.usersLoading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.successMessage = null;
    },
  },
});
export const {
  LoadUserRequest,
  LoadUserSuccess,
  LoadUserFail,
  updateUserInfoRequest,
  updateUserInfoSuccess,
  updateUserInfoFailed,
  updateUserAddressRequest,
  updateUserAddressSuccess,
  updateUserAddressFailed,
  deleteUserAddressRequest,
  deleteUserAddressSuccess,
  deleteUserAddressFailed,
  getAllUsersRequest,
  getAllUsersSuccess,
  getAllUsersFailed,
  clearErrors,
  clearMessages,
} = userSlice.actions;

export default userSlice.reducer;
