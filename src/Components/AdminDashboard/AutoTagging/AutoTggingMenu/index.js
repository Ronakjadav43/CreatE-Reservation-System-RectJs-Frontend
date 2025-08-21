/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useDispatch } from "react-redux";

import {
  SET_INVISIBLE_DISABLE_OUTLET,
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_DISABLE_OUTLET,
  SET_VISIBLE_SELECTION,
} from "../../../../utils/AdminDashboard/Constant";
import CustomerTagging from "../CustomerTagging";
import CustomerTaggingList from "../CustomerTaggingList";

const AutoTaggingMenu = (props) => {
  const [value, setValue] = useState("customer Tagging");

  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch({
      type: SET_INVISIBLE_SELECTION,
    });
    dispatch({
      type: SET_INVISIBLE_DISABLE_OUTLET,
    });

    return () => {
      dispatch({
        type: SET_VISIBLE_SELECTION,
      });
      dispatch({
        type: SET_VISIBLE_DISABLE_OUTLET,
      });
    };
  }, []);

  return (
    <div className="user-groups">
      <h1 className="groups-header">Auto Tagging</h1>

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="CUSTOMER TAGGING" value="customer Tagging" />

              <Tab
                label="CUSTOMER TAGGING LIST"
                value="customer Tagging List"
              />
            </TabList>
          </Box>
          <TabPanel value="customer Tagging">
            <CustomerTagging
              selectedAutoTagging={{ ...props.selectedAutoTagging }}
              handleCloseSelectedAutoTagging={
                props.handleCloseSelectedAutoTagging
              }
              handleEditMarketing={props.handleEditMarketing}
              tags={[...props.tags]}
            />
          </TabPanel>

          <TabPanel value="customer Tagging List">
            <CustomerTaggingList
              selectedAutoTagging={{ ...props.selectedAutoTagging }}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};
export default AutoTaggingMenu;
