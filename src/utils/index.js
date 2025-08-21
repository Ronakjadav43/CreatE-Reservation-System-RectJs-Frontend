import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useSelector } from "react-redux";
import {
  SetPermisibleCompanies,
  SetPermisibleOutlets,
  handlePermission,
} from "./userAccess";
let initialRedux = null;

// const sign = require("jwt-encode");
// const secret = "Create2022!";

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getSelectedOutlet = () => {
  return localStorage.getItem("selectedOutlet");
};

export const getSelectedCompany = () => {
  return localStorage.getItem("selectedCompany");
};

export const getLocalData = (key) => {
  return localStorage.getItem(key);
};

export const clearAccessToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userDetail");
  localStorage.removeItem("selectedOutlet");
  localStorage.removeItem("selectedCompany");
  localStorage.clear();
};

export const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};

export const setSelectedutlet = (selectedOutlet) => {
  localStorage.setItem("selectedOutlet", selectedOutlet);
};

export const setLocalData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const setSelectedCompany = (selectedCompany) => {
  localStorage.setItem("selectedCompany", selectedCompany);
};

export const isLoggedIn = () => {
  const accessToken = getAccessToken();
  return !!accessToken;
};

export const RequireAuth = ({ children }) => {
  initialRedux = useSelector((state) => ({
    outlets: state.hotelReducer.outlets,
    companies: state.hotelReducer.companies,
    moduleWisePermission: state.hotelReducer.moduleWisePermission,
    permission: state.hotelReducer.permission,
  }));

  return isLoggedIn() ? children : <Navigate to="/Login" replace />;
};

export const LoginedIn = ({ children }) => {
  return !isLoggedIn() ? children : <Navigate to="/Admin" replace />;
};

export const getUserDetail = () => {
  const jwt = localStorage.getItem("userDetail");
  if (jwt && jwt !== null && jwt !== "") {
    return jwt_decode(jwt);
  }
  return false;
};

// export const setUserDetail = (userDetail) => {
//   const jwt = sign(userDetail, secret);
//   localStorage.setItem("userDetail", jwt);
// };

export const CheckOutletPermission = ({ children, moduleName }) => {
  SetPermisibleOutlets(
    initialRedux.moduleWisePermission,
    moduleName,
    "isRead",
    initialRedux.outlets,
    initialRedux.companies
  );

  return handlePermission(
    initialRedux.permission.permission,
    moduleName,
    "isRead"
  ) ? (
    children
  ) : (
    <Navigate to="/Admin" replace />
  );
};

export const CheckCompanyPermission = ({
  children,
  moduleName,
  checkBoxSelection = true,
}) => {
  // const permission = JSON.parse(getLocalData("permission"));
  // const moduleWisePermission = JSON.parse(getLocalData("moduleWisePermission"));
  // const companies = JSON.parse(getLocalData("companies"));

  SetPermisibleCompanies(
    initialRedux.moduleWisePermission,
    moduleName,
    "isRead",
    initialRedux.companies,
    checkBoxSelection
  );

  return handlePermission(
    initialRedux.permission.CompanyPermission,
    moduleName,
    "isRead"
  ) ? (
    children
  ) : (
    <Navigate to="/Admin" replace />
  );
};
