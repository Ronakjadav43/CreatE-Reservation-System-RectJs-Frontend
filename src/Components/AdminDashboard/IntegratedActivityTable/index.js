/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";

import SystemLog from "./systemLog";
import Transcation from "./Transcation";
import AllSystem from "./AllSystem";
import Ivrs from "./Ivrs";
import * as UserAction from "../../../Action/AdminDashboard";

const IntegratedActivityTable = (props) => {
  const [value, setValue] = useState("1");

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
  }));

  useEffect(() => {
    if (hotelReducer.selectedOutlet)
      props.actions.userAction.getSystemLogs(
        hotelReducer.selectedOutlet?.outlet.id,
        new Date()
      );
  }, [hotelReducer.selectedOutlet]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="user-groups" style={{ height: "unset" }}>
      <h1 className="groups-header-2nd">Integrated Activity List</h1>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="All" value="1" />
              <Tab label="TRANSACTIONAL EMAILS" value="2" />
              <Tab label="IVRS" value="3" />
              <Tab label="SYSTEM LOGS" value="4" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <AllSystem />
          </TabPanel>
          <TabPanel value="2">
            <Transcation />
          </TabPanel>
          <TabPanel value="3">
            <Ivrs />
          </TabPanel>
          <TabPanel value="4">
            <SystemLog />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(IntegratedActivityTable);
