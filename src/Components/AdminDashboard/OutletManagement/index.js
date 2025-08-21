/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { bindActionCreators } from "redux";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import BasicInformation from "./BasicInformation";
import MealTiming from "./MealTiming";
import MealType from "./MealType";
import Closure from "./Closure";
import TimingPromo from "./TimingPromo";
import PreOrder from "./PreOrder";
import EmailTemplate from "./EmailTemplate";
import DiningOption from "./DiningOption";
import SmsTemplateList from "./SmsTemplateList";
import { connect, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  ActionType,
  handlePermission,
  Modules,
} from "../../../utils/userAccess";
import * as UserAction from "../../../Action/AdminDashboard";

const OutletManagement = (props) => {
  const navigate = useNavigate();
  const [value, setValue] = useState("basic information");

  const hotelReducer = useSelector((state) => ({
    permission: state.hotelReducer.permission,
  }));

  const redirect = (url) => {
    navigate(url);
  };

  useEffect(() => {
    const hasPermission = handlePermission(
      hotelReducer.permission.permission,
      Modules.OUTLETMANAGEMENT,
      ActionType.read
    );
    if (!hasPermission) {
      redirect("/Admin");
    }
  }, [hotelReducer.permission]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="user-groups">
      <h1 className="groups-header">Accounts Management</h1>
      <h1 className="groups-header-2nd">Outlet Management</h1>
      {hotelReducer.permission && (
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="BASIC INFORMATION" value="basic information" />
                {handlePermission(
                  hotelReducer.permission.permission,
                  Modules.MEALTYPE,
                  ActionType.read
                ) && <Tab label="MEAL TYPE" value="meal type" />}
                {handlePermission(
                  hotelReducer.permission.permission,
                  Modules.MEALTIMING,
                  ActionType.read
                ) && <Tab label="MEAL TIMING" value="meal timing" />}
                {handlePermission(
                  hotelReducer.permission.permission,
                  Modules.CLOSURE,
                  ActionType.read
                ) && <Tab label="OVERRIDE MEAL TIMING" value="Closure" />}
                {handlePermission(
                  hotelReducer.permission.permission,
                  Modules.TIMINGPROMO,
                  ActionType.read
                ) && <Tab label="TIMING PROMO" value="timing promo" />}
                {handlePermission(
                  hotelReducer.permission.permission,
                  Modules.PREORDER,
                  ActionType.read
                ) && <Tab label="PRE-ORDER" value="pre order" />}
                {handlePermission(
                  hotelReducer.permission.permission,
                  Modules.EMAILTEMPLATE,
                  ActionType.read
                ) && <Tab label="EMAIL TEMPLATE" value="email template" />}
                {handlePermission(
                  hotelReducer.permission.permission,
                  Modules.DINNINGOPTION,
                  ActionType.read
                ) && <Tab label="DINING-OPTION" value="dining option" />}
                {handlePermission(
                  hotelReducer.permission.permission,
                  Modules.SMSTEMPLATE,
                  ActionType.read
                ) && <Tab label="SMS TEMPLATE" value="sms template" />}
              </TabList>
            </Box>
            <TabPanel value="basic information">
              <BasicInformation />
            </TabPanel>
            <TabPanel value="meal timing">
              <MealTiming />
            </TabPanel>
            <TabPanel value="meal type">
              <MealType />
            </TabPanel>
            <TabPanel value="Closure">
              <Closure />
            </TabPanel>
            <TabPanel value="timing promo">
              <TimingPromo />
            </TabPanel>
            <TabPanel value="pre order">
              <PreOrder />
            </TabPanel>
            <TabPanel value="email template">
              <EmailTemplate />
            </TabPanel>
            <TabPanel value="dining option">
              <DiningOption />
            </TabPanel>
            <TabPanel value="sms template">
              <SmsTemplateList />
            </TabPanel>
          </TabContext>
        </Box>
      )}
    </div>
  );
};
const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(OutletManagement);
