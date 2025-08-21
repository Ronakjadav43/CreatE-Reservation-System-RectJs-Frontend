/* eslint-disable no-unreachable */
import axios from "axios";
import ENVIRONMENT_VARIABLES from "../../environment.config";

export const getShortUrlDetails = async (id) => {
  const api = {
    method: "GET",
    url: ENVIRONMENT_VARIABLES.Base_API_URL + "/common/shortenLink/" + id,
  };
  const result = await axios(api);
  return result;
};
