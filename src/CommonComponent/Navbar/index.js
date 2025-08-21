/* eslint-disable array-callback-return */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const splitsURLs = location.pathname.split("/");

  const redirect = (url) => {
    navigate(url);
  };

  const buildRedirectUrl = (urlIndex) => {
    let buildURL = "";
    splitsURLs.map((url, index) => {
      if (index !== 0 && index <= urlIndex) {
        buildURL += "/" + url;
      }
    });
    redirect(buildURL);
  };

  const randerUrl = () => {
    const result = splitsURLs.map((url, index) => {
      let displayURL = "";
      if (url !== "Admin") {
        displayURL = "/ " + url;
      }
      if (index === 0) {
        displayURL = url;
      }
      return (
        <b
          className="pr-3"
          onClick={() => {
            buildRedirectUrl(index);
          }}
          style={{ cursor: "pointer" }}
        >
          {displayURL.toUpperCase()}
        </b>
      );
    });
    return result;
  };

  return (
    <nav className="nav p-3 justify-content-between shadow-sm">
      <span style={{ fontFamily: "'Roboto', sans-serif !important" }}>
        <b
          className="pr-3"
          onClick={() => redirect("/Admin")}
          style={{ cursor: "pointer" }}
        >
          HOME
        </b>
        {randerUrl()}
      </span>
      <div className="d-flex justify-content-center"></div>
    </nav>
  );
};

export default Navbar;
