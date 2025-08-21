import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import Loader from "../../../CommonComponent/Loader";
import { useSelector } from "react-redux";
import CustomerNotification from "../../../CommonComponent/CustomerNotification";

function CustomerHome(props) {
  const customerReducer = useSelector((state) => ({
    loading: state.customerReducer.loading,
  }));

  const theme = createTheme({
    palette: {
      primary: {
        light: "#FFF1E4",
        main: "#5C231C",
        dark: "#DBA47480",
      },
    },
    typography: {
      fontFamily: ["'Roboto', sans-serif !important"].join(","),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CustomerNotification />
      <Outlet />
      {customerReducer.loading && <Loader />}
    </ThemeProvider>
  );
}

export default CustomerHome;
