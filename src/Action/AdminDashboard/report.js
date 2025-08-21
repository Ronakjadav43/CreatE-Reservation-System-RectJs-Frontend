import axios from "axios";
import {
  ERROR,
  GET_ALL_REPORT,
  INPROGRESS,
  LOGOUT,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";
import moment from "moment-timezone";

export const getAllReports = async (reportData) => {
  try {
    return (dispatch) => {
      let data;
      if (reportData) {
        const mappTag = [];
        reportData.bookingType
          .filter((data) => data.isChecked)
          .map((tag) => mappTag.push(tag.name));

        const mappMealType = [];
        reportData.mealType
          .filter((mealType) => mealType.isChecked)
          .map((selectedMealType) => mappMealType.push(selectedMealType.name));

        const mappStatus = [];
        reportData.status
          .filter((mealType) => mealType.isChecked)
          .map((selectedStatus) => mappStatus.push(selectedStatus.id));

        const mappCompany = [];
        reportData.companyIds.map((filterCompany) =>
          mappCompany.push(filterCompany.id)
        );

        data = {
          ...reportData,
          fromDate:
            reportData.filter.id === "UPCOMING"
              ? moment(reportData.fromDate).format("DD-MM-YYYY")
              : moment(new Date()).format("DD-MM-YYYY") ===
                moment(reportData.fromDate).format("DD-MM-YYYY")
              ? moment(reportData.fromDate).format("DD-MM-YYYY")
              : moment(reportData.fromDate).format("DD-MM-YYYY"),

          toDate:
            reportData.filter.id === "UPCOMING"
              ? moment(reportData.toDate).format("DD-MM-YYYY")
              : moment(new Date()).format("DD-MM-YYYY") ===
                moment(reportData.toDate).format("DD-MM-YYYY")
              ? moment(reportData.toDate).format("DD-MM-YYYY")
              : moment(reportData.toDate).format("DD-MM-YYYY"),
          status: mappStatus,
          mealType: mappMealType,
          bookingType: mappTag,
          filter: reportData.filter.id,
          companyIds: mappCompany,
        };
      }

      dispatch({ type: INPROGRESS });
      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/report/reservation",
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_ALL_REPORT,
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
