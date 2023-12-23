import axios from "axios";
import { server } from "../../server";
import { getAllSellersRequest, getAllSellersSuccess, getAllSellersFailed } from "../slices/seller";

export const actionGetAllSellers = () => async (dispatch) => {
  try {
    dispatch(getAllSellersRequest());

    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, {
      withCredentials: true,
    });

    dispatch(getAllSellersSuccess(data.sellers));
  } catch (error) {
    dispatch(getAllSellersFailed(error.response.data.message));
  }
};
