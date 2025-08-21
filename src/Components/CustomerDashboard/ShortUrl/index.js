/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import * as CustomerAction from "../../../Action/Customer";
import Loader from "../../../CommonComponent/Loader";
import { ERROR } from "../../../utils/Customer/Constant";

const ShortUrl = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      setLoading(true);
      CustomerAction.getShortUrlDetails(id)
        .then((response) => {
          if (response) {
            window.location.replace(response.data.url);
          }
          setLoading(false);
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
          setLoading(false);
        });
    } catch (error) {
      alert(error.message.toString());
    }
  }, [id]);

  return (
    <React.Fragment>
      <div>{loading && <Loader />}</div>
    </React.Fragment>
  );
};

export default ShortUrl;
