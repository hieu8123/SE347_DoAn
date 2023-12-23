import { setSearchDataShow, setSearchValue } from "../slices/search";

export const actionSetSearchDataShow = (data) => (dispatch) => {
  dispatch(setSearchDataShow(data));
};

export const actionSetSearchValue = (data) => (dispatch) => {
  dispatch(setSearchValue(data));
};
