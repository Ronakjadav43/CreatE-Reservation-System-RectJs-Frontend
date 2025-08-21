/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Box } from "@mui/material";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import "react-calendar-timeline/lib/Timeline.css";

import * as UserAction from "../../../Action/AdminDashboard";
import TimeTable from "../../../CommonComponent/TimeTableView";
import "./style.scss";

let moment = require("moment-timezone");

const DashboardTimetableView = (props) => {
  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    mealTime: state.hotelReducer.mealTime,
  }));
  const [searchData, setSearchData] = useState({
    date: props.date,
    mealType: { id: 0, Section: { name: "All" } },
  });
  const [search, setSearch] = useState({
    fromDate: moment(props.date).startOf("day").toDate(),
    toDate: moment(props.date).endOf("day").toDate(),
  });
  const [mealTimeData, setMealTimeData] = useState([]);
  const [filterBookingType, setFilterBookingType] = useState([
    {
      name: "NORMAL_RESERVATION",
      isChecked: true,
    },
    {
      name: "PRIVATE_EVENT",
      isChecked: true,
    },
    {
      name: "TICKETING_EVENT",
      isChecked: true,
    },
  ]);

  useEffect(() => {
    if (hotelReducer.selectedOutlet && props.date) {
      props.actions.userAction.getMealTimeView(
        hotelReducer.selectedOutlet.outlet.id,
        props.date
      );

      setSearchData({
        date: props.date,
        mealType: { id: 0, Section: { name: "All" } },
      });
      setSearch({
        fromDate: moment(props.date).startOf("day").toDate(),
        toDate: moment(props.date).endOf("day").toDate(),
      });
    }
  }, [hotelReducer.selectedOutlet, props.date]);

  useEffect(() => {
    setMealTimeData([
      ...hotelReducer.mealTime,
      { id: 0, Section: { name: "All" } },
    ]);
  }, [hotelReducer.mealTime]);

  const handleChange = (event) => {
    let data = { ...search };

    const filterMealTime = mealTimeData.find(
      (mealTime) => mealTime.id === event.target.value
    );

    if (filterMealTime && filterMealTime.Section?.name !== "All") {
      const starTime = filterMealTime.openingTime.split(":");
      const endTime = filterMealTime.closingTime.split(":");

      const formatedStartDate = moment(data.fromDate)
        .set({
          hour: starTime[0],
          minute: starTime[1],
        })
        .toDate();

      const formatedEndDate = moment(data.fromDate)
        .set({
          hour: endTime[0],
          minute: endTime[1],
        })
        .toDate();

      data = {
        fromDate: formatedStartDate,
        toDate: formatedEndDate,
      };
    } else {
      data = {
        fromDate: moment(data.fromDate).startOf("day").toDate(),
        toDate: moment(data.fromDate).endOf("day").toDate(),
      };
    }

    setSearch(data);
    return setSearchData({ ...searchData, mealType: filterMealTime });
  };

  const handleFilter = (e) => {
    const value = e.target.value[e.target.value.length - 1];
    let tempData = filterBookingType.map((data) =>
      data.name === value ? { ...data, isChecked: !data.isChecked } : data
    );
    setFilterBookingType([...tempData]);
  };

  const setDefaultTime = (startDate, endDate) => {
    setSearch({ fromDate: startDate, toDate: endDate });
  };

  return (
    <React.Fragment>
      <Box className="user-groups" style={{ gap: "10px", height: "unset" }}>
        <div className="user-groups-search">
          <Box>
            <FormControl size="small" sx={{ width: "160px" }}>
              <InputLabel id="demo-simple-select-label">MealType</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={searchData.mealType.id}
                name="mealType"
                label="mealType"
                inputProps={{ "aria-label": "Without label" }}
                onChange={handleChange}
              >
                {mealTimeData.map((mealTime, index) => (
                  <MenuItem key={index} value={mealTime.id}>
                    {mealTime?.Section?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {filterBookingType.length > 0 && (
            <FormControl size="small" sx={{ width: 300 }}>
              <Select
                multiple
                margin="normal"
                type="text"
                value={filterBookingType}
                name="audianceList"
                onChange={handleFilter}
                renderValue={(selected) => {
                  selected = filterBookingType.filter(
                    (data) => data.isChecked === true
                  );
                  const renderData = selected.map((tag) => tag.name);
                  return renderData.join(", ");
                }}
              >
                {filterBookingType.map((data, index) => (
                  <MenuItem key={index} value={data.name}>
                    <ListItemIcon>
                      <Checkbox checked={data.isChecked} />
                    </ListItemIcon>
                    <ListItemText primary={data.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>

        <Box
          sx={{
            height: "610px",
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
          className="dashboard-timeline"
        >
          <TimeTable
            selectedOutlet={hotelReducer.selectedOutlet}
            searchData={searchData}
            search={search}
            filterBookingType={filterBookingType}
            setDefaultTime={setDefaultTime}
          />
        </Box>
      </Box>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(DashboardTimetableView);
