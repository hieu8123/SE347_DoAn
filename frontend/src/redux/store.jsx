import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import sellerReducer from "./slices/seller";
import productReducer from "./slices/product";
import eventReducer from "./slices/event";
import cartReducer from "./slices/cart";
import wishlistReducer from "./slices/wishlist";
import orderReducer from "./slices/order";
import searchReducer from "./slices/search";

const store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    products: productReducer,
    events: eventReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    search: searchReducer,
  },
});

export default store;
