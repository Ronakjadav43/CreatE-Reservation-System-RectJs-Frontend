/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import * as UserAction from "../../../Action/AdminDashboard";
import Loader from "../../../CommonComponent/Loader";
import Notification from "../../../CommonComponent/Notification";
import SideBar from "../../AdminDashboard/SideBar";

const DashBoard = (props) => {
  const navigate = useNavigate();
  const theme = createTheme({
    palette: {
      primary: {
        light: "#ff8a65",
        main: "#ff5722",
        dark: "#e64a19",
      },
    },
    typography: {
      fontFamily: ["'Roboto', sans-serif !important"].join(","),
    },
  });

  const hotelReducer = useSelector((state) => ({
    token: state.hotelReducer.token,
    loading: state.hotelReducer.loading,
  }));

  const redirect = (url) => {
    navigate(url);
  };

  useEffect(() => {
    if (hotelReducer.token) {
      props.actions.userAction.getOutlets();
    } else {
      redirect("/Login");
    }
  }, [hotelReducer.token]);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Notification />
        <SideBar redirect={redirect} />
        {hotelReducer.loading && <Loader />}
      </ThemeProvider>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(DashBoard);
