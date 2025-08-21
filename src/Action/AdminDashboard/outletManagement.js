/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  INPROGRESS,
  LOGOUT,
  ADD_OUTLET,
  DELETE_OUTLET,
  UPDATE_OUTLET,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";

export const addOutlet = async (outletData) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      var FormData = require("form-data");
      var data = new FormData();
      data.append("name", outletData.name);
      data.append("description", outletData.description);
      data.append("address1", outletData.address1);
      data.append("postcode", outletData.postcode);
      data.append("latitude", outletData.latitude);
      data.append("longitude", outletData.longitude);
      data.append("phone", `+${outletData.phone}`);
      data.append("email", outletData.email);
      data.append("googlePlaceId", outletData.googlePlaceId);
      data.append("gst", outletData.gst);
      data.append("rebookingTableInterval", outletData.rebookingTableInterval);
      data.append("timeSlotInterval", outletData.timeSlotInterval);
      data.append("timezone", outletData.timezone);
      data.append("allowOrder", outletData.allowOrder);
      data.append("allowBooking", outletData.allowBooking);
      data.append("companyId", outletData.companyId);
      data.append("image", outletData.image);
      data.append("paxSpacing", outletData.paxSpacing);
      data.append("ivrsPhoneNo", `+${outletData.ivrsPhoneNo}`);
      data.append("blockTime", outletData.blockTime);
      data.append("chopeName", outletData.chopeName);
      data.append("oddleName", outletData.oddleName);
      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/outlet ",
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 201) {
            dispatch({
              type: ADD_OUTLET,
              data: response.data,
            });
          }
        })
        .catch((error) => {
          if (error && error.response) {
            if (error.response.status === 401) {
              clearAccessToken();
              dispatch({
                type: LOGOUT,
              });
            } else {
              dispatch({
                type: ERROR,
                data: { error_msg: error.response.data.message },
              });
            }
          } else {
            dispatch({
              type: ERROR,
              data: { error_msg: error.message.toString() },
            });
          }
        });
    };
  } catch (error) {
    alert(error.message.toString());
  }
};

export const updateOutlet = async (outletData, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      var FormData = require("form-data");
      var data = new FormData();
      data.append("name", outletData.name);
      data.append("description", outletData.description);
      data.append("address1", outletData.address1);
      data.append("postcode", outletData.postcode);
      data.append("latitude", outletData.latitude);
      data.append("longitude", outletData.longitude);
      data.append("phone", outletData.phone);
      data.append("email", outletData.email);
      data.append("googlePlaceId", outletData.googlePlaceId);
      data.append("gst", outletData.gst);
      data.append("rebookingTableInterval", outletData.rebookingTableInterval);
      data.append("timeSlotInterval", outletData.timeSlotInterval);
      data.append("timezone", outletData.timezone);
      data.append("allowOrder", outletData.allowOrder);
      data.append("allowBooking", outletData.allowBooking);
      data.append("companyId", outletData.companyId);
      data.append("image", outletData.image);
      data.append("paxSpacing", outletData.paxSpacing);
      data.append("ivrsPhoneNo", outletData.ivrsPhoneNo);
      data.append("isActive", outletData.isActive);
      data.append("blockTime", outletData.blockTime);
      data.append("chopeName", outletData.chopeName);
      data.append("oddleName", outletData.oddleName);
      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/outlet/" + outletId,
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_OUTLET,
              data: response.data,
            });
          }
        })
        .catch((error) => {
          if (error && error.response) {
            if (error.response.status === 401) {
              clearAccessToken();
              dispatch({
                type: LOGOUT,
              });
            } else {
              dispatch({
                type: ERROR,
                data: { error_msg: error.response.data.message },
              });
            }
          } else {
            dispatch({
              type: ERROR,
              data: { error_msg: error.message.toString() },
            });
          }
        });
    };
  } catch (error) {
    alert(error.message.toString());
  }
};

export const deleteOutlet = async (outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      const api = {
        method: "DELETE",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/outlet/" + outletId,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: DELETE_OUTLET,
              data: response.data,
            });
          }
        })
        .catch((error) => {
          if (error && error.response) {
            if (error.response.status === 401) {
              clearAccessToken();
              dispatch({
                type: LOGOUT,
              });
            } else {
              dispatch({
                type: ERROR,
                data: { error_msg: error.response.data.message },
              });
            }
          } else {
            dispatch({
              type: ERROR,
              data: { error_msg: error.message.toString() },
            });
          }
        });
    };
  } catch (error) {
    alert(error.message.toString());
  }
};
