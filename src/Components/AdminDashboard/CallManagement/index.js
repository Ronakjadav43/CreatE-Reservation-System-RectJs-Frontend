import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import BasicInformation from "./BasicInformation";

const Ivrslogs = () => {
  const [value, setValue] = useState("basic information");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="user-groups">
      <h1 className="groups-header">Call Management</h1>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="BASIC INFORMATION" value="basic information" />
            </TabList>
          </Box>
          <TabPanel value="basic information">
            <BasicInformation />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};
export default Ivrslogs;
