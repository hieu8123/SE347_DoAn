import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  adminOrderLoading: false,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // get all orders of user
    getAllOrdersUserRequest: (state) => {
      state.isLoading = true;
    },
    getAllOrdersUserSuccess: (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    },
    getAllOrdersUserFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // get all orders of shop
    getAllOrdersShopRequest: (state) => {
      state.isLoading = true;
    },
    getAllOrdersShopSuccess: (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    },
    getAllOrdersShopFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // get all orders for admin
    adminAllOrdersRequest: (state) => {
      state.adminOrderLoading = true;
    },
    adminAllOrdersSuccess: (state, action) => {
      state.adminOrderLoading = false;
      state.adminOrders = action.payload;
    },
    adminAllOrdersFailed: (state, action) => {
      state.adminOrderLoading = false;
      state.error = action.payload;
    },

    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
  getAllOrdersUserRequest,
  getAllOrdersUserSuccess,
  getAllOrdersUserFailed,
  getAllOrdersShopRequest,
  getAllOrdersShopSuccess,
  getAllOrdersShopFailed,
  adminAllOrdersRequest,
  adminAllOrdersSuccess,
  adminAllOrdersFailed,
  clearErrors,
} = orderSlice.actions;

export default orderSlice.reducer;
