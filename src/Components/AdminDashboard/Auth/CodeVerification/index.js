/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OTPInput from "otp-input-react";
import { useDispatch } from "react-redux";

import { LOGOUT } from "../../../../utils/AdminDashboard/Constant";
import { clearAccessToken } from "../../../../utils";
import * as UserAction from "../../../../Action/AdminDashboard";
import Loader from "../../../../CommonComponent/Loader";
import Notification from "../../../../CommonComponent/Notification";
import "./Style.scss";

const CodeVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const [OTP, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [internalMsg, setInternalMsg] = useState(null);

  const redirect = (url) => {
    navigate(url);
  };

  useEffect(() => {
    if (OTP.length === 7) {
      try {
        setLoading(true);
        UserAction.verifyToken({ verificationToken: token, code: OTP })
          .then((response) => {
            if (response.status === 200) {
              redirect(`/ResetPassword/${response.data.accessToken}`);
            } else {
              setInternalMsg({
                message: response.data.message,
              });
            }
            setLoading(false);
          })
          .catch((error) => {
            if (error && error.response) {
              if (error.response.status === 403) {
                clearAccessToken();
                dispatch({
                  type: LOGOUT,
                });
              } else {
                setInternalMsg({
                  message: error.response.data.message,
                });
              }
            } else {
              setInternalMsg({
                message: error.message.toString(),
              });
            }
            setLoading(false);
          });
      } catch (error) {
        setInternalMsg({
          message: error.message,
        });
      }
    }
  }, [OTP]);

  return (
    <div className="codeverification-layout">
      <Notification internalMsg={internalMsg} ischeckReducer={false} />
      <div className="logo">
        <img src="/assets/images/Logo.png" alt="codeverification" />
      </div>
      <div className="codeverification-inner">
        <h1 className="codeverification-header-text">Recovery Code Sent </h1>
        <span className="codeverification-header-text1">
          Check your Email and enter the recovery code to reset your password
        </span>
        <div className="codeverification-inputs">
          <OTPInput
            value={OTP}
            onChange={setOTP}
            OTPLength={7}
            otpType="number"
            disabled={false}
            className="codeverification-input-box"
            secure
          />
        </div>
        <div className="codeverification-links">
          <span className="received-text">Haven’t received the code yet?</span>
          <a className="re-send-link" href="/Email">
            Re-send recovery code
          </a>
        </div>
      </div>
      {loading && <Loader />}
    </div>
  );
};

export default CodeVerification;
