/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  INPROGRESS,
  LOGOUT,
  GET_ALL_CUSTOMER,
  GET_CUSTOMER_RESERVATION,
  UPDATE_ALL_CUSTOMER,
  GET_CUSTOMER_PROFILE,
  UPDATE_CUSTOMER_RESERVATION,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";
import { compact } from "lodash";
import moment from "moment-timezone";

export const getAllCustomer = async (data) => {
  try {
    return (dispatch) => {
      if (data) {
        const mappCompany = [];
        data.companyIds.map((filterCompany) =>
          mappCompany.push(filterCompany.id)
        );

        data = {
          filter: data.filter,
          companyIds: mappCompany,
        };
      }
      dispatch({ type: INPROGRESS });

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/customer/company",
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_ALL_CUSTOMER,
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

export const getCustomerReservation = async (data, outletId, customerID) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/customer/" +
          customerID +
          "/reservation/outlet/" +
          outletId,
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_CUSTOMER_RESERVATION,
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

export const updateCustomerReservation = async (
  customerReservationData,
  invoiceId
) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const dietData = customerReservationData.dietaryRestriction
        .filter((dietData) => dietData.isChecked === true)
        .map((diet) => diet.name);

      const data = { ...customerReservationData, dietaryRestriction: dietData };
      data.tableChangeRequest && delete data.tableChangeRequest.startDate;
      delete data.originalTotal;
      delete data.depositTotal;
      delete data.coupen;
      delete data.discountAmount;
      delete data.beforeDiscountTotal;
      delete data.totalPaidAmount;
      delete data.paymentStatus;
      delete data.tables;
      delete data.isPrivateTableBooked;

      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/invoice/" + invoiceId,
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_CUSTOMER_RESERVATION,
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

export const getCustomerProfile = async (ID, outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/customer/" +
          ID +
          "/profile/outlet/" +
          outletId,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_CUSTOMER_PROFILE,
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

export const updateCustomerProfile = async (
  customerData,
  outletId,
  customerID
) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      delete customerData.lastTransactionDate;
      delete customerData.createdAt;
      delete customerData.averageSpend;
      delete customerData.isPrivateTableBooked;
      delete customerData.email;
      delete customerData.isOPT;

      customerData.customerCompanyName === "" &&
        delete customerData.customerCompanyName;
      customerData.gender === "" && delete customerData.gender;
      customerData.address === "" && delete customerData.address;
      customerData.postalCode === "" && delete customerData.postalCode;
      customerData.programName === "" && delete customerData.programName;
      customerData.activationTerminal === "" &&
        delete customerData.activationTerminal;
      customerData.eatPoints === "" && delete customerData.eatPoints;
      customerData.noOfRefferalPurchased === "" &&
        delete customerData.noOfRefferalPurchased;
      customerData.notes === "" && delete customerData.notes;
      customerData.salutation === "" && delete customerData.salutation;

      const data = {
        ...customerData,
        dob: customerData.dob
          ? moment(customerData.dob).format("DD-MM-YYYY")
          : null,
      };
      const tags = data.tags.map((tag) => {
        if (tag.isChecked === true) {
          return { id: tag.id, name: tag.name };
        } else {
          return null;
        }
      });
      data.tags = compact(tags);
      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/customer/" +
          customerID +
          "/outlet/" +
          outletId,
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_ALL_CUSTOMER,
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
