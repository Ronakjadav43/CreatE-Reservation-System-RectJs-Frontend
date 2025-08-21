/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  INPROGRESS,
  LOGOUT,
  GET_COMPANY,
  ADD_COMPANY,
  UPDATE_COMPANY,
  DELETE_COMPANY,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";

export const getCompany = async () => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/company",
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_COMPANY,
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

export const addCompany = async (companyData) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      var FormData = require("form-data");
      var data = new FormData();
      data.append("image", companyData.image);
      data.append("name", companyData.name);
      data.append("contentLanguage", companyData.contentLanguage);
      data.append("paymentTC", companyData.paymentTC);
      data.append("noPaymentTC", companyData.noPaymentTC);
      data.append("description", companyData.description);

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/company",
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 201) {
            dispatch({
              type: ADD_COMPANY,
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

export const editCompany = async (companyData, companyID) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      var FormData = require("form-data");
      var data = new FormData();
      data.append("image", companyData.image);
      data.append("name", companyData.name);
      data.append("contentLanguage", companyData.contentLanguage);
      data.append("paymentTC", companyData.paymentTC);
      data.append("noPaymentTC", companyData.noPaymentTC);
      data.append("description", companyData.description);
      data.append("isActive", companyData.isActive);

      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/company/" + companyID,
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_COMPANY,
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

export const deleteCompany = async (companyId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "DELETE",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/company/" + companyId,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: DELETE_COMPANY,
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
