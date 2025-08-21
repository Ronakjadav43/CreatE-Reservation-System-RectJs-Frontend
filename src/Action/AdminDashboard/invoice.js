/* eslint-disable no-unreachable */
import axios from "axios";
import {
  INPROGRESS,
  ERROR,
  GET_ALL_INVOICE_DETAILS,
  UPDATE_INVOICE_STATUS,
  GET_CUSTOMER_INVOICE,
  LOGOUT,
  GET_ALL_INVOICE_DETAILS_OF_LISTING_VIEW,
  GET_CHARGE_CUSTOMER_INVOICE,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";
import moment from "moment-timezone";

export const getAllInvoiceDetails = async (
  outletId,
  filterData,
  isFuture = false
) => {
  try {
    return (dispatch) => {
      let data;
      if (filterData) {
        data = {
          mealType: filterData.mealType === "All" ? "" : filterData.mealType,
          status: filterData.status === "ALL" ? "" : filterData.status,
          date: moment(filterData.date).format("DD-MM-YYYY"),
        };
      }
      dispatch({ type: INPROGRESS });
      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/invoice/outlet/" +
          outletId +
          "/" +
          isFuture,
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_ALL_INVOICE_DETAILS,
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

export const getAllInvoiceDetailsOfListingView = async (
  outletId,
  filterData,
  isFuture = false
) => {
  try {
    return (dispatch) => {
      let data;
      if (filterData) {
        data = {
          mealType: filterData.mealType === "All" ? "" : filterData.mealType,
          status: filterData.status === "ALL" ? "" : filterData.status,
          date: moment(filterData.date).format("DD-MM-YYYY"),
        };
      }
      dispatch({ type: INPROGRESS });
      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/invoice/outlet/" +
          outletId +
          "/" +
          isFuture,
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_ALL_INVOICE_DETAILS_OF_LISTING_VIEW,
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

export const getInvoice = async (invoiceId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      const api = {
        method: "GET",
        // headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/invoice/" + invoiceId,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_CUSTOMER_INVOICE,
              data: response.data.data,
            });
          }
        })
        .catch((error) => {
          if (error && error.response) {
            dispatch({
              type: ERROR,
              data: { error_msg: error.response.data.message },
            });
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

export const updateChargeInvoice = async (invoiceId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/invoice/" +
          invoiceId +
          "/charge",
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_CHARGE_CUSTOMER_INVOICE,
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

export const updateInvoiceStatus = async (data, invoiceId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      data.tableChangeRequest && delete data.tableChangeRequest.startDate;

      const requestPayload = {
        status: data.status,
        isCharge: data.isCharge,
        occasion: data.occasion,
        specialRequest: data.specialRequest,
        reservationNotes: data.reservationNotes,
        seatingPreference: data.seatingPreference,
        dietaryRestriction: data.dietaryRestriction,
        tableChangeRequest: data.tableChangeRequest,
      };

      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/invoice/" + invoiceId,
        data: requestPayload,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_INVOICE_STATUS,
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
