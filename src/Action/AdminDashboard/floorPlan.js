/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  INPROGRESS,
  LOGOUT,
  UPLOAD_FLOOR_PLAN,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";

export const uploadFloorPlan = async (FloorData, seatingTypeId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      var FormData = require("form-data");
      var data = new FormData();
      data.append("image", FloorData.image);
      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/outletseatingtype/" +
          seatingTypeId,
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPLOAD_FLOOR_PLAN,
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
