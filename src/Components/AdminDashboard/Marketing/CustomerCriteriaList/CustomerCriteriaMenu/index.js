/* eslint-disable array-callback-return */
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import CustomerCriteria from "../CustomerCriteria";
import CustomerList from "../CustomerList";

const CustomerCriteriaMenu = (props) => {
  const [value, setValue] = useState("customer criteria");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="user-groups">
      <h1 className="groups-header">Marketing</h1>

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="CUSTOMER CRITERIA" value="customer criteria" />

              <Tab label="CUSTOMER LIST" value="customer list" />
            </TabList>
          </Box>
          <TabPanel value="customer criteria">
            <CustomerCriteria
              selectedCustomerCriteria={{ ...props.selectedCustomerCriteria }}
              handleCloseSelectedCustomerCriteria={
                props.handleCloseSelectedCustomerCriteria
              }
              tags={[...props.tags]}
              handleEditMarketing={props.handleEditMarketing}
            />
          </TabPanel>

          <TabPanel value="customer list">
            <CustomerList
              selectedCustomerCriteria={{ ...props.selectedCustomerCriteria }}
              tags={[...props.tags]}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};
export default CustomerCriteriaMenu;
