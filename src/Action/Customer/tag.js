/* eslint-disable no-unreachable */
import axios from "axios";
import ENVIRONMENT_VARIABLES from "../../environment.config";

export const getTagsByOutletCategory = async (categoryId, outletId) => {
  const api = {
    method: "GET",
    url:
      ENVIRONMENT_VARIABLES.Base_API_URL +
      "/tag/tagCategory/" +
      categoryId +
      "/" +
      outletId +
      "/null",
  };
  return await axios(api);
};
