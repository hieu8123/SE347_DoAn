import axios from "axios";
import { server } from "../../server";
import {
  getAllOrdersUserRequest,
  getAllOrdersUserSuccess,
  getAllOrdersUserFailed,
  getAllOrdersShopRequest,
  getAllOrdersShopSuccess,
  getAllOrdersShopFailed,
  adminAllOrdersRequest,
  adminAllOrdersSuccess,
  adminAllOrdersFailed,
} from "../slices/order";

// Get all orders of a user
export const actionGetAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch(getAllOrdersUserRequest());
    const { data } = await axios.get(`${server}/order/get-all-orders/${userId}`);
    dispatch(getAllOrdersUserSuccess(data.orders));
  } catch (error) {
    dispatch(getAllOrdersUserFailed(error.response.data.message));
  }
};

// Get all orders of a shop
export const actionGetAllOrdersOfShop = (shopId) => async (dispatch) => {
  try {
    dispatch(getAllOrdersShopRequest());
    const { data } = await axios.get(`${server}/order/get-seller-all-orders/${shopId}`);
    dispatch(getAllOrdersShopSuccess(data.orders));
  } catch (error) {
    dispatch(getAllOrdersShopFailed(error.response.data.message));
  }
};

// Get all orders for admin
export const actionGetAllOrdersOfAdmin = () => async (dispatch) => {
  try {
    dispatch(adminAllOrdersRequest());
    const { data } = await axios.get(`${server}/order/admin-all-orders`, {
      withCredentials: true,
    });
    dispatch(adminAllOrdersSuccess(data.orders));
  } catch (error) {
    dispatch(adminAllOrdersFailed(error.response.data.message));
  }
};
