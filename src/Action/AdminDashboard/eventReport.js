/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  GET_CUSTOMER_EVENT_REPORT,
  GET_CUSTOMER_SINGLE_RESERVATION,
  INPROGRESS,
  LOGOUT,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";
import moment from "moment-timezone";

export const getCustomerEventReports = async (customerReportData, mealType) => {
  try {
    return (dispatch) => {
      let data;
      if (customerReportData) {
        const mappMealType = [];
        mealType
          .filter((mealType) => mealType.isChecked)
          .map((selectedMealType) => mappMealType.push(selectedMealType.name));

        const mappCompany = [];
        customerReportData.companyIds.map((filterCompany) =>
          mappCompany.push(filterCompany.id)
        );

        data = {
          ...customerReportData,
          fromDate: moment(customerReportData.fromDate).format("DD-MM-YYYY"),
          toDate: moment(customerReportData.toDate).format("DD-MM-YYYY"),
          mealType: mappMealType,
          companyIds: mappCompany,
        };
      }

      delete data.filter;
      delete data.outletId;

      dispatch({ type: INPROGRESS });
      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/report/event/group",
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_CUSTOMER_EVENT_REPORT,
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
    // eslint-disable-next-line no-unreachable
  } catch (error) {
    alert(error.message.toString());
  }
};

export const getCustomerSingleReservation = async (
  customerReportData,
  mealType
) => {
  try {
    return (dispatch) => {
      let data;
      if (customerReportData) {
        const mappMealType = [];
        mealType
          .filter((mealType) => mealType.isChecked)
          .map((selectedMealType) => mappMealType.push(selectedMealType.name));

        data = {
          ...customerReportData,
          fromDate: moment(customerReportData.fromDate).format("DD-MM-YYYY"),
          toDate: moment(customerReportData.toDate).format("DD-MM-YYYY"),
          mealType: mappMealType,
          outletId: customerReportData.outletId.outlet.id,
        };
      }

      delete data.filter;
      delete data.companyIds;

      dispatch({ type: INPROGRESS });
      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/report/event/single",
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_CUSTOMER_SINGLE_RESERVATION,
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
