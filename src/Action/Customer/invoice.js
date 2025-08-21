/* eslint-disable no-unreachable */
import axios from "axios";
import {
  INPROGRESS,
  ERROR,
  GET_INVOICE_DETAILS,
  UPDATE_STATUS,
} from "../../utils/Customer/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";

export const getInvoiceDetails = async (invoiceId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/invoice/" + invoiceId,
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

export const updateStatus = async (data, invoiceId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "PUT",
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/invoice/confirmation/" +
          invoiceId,
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_STATUS,
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
