/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  INPROGRESS,
  LOGOUT,
  GET_CLOSURES,
  ADD_CLOSURE,
  UPDATE_CLOSURE,
  DELETE_CLOSURE,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";

export const getClosures = async (outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/timeslotoverride/outlet/" +
          outletId,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_CLOSURES,
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

export const addClosure = async (data, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      if (!data.outletStatus) {
        delete data.openingTime;
        delete data.closingTime;
      }
      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/timeslotoverride/outlet/" +
          outletId,
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 201) {
            dispatch({
              type: ADD_CLOSURE,
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

export const updateClosure = async (data, closureId, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      if (!data.outletStatus) {
        data.openingTime = null;
        data.closingTime = null;
      }

      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/timeslotoverride/" +
          closureId +
          "/outlet/" +
          outletId,
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_CLOSURE,
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

export const deleteClosure = async (closureId, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      const api = {
        method: "DELETE",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/timeslotoverride/" +
          closureId +
          "/outlet/" +
          outletId,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: DELETE_CLOSURE,
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
