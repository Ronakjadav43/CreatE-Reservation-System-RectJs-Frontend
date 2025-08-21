/* eslint-disable no-unreachable */
import axios from "axios";
import { isEmpty } from "lodash";
import {
  IS_AUTHENTICATED,
  ERROR,
  INPROGRESS,
  LOGOUT,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { setAccessToken, clearAccessToken } from "../../utils";

export const login = (loginDetails) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      if (isEmpty(loginDetails.userName) || isEmpty(loginDetails.password))
        return dispatch({
          type: ERROR,
          data: { error_msg: "UserName and Password are required" },
        });

      axios
        .post(ENVIRONMENT_VARIABLES.Base_API_URL + "/Auth", loginDetails)
        .then((response) => {
          if (response.status === 200) {
            setAccessToken(response.data.accessToken);
            // setUserDetail(response.data.userDetail);
            dispatch({
              type: IS_AUTHENTICATED,
              data: response.data,
            });
          }
        })
        .catch((error) => {
          if (error && error.response) {
            dispatch({
              type: ERROR,
              data: { error_msg: error.response.data.message },
            });
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

export const forgotPassword = async (userName) => {
  const api = {
    method: "POST",
    url: ENVIRONMENT_VARIABLES.Base_API_URL + "/Auth/forgetPassword",
    data: {
      userName,
      type: "EMAIL",
    },
  };
  const verification = await axios(api);
  return verification;
};

export const verifyToken = async (tokenDetail) => {
  const api = {
    method: "PUT",
    url: ENVIRONMENT_VARIABLES.Base_API_URL + "/Auth/verifycode",
    data: tokenDetail,
  };
  const verification = await axios(api);
  return verification;
};

export const resetPassword = async (resetPassword, accessToken) => {
  const api = {
    method: "PUT",
    headers: { Authorization: accessToken },
    url: ENVIRONMENT_VARIABLES.Base_API_URL + "/Auth/resetpassword",
    data: resetPassword,
  };
  const result = await axios(api);
  return result;
};

export const logout = () => {
  try {
    return (dispatch) => {
      clearAccessToken();
      dispatch({
        type: LOGOUT,
      });
    };
  } catch (error) {
    alert(error.message.toString());
  }
};
