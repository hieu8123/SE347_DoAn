import axios from "axios";
import { server } from "../../server";
import {
  eventCreateRequest,
  eventCreateSuccess,
  eventCreateFail,
  getAlleventsShopRequest,
  getAlleventsShopSuccess,
  getAlleventsShopFailed,
  deleteeventRequest,
  deleteeventSuccess,
  deleteeventFailed,
  getAlleventsRequest,
  getAlleventsSuccess,
  getAlleventsFailed,
} from "../slices/event";

// Create event
export const actionCreateEvent = (newForm) => async (dispatch) => {
  try {
    dispatch(eventCreateRequest());
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.post(
      `${server}/event/create-event`,
      newForm,
      config
    );
    dispatch(eventCreateSuccess(data.event));
  } catch (error) {
    dispatch(eventCreateFail(error.response.data.message));
  }
};

// Get all events of a shop
export const actionGetAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch(getAlleventsShopRequest());

    const { data } = await axios.get(`${server}/event/get-all-events/${id}`);
    dispatch(getAlleventsShopSuccess(data.event));
  } catch (error) {
    dispatch(getAlleventsShopFailed(error.response.data.message));
  }
};

// Delete event of a shop
export const actionDeleteEvent = (id) => async (dispatch) => {
  try {
    dispatch(deleteeventRequest());

    const { data } = await axios.delete(
      `${server}/event/delete-shop-event/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch(deleteeventSuccess(data.message));
  } catch (error) {
    dispatch(deleteeventFailed(error.response.data.message));
  }
};

// Get all events
export const actionGetAllEvents = () => async (dispatch) => {
  try {
    dispatch(getAlleventsRequest());

    const { data } = await axios.get(`${server}/event/get-all-events`);
    dispatch(getAlleventsSuccess(data.events));
  } catch (error) {
    dispatch(getAlleventsFailed(error.response.data.message));
  }
};
