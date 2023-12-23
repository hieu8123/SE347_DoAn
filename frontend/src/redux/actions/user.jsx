import axios from "axios";
import { server } from "../../server";
import {
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
} from "../slices/user";
import {
  LoadSellerRequest,
  LoadSellerSuccess,
  LoadSellerFail,
} from "../slices/seller";

// Load user
export const actionLoadUser = () => async (dispatch) => {
  try {
    dispatch(LoadUserRequest());
    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });
    dispatch(LoadUserSuccess(data.user));
  } catch (error) {
    dispatch(LoadUserFail(error.response.data.message));
  }
};

// Load seller
export const actionLoadSeller = () => async (dispatch) => {
  try {
    dispatch(LoadSellerRequest());
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });
    dispatch(LoadSellerSuccess(data.seller));
  } catch (error) {
    dispatch(LoadSellerFail(error.response.data.message));
  }
};

// Update user information
export const actionUpdateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch) => {
    try {
      dispatch(updateUserInfoRequest());
      const { data } = await axios.put(
        `${server}/user/update-user-info`,
        {
          email,
          password,
          phoneNumber,
          name,
        },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Credentials": true,
          },
        }
      );

      dispatch(updateUserInfoSuccess(data.user));
    } catch (error) {
      dispatch(updateUserInfoFailed(error.response.data.message));
    }
  };

// Update user address
export const actionUpdateUserAddress =
  (country, city, address1, address2, zipCode, addressType) =>
  async (dispatch) => {
    try {
      dispatch(updateUserAddressRequest());
      const { data } = await axios.put(
        `${server}/user/update-user-addresses`,
        {
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType,
        },
        { withCredentials: true }
      );

      dispatch(
        updateUserAddressSuccess({
          successMessage: "Cập nhật địa chỉ thành công!",
          user: data.user,
        })
      );
    } catch (error) {
      dispatch(updateUserAddressFailed(error.response.data.message));
    }
  };

// Delete user address
export const actionDeleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch(deleteUserAddressRequest());
    const { data } = await axios.delete(
      `${server}/user/delete-user-address/${id}`,
      { withCredentials: true }
    );

    dispatch(
      deleteUserAddressSuccess({
        successMessage: "User deleted successfully!",
        user: data.user,
      })
    );
  } catch (error) {
    dispatch(deleteUserAddressFailed(error.response.data.message));
  }
};

// Get all users (admin)
export const actionGetAllUsers = () => async (dispatch) => {
  try {
    dispatch(getAllUsersRequest());
    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch(getAllUsersSuccess(data.users));
  } catch (error) {
    dispatch(getAllUsersFailed(error.response.data.message));
  }
};
