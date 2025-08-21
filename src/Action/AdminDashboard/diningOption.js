/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  INPROGRESS,
  LOGOUT,
  GET_DINING_OPTION,
  ADD_DINING_OPTION,
  UPDATE_DINING_OPTION,
  DELETE_DINING_OPTION,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";

export const getDiningOption = async (outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/diningoption/filter/outlet/" +
          outletId,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_DINING_OPTION,
              data: response.data.data,
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

export const addDiningOption = async (diningOptionData, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      var FormData = require("form-data");
      var data = new FormData();
      data.append("image", diningOptionData.image);
      data.append("name", diningOptionData.name);
      data.append("price", diningOptionData.price);
      data.append("dailyMaxQty", diningOptionData.dailyMaxQty);
      data.append("bookingMaxQty", diningOptionData.bookingMaxQty);
      data.append("description", diningOptionData.description);
      data.append("originalPrice", diningOptionData.originalPrice);

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/diningoption/outlet/" +
          outletId,
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 201) {
            dispatch({
              type: ADD_DINING_OPTION,
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

export const updateDiningOption = async (
  diningOptionData,
  diningOptionId,
  outletId
) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      var FormData = require("form-data");
      var data = new FormData();
      data.append("image", diningOptionData.image);
      data.append("name", diningOptionData.name);
      data.append("price", diningOptionData.price);
      data.append("dailyMaxQty", diningOptionData.dailyMaxQty);
      data.append("bookingMaxQty", diningOptionData.bookingMaxQty);
      data.append("description", diningOptionData.description);
      data.append("isActive", diningOptionData.isActive);
      data.append("originalPrice", diningOptionData.originalPrice);

      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/diningoption/" +
          diningOptionId +
          "/outlet/" +
          outletId,
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_DINING_OPTION,
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

export const deleteDiningOption = async (diningOptionId, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      const api = {
        method: "DELETE",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/diningoption/" +
          diningOptionId +
          "/outlet/" +
          outletId,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: DELETE_DINING_OPTION,
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
