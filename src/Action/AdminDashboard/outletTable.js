/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  INPROGRESS,
  LOGOUT,
  ADD_OUTLET_TABLE,
  GET_OUTLET_TABLE,
  UPDATE_OUTLET_TABLE_INFO,
  DELETE_OUTLET_TABLE,
  UPDATE_OUTLET_TABLE_POSITION,
  GET_OUTLET_TABLE_BY_SEAT_TYPE,
  GET_OUTLET_TABLE_BY_GROUP,
  UPDATE_OUTLET_TABLE_BY_GROUP,
  DELETE_OUTLET_TABLE_BY_GROUP,
  GET_BOOKING_TABLE,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";

export const getOutletTables = async (seatingTypeId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/outlettable/seatingtype/" +
          seatingTypeId,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_OUTLET_TABLE,
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

export const getTables = async (seatingTypeId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/outlettable/seatingtype/" +
          seatingTypeId,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_BOOKING_TABLE,
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
export const getOutletTablesBySection = async (outletId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/tablesection/private/outlet/" +
          outletId,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_OUTLET_TABLE_BY_GROUP,
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

export const getOutletTablesBySeatType = async (seatingTypeId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/outlettable/seatingtype/" +
          seatingTypeId,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_OUTLET_TABLE_BY_SEAT_TYPE,
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

export const getPrivateOutletTables = async (seatingTypeId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      const api = {
        method: "GET",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/outlettable/private/seatingtype/" +
          seatingTypeId,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_OUTLET_TABLE,
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

export const addOutletTable = async (outletTableData, seatingTypeId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      var FormData = require("form-data");
      var data = new FormData();
      const keys = Object.keys(outletTableData);
      keys.map((key) => data.append(key, outletTableData[key]));
      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/outlettable/seatingtype/" +
          seatingTypeId,
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 201) {
            dispatch({
              type: ADD_OUTLET_TABLE,
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

export const addOutletTableByGroup = async (outletTableData, seatingTypeId) => {
  var FormData = require("form-data");
  var data = new FormData();
  data.append("image", outletTableData.image);
  data.append("color", outletTableData.color);
  data.append("name", outletTableData.name);
  data.append("outletTables", outletTableData.outletTables);
  data.append("minPax", outletTableData.minPax);
  data.append("maxPax", outletTableData.maxPax);
  data.append("description", outletTableData.description);
  outletTableData.originalPrice !== "" &&
    data.append("originalPrice", outletTableData.originalPrice);

  outletTableData.price !== "" && data.append("price", outletTableData.price);
  data.append("blockTime", outletTableData.blockTime);

  const api = {
    method: "POST",
    headers: { Authorization: getAccessToken() },
    url:
      ENVIRONMENT_VARIABLES.Base_API_URL +
      "/tablesection/private/seatingtype/" +
      seatingTypeId,
    data,
  };

  return await axios(api);
};

export const updataTableInfoByGroup = async (
  outletTableData,
  privateId,
  seatingTypeId
) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      var FormData = require("form-data");
      var data = new FormData();
      data.append("image", outletTableData.image);
      data.append("name", outletTableData.name);
      data.append("isActive", outletTableData.isActive);
      data.append("description", outletTableData.description);
      outletTableData.originalPrice !== "" &&
        data.append("originalPrice", outletTableData.originalPrice);
      outletTableData.price !== "" &&
        data.append("price", outletTableData.price);
      data.append("blockTime", outletTableData.blockTime);

      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/tablesection/private/" +
          privateId +
          "/seatingtype/" +
          seatingTypeId,
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_OUTLET_TABLE_BY_GROUP,
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

export const updataTableInfo = async (outletTableData, tableId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });

      var FormData = require("form-data");
      var data = new FormData();
      const keys = Object.keys(outletTableData);
      keys.map((key) => data.append(key, outletTableData[key]));

      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/outlettable/" + tableId,
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_OUTLET_TABLE_INFO,
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

export const deleteOutletTableByGroup = async (tablesectionId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      const api = {
        method: "DELETE",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/tablesection/" +
          tablesectionId,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: DELETE_OUTLET_TABLE_BY_GROUP,
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

export const deleteOutletTable = async (tableId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      const api = {
        method: "DELETE",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/outlettable/" + tableId,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: DELETE_OUTLET_TABLE,
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

export const updateOutletTablePosition = async (tables, seatingTypeId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      let data = tables.map((singleTable) => {
        return {
          id: singleTable.id,
          xPosition: singleTable.xPosition,
          yPosition: singleTable.yPosition,
        };
      });
      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/outlettable/seatingtype/" +
          seatingTypeId,
        data: { outletTable: data },
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_OUTLET_TABLE_POSITION,
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
