/* eslint-disable no-unreachable */
import axios from "axios";
import {
  ERROR,
  INPROGRESS,
  LOGOUT,
  GET_ALL_MATERIALS,
  GET_MATERIAL_BY_ID,
  ADD_MATERIALS,
  UPDATE_MATERIAL,
  DELETE_MATERIAL,
} from "../../utils/AdminDashboard/Constant";
import ENVIRONMENT_VARIABLES from "../../environment.config";
import { clearAccessToken, getAccessToken } from "../../utils";

export const getAllMaterials = async (
  outletId,
  search = null,
  categoryId = null,
  subCategoryId = null
) => {
  try {
    return (dispatch) => {
      let data = {};
      if (search) {
        data.search = search;
      }
      if (categoryId) {
        data.categoryId = categoryId;
      }
      if (subCategoryId) {
        data.subCategoryId = subCategoryId;
      }

      dispatch({ type: INPROGRESS });

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL +
          "/material/filter/outlet/" +
          outletId,
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_ALL_MATERIALS,
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

export const addMaterial = async (materialData, outletId) => {
  try {
    return (dispatch) => {
      const mappTag = [];
      materialData.tags
        .filter((data) => data.isChecked)
        .map((tag) => mappTag.push({ id: tag.id, name: tag.name }));

      materialData = { ...materialData, tags: JSON.stringify(mappTag) };

      dispatch({ type: INPROGRESS });

      var FormData = require("form-data");
      var data = new FormData();
      const keys = Object.keys(materialData);
      keys.map((key) => data.append(key, materialData[key]));

      const api = {
        method: "POST",
        headers: { Authorization: getAccessToken() },
        url:
          ENVIRONMENT_VARIABLES.Base_API_URL + "/material/outlet/" + outletId,
        data,
      };

      axios(api)
        .then((response) => {
          if (response.status === 201) {
            dispatch({
              type: ADD_MATERIALS,
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

export const getMaterialById = async (materialId) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      const api = {
        method: "GET",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/material/" + materialId,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: GET_MATERIAL_BY_ID,
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

export const updateMaterial = async (materialData, materialId) => {
  try {
    return (dispatch) => {
      const mappTag = [];
      materialData.tags
        .filter((data) => data.isChecked)
        .map((tag) => mappTag.push({ id: tag.id, name: tag.name }));

      materialData = { ...materialData, tags: JSON.stringify(mappTag) };

      dispatch({ type: INPROGRESS });

      var FormData = require("form-data");
      var data = new FormData();
      data.append("title", materialData.title);
      data.append("description", materialData.description);
      data.append("tags", materialData.tags);
      data.append("attachment", materialData.attachment);
      data.append("thumbnail", materialData.thumbnail);
      data.append("categoryId", materialData.categoryId);
      data.append("subCategoryId", materialData.subCategoryId);

      const api = {
        method: "PUT",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/material/" + materialId,
        data,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: UPDATE_MATERIAL,
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

export const deleteMaterial = async (id) => {
  try {
    return (dispatch) => {
      dispatch({ type: INPROGRESS });
      const api = {
        method: "DELETE",
        headers: { Authorization: getAccessToken() },
        url: ENVIRONMENT_VARIABLES.Base_API_URL + "/material/" + id,
      };
      axios(api)
        .then((response) => {
          if (response.status === 200) {
            dispatch({
              type: DELETE_MATERIAL,
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
