import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload;
      const isItemExist = state.wishlist.find((i) => i._id === item._id);

      if (isItemExist) {
        const updatedWishlist = state.wishlist.map((i) =>
          i._id === isItemExist._id ? item : i
        );
        state.wishlist = updatedWishlist;
      } else {
        state.wishlist.push(item);
      }
    },

    removeFromWishlist: (state, action) => {
      const itemIdToRemove = action.payload;
      state.wishlist = state.wishlist.filter((i) => i._id !== itemIdToRemove);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
