/* eslint-disable no-unreachable */
import axios from "axios";
import moment from "moment-timezone";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";
import {
  ERROR,
  GET_BOOKING_EVENT,
  GET_BOOKING_TABLE,
  GET_TABLE_SECTION,
  INPROGRESS,
  LOGOUT,
} from "../../utils/AdminDashboard/Constant";

export const getTimeSlot = async (data) => {
  const requestPayload = {
    date: data.date,
    noOfPerson: data.noOfPerson,
    outletId: data.outletId,
    checkPax: data.checkPax,
  };

  const api = {
    method: "POST",
    headers: { Authorization: getAccessToken() },
    url: ENVIRONMENT_VARIABLES.Base_API_URL + "/common/timeslot/",
    data: requestPayload,
  };

  return await axios(api);
};

export const getBookingTable = async (data, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const requestPayload = {
        noOfPerson: data.noOfPerson,
        startTime: data.startTime,
        outletSeatingTypeId: data.outletSeatingTypeId,
        date: moment(data.date).format("DD-MM-YYYY"),
      };

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/booking/outlet/" + outletId,
        data: requestPayload,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_BOOKING_TABLE,
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

export const getSectionTables = async (seatingTypeId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      const api = {
        method: "GET",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/tablesection/seatingtype/" +
          seatingTypeId,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_TABLE_SECTION,
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

export const getBookingEvent = async (data, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      const requestPayload = {
        noOfPerson: data.noOfPerson,
        startTime: data.startTime,
        endTime: data.endTime,
        outletSeatingTypeId: data.outletSeatingTypeId,
        startDate: data.startDate,
        endDate: data.endDate,
      };

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/booking/private/outlet/" +
          outletId,
        data: requestPayload,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_BOOKING_EVENT,
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

export const getBookingReservation = async (data, outletId) => {
  const requestPayload = {
    noOfPerson: data.noOfPerson,
    startTime: data.startTime,
    name: data.name,
    lastName: data.lastName,
    email: data.email,
    mobileNo: data.mobileNo,
    bookingType: data.bookingType,
    specialRequest: data.specialRequest,
    outletTables: data.outletTables,
    date: moment(data.date).format("DD-MM-YYYY"),
  };

  const api = {
    method: "POST",
    headers: { Authorization: getAccessToken() },
    url:
      ENVIRONMENT_VARIABLES.Base_API_URL +
      "/booking/reservation/outlet/" +
      outletId,
    data: requestPayload,
  };
  return await axios(api);
};

export const createBookingReservationEvent = async (
  reservationData,
  outletId
) => {
  delete reservationData.outletId;
  delete reservationData.outlet;
  delete reservationData.description;
  delete reservationData.date;
  delete reservationData.time;
  delete reservationData.amount;
  delete reservationData.maxEventPax;
  delete reservationData.outletSeatingTypeId;

  var FormData = require("form-data");
  var data = new FormData();
  data.append("noOfPerson", reservationData.noOfPerson);
  data.append("price", reservationData.price);
  data.append("startDate", reservationData.startDate);
  data.append("endDate", reservationData.endDate);
  data.append("startTime", reservationData.startTime);
  data.append("endTime", reservationData.endTime);
  data.append("name", reservationData.name);
  data.append("lastName", reservationData.lastName);
  data.append("mealType", reservationData.mealSession);
  reservationData.email && data.append("email", reservationData.email);
  data.append("mobileNo", reservationData.mobileNo);
  data.append("bookingType", reservationData.bookingType);
  data.append("specialRequest", reservationData.specialRequest);
  data.append("outletTables", reservationData.outletTables);

  reservationData.image.map((img) => data.append("image", img));

  const api = {
    method: "POST",
    headers: { Authorization: getAccessToken() },
    url:
      ENVIRONMENT_VARIABLES.Base_API_URL +
      "/booking/private/reservation/outlet/" +
      outletId,
    data,
  };
  return await axios(api);
};
