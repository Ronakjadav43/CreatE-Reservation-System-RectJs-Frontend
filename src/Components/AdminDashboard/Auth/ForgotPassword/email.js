import { Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

import Notification from "../../../../CommonComponent/Notification";
import * as UserAction from "../../../../Action/AdminDashboard";
import { LOGOUT } from "../../../../utils/AdminDashboard/Constant";
import { clearAccessToken } from "../../../../utils";
import Loader from "../../../../CommonComponent/Loader";
import "./Email.scss";

const Email = () => {
  const [userName, setUserName] = useState("");
  const [internalMsg, setInternalMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const redirect = (url) => {
    navigate(url);
  };

  const handleChange = (event) => {
    setUserName(event.target.value);
  };

  const submit = () => {
    setInternalMsg(null);
    try {
      if (!isEmpty(userName)) {
        setLoading(true);
        UserAction.forgotPassword(userName)
          .then((response) => {
            if (response.status === 200) {
              redirect(`/CodeVerification/${response.data.verificationToken}`);
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
              } else
                setInternalMsg({
                  message: error.response.data.message,
                });
            } else {
              setInternalMsg({
                message: error.message.toString(),
              });
            }
            setLoading(false);
          });
      } else {
        setInternalMsg({
          message: "Invalid Email",
        });
      }
    } catch (error) {
      setInternalMsg({
        message: error.message.toString(),
      });
    }
  };

  return (
    <div>
      <Notification internalMsg={internalMsg} ischeckReducer={false} />
      <div className="forgotpassword-layout">
        <div className="logo" onClick={() => redirect("/Login")}>
          <img src="/assets/images/Logo.png" alt="forgot-password" />
        </div>
        <ValidatorForm
          className="w_100"
          onSubmit={() => submit()}
          autoComplete="off"
        >
          <div className="forgotpassword-inner">
            <h1 className="forgotpassword-header-text">Forgot Password</h1>

            <div className="login-input">
              <span className="login-input-label">Enter you Email address</span>
              <TextValidator
                sx={{ width: "100%" }}
                name="email"
                type="email"
                value={userName}
                validators={["required"]}
                onChange={handleChange}
                errorMessages={["this field is required"]}
              />
            </div>
            <Button type="submit" className="login-btn" variant="Log In">
              Submit
            </Button>
          </div>
        </ValidatorForm>
      </div>
      {loading && <Loader />}
    </div>
  );
};

export default Email;
