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
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import { daysOfWeek } from "../../../../../utils/dayOfWeek";
import "./style.scss";

const AddClosure = (props) => {
  const { open, handleCloseClosure, handleSaveClosure, mealTypes } = props;

  const [closureData, setClosureData] = useState({
    sectionId: mealTypes.length > 0 ? mealTypes[0].id : 0,
    dayofweek: daysOfWeek.length > 0 ? daysOfWeek[0].code : 0,
    effectiveFrom: new Date(
      new Date().toLocaleString("en-US", {
        timeZone: props.timezone,
      })
    ),
    effectiveTo: new Date(
      new Date().toLocaleString("en-US", {
        timeZone: props.timezone,
      })
    ),
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
    reason: "",
    outletStatus: true,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...closureData };
    commonData[field] = event.target.value;
    return setClosureData(commonData);
  };

  const handleAddMeal = () => {
    handleSaveClosure(closureData);
    handleCloseClosure();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseClosure}>
        <ValidatorForm
          onSubmit={() => handleAddMeal()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add New Override Meal Timing</DialogTitle>
          </Box>
          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-50">
              <Typography>Day Of Week</Typography>
              <FormControl>
                <Select
                  size="small"
                  value={closureData.dayofweek}
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
                  value={closureData.sectionId}
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
              <Typography>Starting Date</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                <DesktopDatePicker
                  value={closureData.effectiveFrom}
                  onChange={(newValue) => {
                    setClosureData({
                      ...closureData,
                      effectiveFrom: new Date(newValue),
                    });
                  }}
                  inputFormat="DD-MM-YYYY"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
            <div className="popup-input-box w-50 date-picker">
              <Typography>Ending Date</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  value={closureData.effectiveTo}
                  onChange={(newValue) => {
                    setClosureData({
                      ...closureData,
                      effectiveTo: new Date(newValue),
                    });
                  }}
                  inputFormat="DD-MM-YYYY"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>

            <div className="popup-input-box w-100">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Outlet Status</Typography>
                <Switch
                  className="switch-status"
                  checked={closureData.outletStatus}
                  onClick={() =>
                    setClosureData({
                      ...closureData,
                      outletStatus: !closureData.outletStatus,
                    })
                  }
                />
              </Stack>
            </div>

            {closureData.outletStatus && (
              <React.Fragment>
                <div className="popup-input-box w-50 date-picker">
                  <Typography>Operating hour</Typography>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileTimePicker
                      value={closureData.openingTime}
                      onChange={(newValue) => {
                        setClosureData({
                          ...closureData,
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
                      value={
                        closureData.closingTime ? closureData.closingTime : ""
                      }
                      onChange={(newValue) => {
                        setClosureData({
                          ...closureData,
                          closingTime: new Date(newValue),
                        });
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
              </React.Fragment>
            )}

            <div className="popup-input-box w-50">
              <Typography>Reason</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="reason"
                value={closureData.reason}
                placeholder="Enter Reason"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["Reason is required"]}
              />
            </div>
          </DialogContent>

          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseClosure}>
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

export default AddClosure;
