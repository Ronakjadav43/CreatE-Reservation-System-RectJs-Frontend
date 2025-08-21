/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { ValidatorForm } from "react-material-ui-form-validator";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";

import { daysOfWeek } from "../../../../../utils/dayOfWeek";
import "./style.scss";

const AddMealTime = (props) => {
  const { open, handleCloseMealTime, handleSaveMealTime, mealTypes } = props;

  const [mealTimeData, setMealTimeData] = useState({
    sectionId: mealTypes.length > 0 ? mealTypes[0].id : 0,
    dayofweek: daysOfWeek.length > 0 ? daysOfWeek[0].code : 0,
    openingTime: new Date(
      new Date().toLocaleString("en-US", {
        timeZone: props.timezone,
      })
    ),
    closingTime: new Date(
      new Date().toLocaleString("en-US", {
        timeZone: props.timezone,
      })
    ),
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...mealTimeData };
    commonData[field] = event.target.value;
    return setMealTimeData(commonData);
  };

  const handleAddMeal = () => {
    handleSaveMealTime(mealTimeData);
    handleCloseMealTime();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseMealTime}>
        <ValidatorForm
          onSubmit={() => handleAddMeal()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add New Meal Timing</DialogTitle>
          </Box>

          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-50">
              <Typography>Day Of Week</Typography>
              <FormControl>
                <Select
                  size="small"
                  value={mealTimeData.dayofweek}
                  name="dayofweek"
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={handleChange}
                >
                  {daysOfWeek.map((day, index) => (
                    <MenuItem key={index} value={day.code}>
                      {day.day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="popup-input-box w-50">
              <Typography>Meal Type</Typography>
              <FormControl>
                <Select
                  size="small"
                  value={mealTimeData.sectionId}
                  name="sectionId"
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={handleChange}
                >
                  {mealTypes.map((mealType, index) => (
                    <MenuItem key={index} value={mealType.id}>
                      {mealType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="popup-input-box w-50 date-picker">
              <Typography>Operating hour</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  value={mealTimeData.openingTime}
                  onChange={(newValue) => {
                    setMealTimeData({
                      ...mealTimeData,
                      openingTime: new Date(newValue),
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
            <div className="popup-input-box w-50 justify-end date-picker">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  value={mealTimeData.closingTime}
                  onChange={(newValue) => {
                    setMealTimeData({
                      ...mealTimeData,
                      closingTime: new Date(newValue),
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
          </DialogContent>

          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseMealTime}>
              <CloseOutlinedIcon /> Close
            </Button>
            <Button type="submit" variant="contained">
              <AddOutlinedIcon /> Add
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default AddMealTime;
