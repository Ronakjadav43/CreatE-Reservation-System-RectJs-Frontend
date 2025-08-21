/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  INPROGRESS,
  LOGOUT,
  GET_PREORDERS,
  ADD_PREORDER,
  DELETE_PREORDER,
  UPDATE_PREORDER,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";

export const getPreOrders = async (outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/preorderitem/outlet/" +
          outletId,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_PREORDERS,
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

export const addPreOrder = async (preOrderData, outletId) => {
  try {
    return (dispatch) => {
      const filterSectionId = preOrderData.sectionId
        .filter((section) => section.isChecked)
        .map((filterSection) => filterSection.id);

      dispatch({ type: INPROGRESS });
      var FormData = require("form-data");
      var data = new FormData();
      data.append("image", preOrderData.image);
      data.append("name", preOrderData.name);
      data.append("sectionId", filterSectionId);
      data.append("price", preOrderData.price);
      data.append("dailyMaxQty", preOrderData.dailyMaxQty);
      data.append("bookingMaxQty", preOrderData.bookingMaxQty);
      data.append("originalPrice", preOrderData.originalPrice);
      data.append("description", preOrderData.description);

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/preorderitem/outlet/" +
          outletId,
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 201) {
            dispatch({
              type: ADD_PREORDER,
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

export const updatePreOrder = async (preOrderData, preOrderId, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      var FormData = require("form-data");
      var data = new FormData();
      data.append("image", preOrderData.image);
      data.append("name", preOrderData.name);
      data.append("sectionId", preOrderData.sectionId);
      data.append("price", preOrderData.price);
      data.append("dailyMaxQty", preOrderData.dailyMaxQty);
      data.append("bookingMaxQty", preOrderData.bookingMaxQty);
      data.append("originalPrice", preOrderData.originalPrice);
      data.append("description", preOrderData.description);
      data.append("isActive", preOrderData.isActive);

      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/preorderitem/" +
          preOrderId +
          "/outlet/" +
          outletId,
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_PREORDER,
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

export const deletePreOrder = async (preOrderId, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      const api = {
        method: "DELETE",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/preorderitem/" +
          preOrderId +
          "/outlet/" +
          outletId,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: DELETE_PREORDER,
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
