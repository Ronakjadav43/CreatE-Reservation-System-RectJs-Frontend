/* eslint-disable no-unreachable */
import axios from "axios";
import {
  INPROGRESS,
  GET_COMPANY_OUTLET,
  ERROR,
  GET_COMPANY,
  GET_TICKET_COMPANY_KEY,
} from "../../utils/Customer/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";

export const getCompany = async () => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      const api = {
        method: "GET",
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/company",
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_COMPANY,
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

export const getCompanyOutlets = async (key) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/company/" + key,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_COMPANY_OUTLET,
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

export const getTicketByCompanyKey = async (key) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/ticket/comapny/" + key,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_TICKET_COMPANY_KEY,
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

export const getOutletTimeslot = async (data) => {
  const requestPayload = {
    noOfPerson: data.noOfPerson,
    outletId: data.outletId,
    date: data.date,
    checkPax: false,
  };
  const api = {
    method: "POST",
    url: ENVIRONMENT_VARIABLES.Base_API_URL + "/common/timeslot",
    data: requestPayload,
  };
  return await axios(api);
};

export const getReservationTimeSlot = async (data, key) => {
  const requestPayload = {
    date: data.date,
    noOfPerson: data.noOfPerson,
    preferredTime: data.preferredTime,
    outletId: data.outletId,
    checkPax: false,
  };

  const api = {
    method: "POST",
    url: ENVIRONMENT_VARIABLES.Base_API_URL + "/reservation/step2/" + key,
    data: requestPayload,
  };
  return await axios(api);
};

export const getEventTimeSlot = async (data, ticketbookingId) => {
  const requestPayload = {
    date: data.date,
    noOfPerson: data.noOfPerson,
  };

  const api = {
    method: "POST",
    url:
      ENVIRONMENT_VARIABLES.Base_API_URL +
      "/ticketbooking/" +
      ticketbookingId +
      "/timeslot",
    data: requestPayload,
  };

  return await axios(api);
};
