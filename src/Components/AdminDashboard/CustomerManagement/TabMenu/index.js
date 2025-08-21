import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  Typography,
} from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Reservation from "../Reservation";
import Profile from "../Profile";
import Activity from "../Activity";
import Sms from "../Sms";
import { isEmpty } from "lodash";
import History from "../History";
import "./style.scss";

const TabMenu = (props) => {
  const [value, setValue] = useState(
    props.isProfileActive ? "profile" : "reservation"
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
    newValue === "profile"
      ? props.handleProfileActive(true)
      : props.handleProfileActive(false);
  };

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? "#1A90FF" : "#308FE8",
    },
  }));

  return (
    <React.Fragment>
      <div className="user-groups" style={{ height: "calc(100vh - 139px)" }}>
        <Box>
          <FormControl size="small" sx={{ width: "200px" }}>
            <InputLabel id="demo-simple-select-label">Filter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={props.filters.filter}
              name="filter"
              label="Filter"
              inputProps={{ "aria-label": "Without label" }}
              onChange={props.handleChangeFilter}
            >
              {props.filterselection.map((filterType, index) => (
                <MenuItem key={index} value={filterType.id}>
                  {filterType.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <div className="user-group-slider customer-headers">
          {!isEmpty(props.customer) && (
            <React.Fragment>
              <div>
                <Typography
                  sx={{ color: "#000 !important" }}
                  className="groups-header-2nd"
                >
                  {props.customer.name} {props.customer.lastName}
                </Typography>
                <div>
                  <div style={{ display: "flex" }}>
                    <span>
                      CHURN RISK: {parseFloat(props.chunkRisk).toFixed(2)}
                    </span>
                    <Box
                      sx={{
                        marginLeft: "5px",
                        width: "285px",
                        marginTop: "10px ",
                      }}
                    >
                      <BorderLinearProgress
                        variant="determinate"
                        value={props.chunkRisk}
                        valueBuffer={props.chunkRisk}
                      />
                    </Box>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>

        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="RESERVATION" value="reservation" />
                <Tab label="PROFILE" value="profile" />
                <Tab label="HISTORY" value="history" />
                <Tab label="SMS" value="sms" />
                <Tab label="ACTIVITY" value="activity" />
              </TabList>
            </Box>
            <TabPanel value="reservation" className="tab-scroller">
              {!isEmpty(props.customer) && (
                <Reservation customer={{ ...props.customer }} />
              )}
            </TabPanel>

            <TabPanel value="profile" className="tab-scroller">
              {!isEmpty(props.customer) && (
                <Profile customer={{ ...props.customer }} />
              )}
            </TabPanel>
            <TabPanel value="history" className="tab-scroller">
              {!isEmpty(props.customer) && (
                <History customer={{ ...props.customer }} />
              )}
            </TabPanel>
            <TabPanel value="sms" className="tab-scroller">
              {!isEmpty(props.customer) && (
                <Sms customer={{ ...props.customer }} />
              )}
            </TabPanel>
            <TabPanel value="activity" className="tab-scroller">
              {!isEmpty(props.customer) && (
                <Activity customer={{ ...props.customer }} />
              )}
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </React.Fragment>
  );
};
export default TabMenu;
