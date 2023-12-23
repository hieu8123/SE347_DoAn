import { addToWishlist, removeFromWishlist } from "../slices/wishlist";

export const actionAddToWishlist = (data) => (dispatch, getState) => {
  dispatch(addToWishlist(data));

  const updatedWishlist = getState().wishlist.wishlist;
  localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));

  return data;
};

export const actionRemoveFromWishlist = (data) => (dispatch, getState) => {
  dispatch(removeFromWishlist(data._id));

  const updatedWishlist = getState().wishlist.wishlist;
  localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));

  return data;
};
