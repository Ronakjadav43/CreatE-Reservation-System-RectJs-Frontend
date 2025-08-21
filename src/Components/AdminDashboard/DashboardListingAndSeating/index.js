import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import DashboardTimetableView from "../DashboardTimetableView";
import DashboardListingView from "../DashboardListingView";

const DashboardListingAndSeating = (props) => {
  const [value, setValue] = useState("ListingView");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="user-groups" style={{ height: "unset" }}>
      <h1 className="groups-header-2nd">Seating and Reservation Overview</h1>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="LISTING VIEW" value="ListingView" />
              <Tab label="TIMETABLE VIEW" value="TimetableView" />
            </TabList>
          </Box>
          <TabPanel value="ListingView">
            <DashboardListingView date={props.date} />
          </TabPanel>
          <TabPanel value="TimetableView">
            <DashboardTimetableView
              hasReadPermission={true}
              date={props.date}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};
export default DashboardListingAndSeating;
