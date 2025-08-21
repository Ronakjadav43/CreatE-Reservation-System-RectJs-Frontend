/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { bindActionCreators } from "redux";
import { connect, useSelector } from "react-redux";
import { Box, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useOutletContext } from "react-router-dom";
import { Stack } from "@mui/system";

import NoticeBoard from "../NoticeBoard";
import IntegratedActivityTable from "../IntegratedActivityTable";
import * as UserAction from "../../../Action/AdminDashboard";
import DashboardListingAndSeating from "../DashboardListingAndSeating";
import SeatingView from "../BookingOverView/SeatingView";
import "./style.scss";

let moment = require("moment-timezone");

const Home = (props) => {
  const { open } = useOutletContext();
  const [date, setDate] = useState(new Date());

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    showFloorPlan: state.hotelReducer.showFloorPlan,
  }));

  const handlePreviousDate = () => {
    const changedDate = new Date(moment(date).subtract(1, "days"));
    setDate(changedDate);
  };

  const handleNextDate = () => {
    const changedDate = new Date(moment(date).add(1, "days"));
    setDate(changedDate);
  };

  const handleChangeDate = (date) => {
    const changedDate = new Date(date);
    setDate(changedDate);
  };

  return (
    <div className="home">
      <div className="home-inner">
        <div className="home-header">
          <span className="header-text">Dashboard</span>
        </div>
        <div className="home-header">
          <div className="home-header-inner">
            <span className="header-inner-text">
              {hotelReducer.selectedOutlet?.outlet.name}
            </span>
          </div>
        </div>
      </div>
      <NoticeBoard date={date} />
      <IntegratedActivityTable />
      <Box className="dashbord-date">
        <div
          style={{ position: "absolute", top: "10px" }}
          className="dates date-picker"
        >
          <span className="days-text">{moment(date).format("dddd")}</span>

          <div className="date-picker">
            <div className="icon-box pointers" onClick={handlePreviousDate}>
              <ArrowBackIosIcon />
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack sx={{ width: "160px" }}>
                <DesktopDatePicker
                  className="date-pic"
                  value={date}
                  onChange={(newValue) => {
                    handleChangeDate(new Date(newValue));
                  }}
                  inputFormat="DD-MM-YYYY"
                  renderInput={(params) => <TextField {...params} />}
                  label="Date"
                />
              </Stack>
            </LocalizationProvider>
            <div className="icon-box pointers" onClick={handleNextDate}>
              <ArrowForwardIosIcon />
            </div>
          </div>
        </div>
      </Box>
      <DashboardListingAndSeating hasReadPermission={true} date={date} />
      <div className="user-groups" style={{ height: "calc(100vh - 275px)" }}>
        <h1 className="groups-header-2nd">Floor Plan</h1>
        {hotelReducer.showFloorPlan && (
          <SeatingView
            date={date}
            drawerOpen={open}
            hasReadPermission={true}
            hasUpdatePermission={false}
            hasCreatePermission={false}
          />
        )}
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(Home);
