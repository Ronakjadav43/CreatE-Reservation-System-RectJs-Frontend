/* eslint-disable no-unreachable */
import axios from "axios";
import {
  INPROGRESS,
  ERROR,
  GET_INVOICE_DETAILS,
} from "../../utils/Customer/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";

export const getOrderBySessionId = async (sessionId) => {
  try {
    return (dispatch) => {
      //   dispatch({ type: INPROGRESS });
      console.log("hellloooo", sessionId);
      const api = {
        method: "GET",
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/reservation/session/" +
          sessionId,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_INVOICE_DETAILS,
              data: response.data.data,
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
