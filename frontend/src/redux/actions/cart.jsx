import { addToCart, removeFromCart } from "../slices/cart";

export const actionAddToCart = (data) => (dispatch, getState) => {
  dispatch(addToCart(data));

  const updatedCart = getState().cart.cart;
  localStorage.setItem("cartItems", JSON.stringify(updatedCart));

  return data;
};

export const actionRemoveFromCart = (data) => (dispatch, getState) => {
  dispatch(removeFromCart(data._id));

  const updatedCart = getState().cart.cart;
  localStorage.setItem("cartItems", JSON.stringify(updatedCart));

  return data;
};
