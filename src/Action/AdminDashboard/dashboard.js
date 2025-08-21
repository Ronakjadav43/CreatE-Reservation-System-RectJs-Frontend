/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  INPROGRESS,
  LOGOUT,
  GET_OUTLETS,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";

export const getOutlets = async () => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = [
        axios({
          method: "GET",
          headers: { Authorization: getAccessToken() },
          url: ENVIRONMENT_VARIABLES.Base_API_URL + "/outlet",
        }),
        axios({
          method: "GET",
          headers: { Authorization: getAccessToken() },
          url: ENVIRONMENT_VARIABLES.Base_API_URL + "/company/user",
        }),
        axios({
          method: "GET",
          headers: { Authorization: getAccessToken() },
          url:
            ENVIRONMENT_VARIABLES.Base_API_URL +
            "/userpermission/allpermission",
        }),
      ];
      axios
        .all(api)
        .then(
          axios.spread((outlets, companies, moduleWisePermission) => {
            dispatch({
              type: GET_OUTLETS,
              data: {
                outlets: outlets.data,
                companies: companies.data.data,
                moduleWisePermission: moduleWisePermission.data.data,
              },
            });
          })
        )
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
