/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigate } from "react-router-dom";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { isEmpty } from "lodash";

import * as UserAction from "../../../../Action/AdminDashboard";
import Notification from "../../../../CommonComponent/Notification";
import Loader from "../../../../CommonComponent/Loader";
import "./Style.scss";

const Login = (props) => {
  const navigate = useNavigate();
  const redirect = (url) => {
    navigate(url);
  };

  const [isVisble, setIsVisible] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    userName: "",
    password: "",
  });

  const hotelReducer = useSelector((state) => ({
    token: state.hotelReducer.token,
    loading: state.hotelReducer.loading,
    error_msg: state.hotelReducer.error_msg,
  }));

  useEffect(() => {
    if (!isEmpty(hotelReducer.token)) {
      redirect("/Admin");
    }
  }, [hotelReducer.token]);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...loginDetails };
    commonData[field] = event.target.value;
    return setLoginDetails(commonData);
  };

  const login = () => {
    props.actions.userAction.login(loginDetails);
  };

  const handleClickShowPassword = () => {
    setIsVisible(!isVisble);
  };

  return (
    <div className="login-layout">
      <Notification />
      <div className="logo">
        <img src="/assets/images/Logo.png" alt="auth-login" />
      </div>
      <div className="login-inner">
        <div className="login-main">
          <h1 className="login-header-text">Welcome Back!</h1>
          <span className="login-header-text1">Log in to continue</span>

          <ValidatorForm
            className="w_100"
            onSubmit={() => login()}
            autoComplete="off"
          >
            <div className="login-input-div">
              <div className="login-input">
                <span className="login-input-label">Username</span>

                <TextValidator
                  sx={{ width: "100%" }}
                  name="userName"
                  type="text"
                  value={loginDetails.userName}
                  validators={["required"]}
                  onChange={handleChange}
                  errorMessages={["Email is required"]}
                />
              </div>
              <div className="login-input">
                <span className="login-input-label">Password </span>

                <TextValidator
                  sx={{ width: "100%" }}
                  name="password"
                  value={loginDetails.password}
                  validators={["required"]}
                  onChange={handleChange}
                  //type="password"
                  type={isVisble ? "text" : "password"}
                  errorMessages={["Password is required"]}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {isVisble ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
            <div className="login-links">
              <div className="checkbox-div">
                <Checkbox defaultChecked />
                <span className="checkbox-text">Keep me signed in</span>
              </div>
              <span
                className="forgotpassword-link"
                onClick={() => redirect("/ForgotPassword")}
              >
                Forgot password?
              </span>
            </div>

            <Button type="submit" className="login-btn" variant="Log In">
              Log In
            </Button>
          </ValidatorForm>
        </div>
        {hotelReducer.loading && <Loader />}
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(Login);
