import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import * as UserAction from "../../../../Action/AdminDashboard";
import Loader from "../../../../CommonComponent/Loader";
import Notification from "../../../../CommonComponent/Notification";
import { LOGOUT } from "../../../../utils/AdminDashboard/Constant";
import { clearAccessToken } from "../../../../utils/";
import "./Style.scss";

const ResetPassword = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken } = useParams();

  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [internalMsg, setInternalMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const redirect = (url) => {
    navigate(url);
  };

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...data };
    commonData[field] = event.target.value;
    return setData(commonData);
  };

  const handleClickShowPassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleClickConfirmPasswordShow = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const submit = () => {
    setInternalMsg(null);
    try {
      if (data.password === data.confirmPassword) {
        setLoading(true);
        UserAction.resetPassword(data, accessToken)
          .then((response) => {
            if (response.status === 200) {
              redirect(`/Login`);
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
      } else {
        setInternalMsg({
          message: "Password and ConfirmPassword doesn't match",
        });
      }
    } catch (error) {
      setInternalMsg({
        message: error.message,
      });
    }
  };

  return (
    <div className="resetpassword-layout">
      <Notification internalMsg={internalMsg} ischeckReducer={false} />
      <div className="logo" onClick={() => redirect("/Login")}>
        <img src="/assets/images/Logo.png" alt="logo" />
      </div>

      <ValidatorForm
        className="w_100"
        onSubmit={() => submit()}
        autoComplete="off"
      >
        <div className="resetpassword-inner">
          <div className="resetpassword-main">
            <h1 className="resetpassword-header-text">Reset password</h1>
            <span className="resetpassword-header-text1">
              Create a unique password
            </span>

            <div className="resetpassword-input-div">
              <div className="resetpassword-input">
                <span className="resetpassword-input-label">
                  Enter your new password
                </span>
                <TextValidator
                  sx={{ width: "100%" }}
                  name="password"
                  value={data.password}
                  validators={["required"]}
                  onChange={handleChange}
                  type={passwordVisible ? "text" : "password"}
                  errorMessages={["Password is required"]}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {passwordVisible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {/* <TextValidator
                  sx={{ width: "100%" }}
                  name="password"
                  type="password"
                  value={data.password}
                  validators={["required"]}
                  onChange={handleChange}
                  errorMessages={["this field is required"]}
                /> */}
              </div>
              <div className="resetpassword-input">
                <span className="resetpassword-input-label">
                  Re-enter your new password
                </span>
                <TextValidator
                  sx={{ width: "100%" }}
                  name="confirmPassword"
                  value={data.confirmPassword}
                  validators={["required"]}
                  onChange={handleChange}
                  type={confirmPasswordVisible ? "text" : "password"}
                  errorMessages={["Confirm Password is required"]}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickConfirmPasswordShow}
                          edge="end"
                        >
                          {confirmPasswordVisible ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {/* <TextValidator
                  sx={{ width: "100%" }}
                  name="confirmPassword"
                  type="password"
                  value={data.confirmPassword}
                  validators={["required"]}
                  onChange={handleChange}
                  errorMessages={["this field is required"]}
                /> */}
              </div>
            </div>
            <Button
              type="submit"
              className="resetpassword-btn"
              variant="Log In"
            >
              Go to Log In
            </Button>
          </div>
          {loading && <Loader />}
        </div>
      </ValidatorForm>
    </div>
  );
};

export default ResetPassword;
