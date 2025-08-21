// /* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Box, Button } from "@mui/material";
import { connect, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import {
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers-pro";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { Stack } from "@mui/system";

import * as UserAction from "../../../../Action/AdminDashboard";
import TimeTable from "../../../../CommonComponent/TimeTableView/";
import "./style.scss";

import "react-calendar-timeline/lib/Timeline.css";

let moment = require("moment-timezone");

const TimeLine = (props) => {
  const [mealtype, setMealType] = useState({ id: 0 });
  const [searchData, setSearchData] = useState(null);
  const [search, setSearch] = useState(null);
  const [mealTimeData, setMealTimeData] = useState([]);
  const mealTime = useSelector((state) => state.hotelReducer.mealTime);
  const selectedOutlet = useSelector(
    (state) => state.hotelReducer.selectedOutlet
  );

  useEffect(() => {
    if (selectedOutlet) {
      const data = {
        date: new Date(),
        mealType: { id: 0, Section: { name: "All" } },
      };
      const search = {
        fromDate: moment().startOf("day").toDate(),
        toDate: moment().endOf("day").toDate(),
      };
      setSearch(search);
      setSearchData(data);
      setMealType({ id: 0 });
      props.actions.userAction.getMealTimeView(
        selectedOutlet.outlet.id,
        data.date
      );
    }
  }, [selectedOutlet]);

  useEffect(() => {
    setMealTimeData([...mealTime, { id: 0, Section: { name: "All" } }]);
  }, [mealTime]);

  const handleChange = (event) => {
    const filterMealTime = mealTimeData.find(
      (mealTime) => mealTime.id === event.target.value
    );
    setMealType(filterMealTime);
  };

  const setDate = () => {
    let data = { ...search };

    const filterMealTime = mealTimeData.find(
      (mealTime) => mealTime.id === mealtype.id
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
    setSearchData({ ...searchData, mealType: filterMealTime });
  };

  const handlePreviousDate = () => {
    let data = {
      ...searchData,
      mealType: { id: 0, Section: { name: "All" } },
      date: new Date(moment(searchData.date).subtract(1, "days")),
    };
    const timelineHeader = {
      ...search,
      fromDate: moment(data.date).startOf("day").toDate(),
      toDate: moment(data.date).endOf("day").toDate(),
    };
    setSearchData({
      ...data,
    });
    setSearch({ ...timelineHeader });
    setMealType({ id: 0 });
    props.actions.userAction.getTimetableView(selectedOutlet.outlet.id, data);
    props.actions.userAction.getMealTimeView(
      selectedOutlet.outlet.id,
      data.date
    );
  };

  const handleNextDate = () => {
    let data = {
      ...searchData,
      mealType: { id: 0, Section: { name: "All" } },
      date: new Date(moment(searchData.date).add(1, "days")),
    };
    const timelineHeader = {
      ...search,
      fromDate: moment(data.date).startOf("day").toDate(),
      toDate: moment(data.date).endOf("day").toDate(),
    };
    setSearchData({
      ...data,
    });
    setSearch({ ...timelineHeader });
    setMealType({ id: 0 });
    props.actions.userAction.getTimetableView(selectedOutlet.outlet.id, data);
    props.actions.userAction.getMealTimeView(
      selectedOutlet.outlet.id,
      data.date
    );
  };

  const handleChangeDate = (date) => {
    let data = {
      ...searchData,
      mealType: { id: 0, Section: { name: "All" } },
      date,
    };
    const timelineHeader = {
      ...search,
      fromDate: moment(data.date).startOf("day").toDate(),
      toDate: moment(data.date).endOf("day").toDate(),
    };
    setSearchData({
      ...data,
    });
    setSearch({ ...timelineHeader });
    setMealType({ id: 0 });
    props.actions.userAction.getTimetableView(selectedOutlet.outlet.id, data);
    props.actions.userAction.getMealTimeView(
      selectedOutlet.outlet.id,
      data.date
    );
  };

  return (
    <React.Fragment>
      {searchData && (
        <Box
          className="user-groups-search"
          style={{ width: "40%", gap: "10px" }}
        >
          <div className="date-picker">
            <div className="icon-box pointers">
              <ArrowBackIosIcon onClick={handlePreviousDate} />
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack sx={{ width: "160px" }}>
                <DesktopDatePicker
                  className="date-pic"
                  value={searchData.date}
                  onChange={(newValue) => {
                    handleChangeDate(new Date(newValue));
                  }}
                  inputFormat="DD-MM-YYYY"
                  renderInput={(params) => <TextField {...params} />}
                  label="Date"
                />
              </Stack>
            </LocalizationProvider>
            <div className="icon-box pointers">
              <ArrowForwardIosIcon onClick={handleNextDate} />
            </div>
          </div>
          <Box>
            <FormControl size="small" sx={{ width: "160px" }}>
              <InputLabel id="demo-simple-select-label">MealType</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={mealtype.id}
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
          <div className="primary-btn">
            <Button variant="contained" onClick={setDate}>
              search
            </Button>
          </div>
        </Box>
      )}

      {searchData && (
        <TimeTable
          selectedOutlet={selectedOutlet}
          searchData={searchData}
          search={search}
        />
      )}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(TimeLine);
