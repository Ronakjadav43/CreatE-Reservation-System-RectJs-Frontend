import React from "react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useNavigate } from "react-router-dom";

import "./Style.scss";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const redirect = (url) => {
    navigate(url);
  };

  return (
    <div className="forgotpassword-layout">
      <div className="logo" onClick={() => redirect("/Login")}>
        <img src="/assets/images/Logo.png" alt="logo" />
      </div>

      <div className="forgotpassword-inner">
        <h1 className="forgotpassword-header-text">Forgot Password</h1>
        <span className="forgotpassword-header-text1">
          Select which contact details to receive recovery code
        </span>
        <div className="option mt_10" onClick={() => redirect("/Email")}>
          <EmailOutlinedIcon />
          <div className="option-texts">
            <span className="text">via Email</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
