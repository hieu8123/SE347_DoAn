import axios from "axios";
import { server } from "../../server";
import {
  productCreateRequest,
  productCreateSuccess,
  productCreateFail,
  getAllProductsShopRequest,
  getAllProductsShopSuccess,
  getAllProductsShopFailed,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFailed,
  getAllProductsRequest,
  getAllProductsSuccess,
  getAllProductsFailed,
} from "../slices/product";

// Create product
export const actionCreateProduct = (newForm) => async (dispatch) => {
  try {
    dispatch(productCreateRequest());
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.post(
      `${server}/product/create-product`,
      newForm,
      config
    );
    dispatch(productCreateSuccess(data.product));
  } catch (error) {
    dispatch(productCreateFail(error.response.data.message));
  }
};

// Get all products of a shop
export const actionGetAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch(getAllProductsShopRequest());
    const { data } = await axios.get(
      `${server}/product/get-all-products-shop/${id}`
    );
    dispatch(getAllProductsShopSuccess(data.products));
  } catch (error) {
    dispatch(getAllProductsShopFailed(error.response.data.message));
  }
};

// Delete product of a shop
export const actionDeleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest());
    const { data } = await axios.delete(
      `${server}/product/delete-shop-product/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch(deleteProductSuccess(data.message));
  } catch (error) {
    dispatch(deleteProductFailed(error.response.data.message));
  }
};

// Get all products
export const actionGetAllProducts = () => async (dispatch) => {
  try {
    dispatch(getAllProductsRequest());
    const { data } = await axios.get(`${server}/product/get-all-products`);
    dispatch(getAllProductsSuccess(data.products));
  } catch (error) {
    dispatch(getAllProductsFailed(error.response.data.message));
  }
};
