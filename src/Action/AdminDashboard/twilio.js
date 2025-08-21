/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  INPROGRESS,
  LOGOUT,
  UPDATE_TWILIO_CONFIGRATION,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";

export const updateTwilio = async (data, companyID) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/company/" +
          companyID +
          "/mailchimp",
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_TWILIO_CONFIGRATION,
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
