/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  INPROGRESS,
  LOGOUT,
  GET_SEATING_VIEW,
  UPDATE_SEATING_TABLE,
  MOVE_SEATING_RESERVATION,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";
import moment from "moment-timezone";

export const getSeatingView = async (outletId, filterData) => {
  try {
    return (dispatch) => {
      let data = filterData;
      if (filterData) {
        data = {
          ...filterData,
          mealType: filterData.mealType === "All" ? "" : filterData.mealType,
          date: moment(data.date).format("DD-MM-YYYY"),
        };
      }
      dispatch({ type: INPROGRESS });
      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/seatingview/outlet/" +
          outletId,
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_SEATING_VIEW,
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

export const newBookingReservation = async (data, outletId) => {
  try {
    return (dispatch) => {
      let requestPayload = {
        bookingType: data.bookingType,
        email: data.email,
        lastName: data.lastName,
        mobileNo: data.mobileNo,
        name: data.name,
        noOfPerson: data.noOfPerson,
        outletTables: data.outletTables,
        specialRequest: data.specialRequest,
        startTime: data.startTime,
      };

      if (data.reservationType === "reservation") {
        requestPayload.date = moment(data.date).format("DD-MM-YYYY");
      }

      dispatch({ type: INPROGRESS });

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/seatingview/reservation/outlet/" +
          outletId,
        data: requestPayload,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_SEATING_TABLE,
              data: response.data,
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

export const updateSeatingTable = async (outletId, seatingTableData) => {
  try {
    return (dispatch) => {
      const data = {
        ...seatingTableData,
        date: moment(seatingTableData.date).format("DD-MM-YYYY"),
      };

      dispatch({ type: INPROGRESS });
      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/seatingview/outlet/" +
          outletId,
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_SEATING_TABLE,
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

export const moveTableReservation = async (outletId, tableListForMove) => {
  try {
    return (dispatch) => {
      const data = {
        outletTableBookingId:
          tableListForMove?.tableListForMove[0]?.OutletTableBooking[0]?.id,
        toOutleTableId: tableListForMove?.tableListForMove[1]?.id,
        date: moment(tableListForMove.date).format("DD-MM-YYYY"),
      };
      dispatch({ type: INPROGRESS });
      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/seatingview/move/outlet/" +
          outletId,
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: MOVE_SEATING_RESERVATION,
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
