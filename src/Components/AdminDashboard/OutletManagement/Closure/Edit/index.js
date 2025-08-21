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
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { DesktopDatePicker } from "@mui/x-date-pickers";

import { daysOfWeek } from "../../../../../utils/dayOfWeek";
import "./style.scss";
import { handleUpdatedBy } from "../../../../../utils/userAccess";

let moment = require("moment-timezone");

const EditClosure = (props) => {
  const {
    open,
    handleCloseEditClosure,
    handleEditSaveClosure,
    selectedclosure,
    mealTypes,
    timezone,
  } = props;

  const [closureData, setClosureData] = useState({
    sectionId: selectedclosure.sectionId,
    dayofweek: selectedclosure.dayofweek,
    openingTime: new Date(),
    closingTime: new Date(),
    outletStatus: selectedclosure.outletStatus,
    effectiveFrom: null,
    effectiveTo: null,
    reason: selectedclosure.reason,
    isActive: selectedclosure.isActive,
  });

  useEffect(() => {
    setClosureData({
      ...closureData,
      effectiveFrom: moment(props.selectedclosure.effectiveFrom).tz(timezone),
      effectiveTo: moment(props.selectedclosure.effectiveTo).tz(timezone),
      openingTime: moment()
        .set({
          hour: moment(props.selectedclosure.openingTime, "HH:mm").format("HH"),
          minute: moment(props.selectedclosure.openingTime, "HH:mm").format(
            "mm"
          ),
        })
        .tz(timezone)
        .format(),
      closingTime: moment()
        .set({
          hour: moment(props.selectedclosure.closingTime, "HH:mm").format("HH"),
          minute: moment(props.selectedclosure.closingTime, "HH:mm").format(
            "mm"
          ),
        })
        .tz(timezone)
        .format(),
    });
  }, [props.selectedclosure]);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...closureData };
    commonData[field] = event.target.value;
    return setClosureData(commonData);
  };

  const handleEditClosure = () => {
    handleEditSaveClosure(closureData, props.selectedclosure.id);
    handleCloseEditClosure();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleCloseEditClosure}>
        <ValidatorForm
          onSubmit={() => handleEditClosure()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Update Override Meal Timing</DialogTitle>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status</Typography>
              <Switch
                className="switch-status"
                checked={closureData.isActive}
                onClick={() =>
                  setClosureData({
                    ...closureData,
                    isActive: !closureData.isActive,
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
              <FormControl size="small">
                <Select
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
              {closureData.effectiveFrom && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              )}
            </div>
            <div className="popup-input-box w-50 date-picker">
              <Typography>Ending Date</Typography>
              {closureData.effectiveTo && (
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
              )}
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
                size="small"
                fullWidth
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
            <div className="popup-input-box w-50 info">
              <DialogContentText>
                Created by :{selectedclosure.createdBy}
              </DialogContentText>
              <DialogContentText>
                Created date :
                {selectedclosure.createdAt
                  ? moment(selectedclosure.createdAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
              <DialogContentText>
                Updated by:{handleUpdatedBy(selectedclosure.updatedBy)}
              </DialogContentText>
              <DialogContentText>
                Updated date :
                {selectedclosure.updatedAt
                  ? moment(selectedclosure.updatedAt).format(
                      "DD-MM-YYYY hh:mm A"
                    )
                  : "N/A"}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseEditClosure}>
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
export default EditClosure;
