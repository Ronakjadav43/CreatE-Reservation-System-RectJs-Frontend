/* eslint-disable no-unreachable */
import axios from "axios";
import ENVIRONMENT_VARIABLES from "../../environment.config";

export const getDiningOption = async (data, outletId) => {
  const api = {
    method: "POST",
    url:
      ENVIRONMENT_VARIABLES.Base_API_URL +
      "/reservation/step4/outlet/" +
      outletId,
    data,
  };
  return await axios(api);
};
