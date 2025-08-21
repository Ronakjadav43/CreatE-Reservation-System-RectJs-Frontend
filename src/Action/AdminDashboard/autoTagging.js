/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  INPROGRESS,
  LOGOUT,
  GET_AUTO_TAGGING,
  ADD_AUTO_TAGGING,
  DELETE_AUTO_TAGGING,
  GET_CUSTOMER_LIST_TAGGING,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";
// import moment from "moment-timezone";

export const getAllAutoTagging = async (outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/autoTagging/outlet/" +
          outletId,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_AUTO_TAGGING,
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

export const addAutoTagging = async (data, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      // eslint-disable-next-line array-callback-return
      // data.criteria.map((criteria) => {
      //   if (
      //     criteria.displayName === "Birthday" &&
      //     criteria.criteria === "BETWEEN" &&
      //     criteria.displayCriteria === "Between"
      //   ) {
      //     criteria.value = {
      //       value1: criteria.value.value1,
      //       value2: criteria.value.value2,
      //       displayValue1: criteria.value.value1,
      //       displayValue2: criteria.value.value2,
      //     };
      //   }
      // });

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/autoTagging/outlet/" +
          outletId,
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 201) {
            dispatch({
              type: ADD_AUTO_TAGGING,
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

export const deleteAutoTagging = async (autoTaggingId, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "DELETE",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/autoTagging/" +
          autoTaggingId +
          "/outlet/" +
          outletId,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: DELETE_AUTO_TAGGING,
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

export const getCustomerListTagging = async (autoTaggingId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/autoTagging/" +
          autoTaggingId +
          "/customerlist",
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_CUSTOMER_LIST_TAGGING,
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
