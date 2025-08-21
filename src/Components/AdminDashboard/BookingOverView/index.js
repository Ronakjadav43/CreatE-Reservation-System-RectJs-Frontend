/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import TimetableView from "./TimetableView";
import SeatingView from "./SeatingView";
import ListingView from "./ListingView";
import { useParams } from "react-router-dom";

const BookingOverview = () => {
  const { name } = useParams();
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (name) {
      setValue(name);
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="user-groups" style={{ height: "calc(100vh - 140px)" }}>
      <h1 className="groups-header">Reservation Management</h1>
      <h1 className="groups-header-2nd">Booking Overview</h1>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="SEATING VIEW" value="SeatingView" />
              <Tab label="TIMETABLE VIEW" value="TimetableView" />
              <Tab label="LISTING VIEW" value="ListingView" />
            </TabList>
          </Box>
          <TabPanel value="SeatingView">
            <SeatingView />
          </TabPanel>
          <TabPanel value="TimetableView">
            <TimetableView />
          </TabPanel>
          <TabPanel value="ListingView">
            <ListingView />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};
export default BookingOverview;
