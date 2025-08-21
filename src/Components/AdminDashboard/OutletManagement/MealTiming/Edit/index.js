/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { ValidatorForm } from "react-material-ui-form-validator";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import { daysOfWeek } from "../../../../../utils/dayOfWeek";
import "./style.scss";
import { handleUpdatedBy } from "../../../../../utils/userAccess";

let moment = require("moment-timezone");

const EditMealTime = (props) => {
  const {
    open,
    handleCloseEditMealTime,
    handleEditSaveMealTime,
    selectedMealTime,
    mealTypes,
    timezone,
  } = props;

  const [mealTimeData, setMealTimeData] = useState({
    sectionId: selectedMealTime.sectionId,
    dayofweek: selectedMealTime.dayofweek,
    openingTime: new Date(),
    closingTime: new Date(),
    isActive: selectedMealTime.isActive,
  });

  useEffect(() => {
    setMealTimeData({
      ...mealTimeData,
      openingTime: moment()
        .set({
          hour: moment(props.selectedMealTime.openingTime, "HH:mm").format(
            "HH"
          ),
          minute: moment(props.selectedMealTime.openingTime, "HH:mm").format(
            "mm"
          ),
        })
        .tz(timezone)
        .format(),
      closingTime: moment()
        .set({
          hour: moment(props.selectedMealTime.closingTime, "HH:mm").format(
            "HH"
          ),
          minute: moment(props.selectedMealTime.closingTime, "HH:mm").format(
            "mm"
          ),
        })
        .tz(timezone)
        .format(),
    });
  }, [props.selectedMealTime]);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...mealTimeData };
    commonData[field] = event.target.value;
    return setMealTimeData(commonData);
  };

  const handleEditMeal = () => {
    handleEditSaveMealTime(mealTimeData, props.selectedMealTime.id);
    handleCloseEditMealTime();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseEditMealTime}>
        <ValidatorForm
          onSubmit={() => handleEditMeal()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update Meal Timing</DialogTitle>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                name="status"
                className="switch-status"
                checked={mealTimeData.isActive}
                onClick={() =>
                  setMealTimeData({
                    ...mealTimeData,
                    isActive: !mealTimeData.isActive,
                  })
                }
              />
            </Stack>
          </Box>
          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-50">
              <Typography>Day Of Week</Typography>
              <FormControl size="small">
                <Select
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
              <FormControl size="small">
                <Select
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
            <div className="popup-input-box w-100 info">
              <DialogContentText>
                Created by :{selectedMealTime.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {selectedMealTime.createdAt
                  ? moment(selectedMealTime.createdAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:{handleUpdatedBy(selectedMealTime.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {selectedMealTime.updatedAt
                  ? moment(selectedMealTime.updatedAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
            {/* </div> */}
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseEditMealTime}>
              <CloseOutlinedIcon /> Close
            </Button>
            <Button type="submit" variant="contained">
              <SaveOutlinedIcon /> SAVE
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
export default EditMealTime;
