/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  GET_ALL_CUSTOMER_CROSS_REPORT,
  GET_ALL_CUSTOMER_REPORT,
  INPROGRESS,
  LOGOUT,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";
import moment from "moment-timezone";

export const getAllCustomerReports = async (customerReportData, companyID) => {
  try {
    return (dispatch) => {
      const mappCompany = [];
      customerReportData.companyIds.map((filterCompany) =>
        mappCompany.push(filterCompany.id)
      );

      let data;
      data = {
        ...customerReportData,
        fromDate: moment(customerReportData.fromDate).format("DD-MM-YYYY"),
        toDate: moment(customerReportData.toDate).format("DD-MM-YYYY"),
        companyIds: mappCompany,
      };
      dispatch({ type: INPROGRESS });
      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/report/customer",
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_ALL_CUSTOMER_REPORT,
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

export const getAllCustomerCrossReport = async (
  customerReportData,
  outlets
) => {
  try {
    return (dispatch) => {
      const mappCompany = [];
      customerReportData.companyIds.map((filterCompany) =>
        mappCompany.push(filterCompany.id)
      );

      let data;
      data = {
        ...customerReportData,
        fromDate: moment(customerReportData.fromDate).format("DD-MM-YYYY"),
        toDate: moment(customerReportData.toDate).format("DD-MM-YYYY"),
        outletIds: [outlets.outlet1, outlets.outlet2],
        companyIds: mappCompany,
      };

      dispatch({ type: INPROGRESS });
      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/report/customer",
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_ALL_CUSTOMER_CROSS_REPORT,
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
