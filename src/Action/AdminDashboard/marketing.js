/* eslint-disable no-unreachable */
/* eslint-disable array-callback-return */
import axios from "axios";
import {
  ERROR,
  INPROGRESS,
  LOGOUT,
  GET_MARKETING,
  ADD_MARKETING,
  UPDATE_MARKETING,
  DELETE_MARKETING,
  GET_MEALTYPE_BY_COMPANY,
  GET_CUSTOMER_LIST,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";

export const getMarketing = async (companyId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/marketing/company/" +
          companyId,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_MARKETING,
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

export const addMarketing = async (data, companyId) => {
  try {
    delete data.criteria_value;
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      const mappTag = [];
      data.tags
        .filter((data) => data.isChecked)
        .map((tag) => mappTag.push({ id: tag.id, name: tag.name }));

      data = {
        ...data,
        tags: mappTag,
      };

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/marketing/company/" +
          companyId,
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 201) {
            dispatch({
              type: ADD_MARKETING,
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

export const updateMarketing = async (data, marketingId, companyId) => {
  try {
    return (dispatch) => {
      const mappTag = [];
      data.tags
        .filter((data) => data.isChecked)
        .map((tag) => mappTag.push({ id: tag.id, name: tag.name }));

      data = { ...data, tags: mappTag };
      delete data.criteria;

      dispatch({ type: INPROGRESS });

      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/marketing/" +
          marketingId +
          "/company/" +
          companyId,
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_MARKETING,
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

export const deleteMarketing = async (marketingId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "DELETE",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/marketing/" + marketingId,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: DELETE_MARKETING,
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

export const getMealTypeByCompany = async (
  companies,
  isMultipleCompanySelected
) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      let data;
      const mappCompany = [];
      if (isMultipleCompanySelected) {
        companies
          .filter((company) => company.isChecked && company.name !== "All")
          .map((filterCompany) => mappCompany.push(filterCompany.id));
      } else {
        mappCompany.push(companies);
      }

      data = {
        companyIds: mappCompany,
      };

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/section/company",
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_MEALTYPE_BY_COMPANY,
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

export const getCustomerList = async (marketingId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/marketing/" +
          marketingId +
          "/customerlist",
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_CUSTOMER_LIST,
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
