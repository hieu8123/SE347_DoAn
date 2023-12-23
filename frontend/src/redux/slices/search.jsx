import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchValue: "",
  searchData: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchDataShow: (state, action) => {
      state.searchData = action.payload;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
  },
});

export const { setSearchDataShow, setSearchValue } = searchSlice.actions;

export default searchSlice.reducer;
