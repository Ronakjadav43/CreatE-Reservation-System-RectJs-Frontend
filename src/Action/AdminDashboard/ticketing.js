/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  INPROGRESS,
  LOGOUT,
  GET_ALL_TICKET,
  ADD_TICKET,
  UPDATE_TICKET,
  DELETE_TICKET,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";

export const getAllTicket = async (outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/ticket/filter/outlet/" +
          outletId,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_ALL_TICKET,
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

export const addTicket = async (ticketData, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      var FormData = require("form-data");
      var data = new FormData();
      data.append("name", ticketData.name);
      data.append("description", ticketData.description);
      data.append("startDate", ticketData.startDate);
      data.append("endDate", ticketData.endDate);
      data.append("openingTime", ticketData.openingTime);
      data.append("closingTime", ticketData.closingTime);
      data.append("amount", ticketData.amount);
      data.append("noOfPerson", ticketData.noOfPerson);
      data.append("ticketMaxQuantity", ticketData.ticketMaxQuantity);
      data.append("timeSlotInterval", ticketData.timeSlotInterval);
      data.append("blockTable", ticketData.blockTable);
      data.append("blockSchedule", ticketData.blockSchedule);
      data.append("prePayment", ticketData.prePayment);
      data.append("image", ticketData.image);

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/ticket/outlet/" + outletId,
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 201) {
            dispatch({
              type: ADD_TICKET,
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

export const updateTicket = async (ticketData, ticketId, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      dispatch({ type: INPROGRESS });
      var FormData = require("form-data");
      var data = new FormData();
      data.append("name", ticketData.name);
      data.append("description", ticketData.description);
      data.append("startDate", ticketData.startDate);
      data.append("endDate", ticketData.endDate);
      data.append("openingTime", ticketData.openingTime);
      data.append("closingTime", ticketData.closingTime);
      data.append("amount", ticketData.amount);
      data.append("noOfPerson", ticketData.noOfPerson);
      data.append("ticketMaxQuantity", ticketData.ticketMaxQuantity);
      data.append("timeSlotInterval", ticketData.timeSlotInterval);
      data.append("blockTable", ticketData.blockTable);
      data.append("blockSchedule", ticketData.blockSchedule);
      data.append("prePayment", ticketData.prePayment);
      data.append("image", ticketData.image);
      data.append("isActive", ticketData.isActive);

      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/ticket/" +
          ticketId +
          "/outlet/" +
          outletId,
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_TICKET,
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

export const deleteTicket = async (ticketId, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      const api = {
        method: "DELETE",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/ticket/" +
          ticketId +
          "/outlet/" +
          outletId,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: DELETE_TICKET,
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
