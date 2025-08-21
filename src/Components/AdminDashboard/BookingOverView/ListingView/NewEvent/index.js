/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  TextField,
  DialogTitle,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { MobileTimePicker } from "@mui/x-date-pickers";

import * as UserAction from "../../../../../Action/AdminDashboard";

let moment = require("moment-timezone");

const NewEvent = (props) => {
  const {
    open,
    selectedOutlet,
    handleCloseEditNewEvent,
    handleSaveInvoiceData,
    timezone,
  } = props;

  const [outletData, setOutletData] = useState({
    customer: selectedOutlet.customer,
    noOfPerson: selectedOutlet.noOfPerson,
    bookingDate: selectedOutlet.bookingDate,
    bookingEndDate: selectedOutlet.time[1],
    bookingType: selectedOutlet.bookingType,
    bookingStartTime: selectedOutlet.time[0],
    bookingEndTime: selectedOutlet.time[1],
    mobileNo: selectedOutlet.mobileNo,
    email: selectedOutlet.email,
    status: selectedOutlet.status,
    outlet: selectedOutlet.Outlet,
    occasion: selectedOutlet.occasion ? selectedOutlet.occasion : "",
    seatingPreference:
      selectedOutlet.seatingPreference === null
        ? "Indoor"
        : selectedOutlet.seatingPreference,
    outletTableName: selectedOutlet.outletTableName,
    specialRequest: selectedOutlet.specialRequest,
  });

  useEffect(() => {
    setOutletData({
      ...outletData,
      bookingStartTime: moment()
        .set({
          hour: moment(selectedOutlet.bookingStartTime, "HH:mm").format("HH"),
          minute: moment(selectedOutlet.bookingStartTime, "HH:mm").format("mm"),
        })
        .tz(timezone)
        .format(),
      bookingEndTime: moment()
        .set({
          hour: moment(selectedOutlet.bookingEndTime, "HH:mm").format("HH"),
          minute: moment(selectedOutlet.bookingEndTime, "HH:mm").format("mm"),
        })
        .tz(timezone)
        .format(),
    });
  }, [selectedOutlet]);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...outletData };
    commonData[field] = event.target.value;
    return setOutletData(commonData);
  };

  const handleEditOutlet = () => {
    handleSaveInvoiceData(outletData, selectedOutlet.id);
    handleCloseEditNewEvent();
  };

  return (
    <React.Fragment>
      {outletData && (
        <div>
          <Dialog open={open} onClose={handleCloseEditNewEvent}>
            <ValidatorForm
              onSubmit={() => handleEditOutlet()}
              autoComplete="off"
              className="popup-layout"
            >
              <Box className="popup-header">
                <DialogTitle>NEW EVENT</DialogTitle>
              </Box>

              <DialogContent sx={{ maxWidth: "1000px" }} className="popup-body">
                <div className="popup-input-box w-50">
                  <Typography>Customer Name</Typography>
                  <TextValidator
                    disabled
                    size="small"
                    fullWidth
                    margin="normal"
                    type="text"
                    name="customer"
                    value={outletData.customer}
                    placeholder="Enter Customer Name"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["First Name is required"]}
                  />
                </div>

                <div className="popup-input-box w-50 date-picker1">
                  <Typography>Start Date</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                    <DesktopDatePicker
                      disabled
                      disablePast
                      value={outletData.bookingDate}
                      onChange={(newValue) => {
                        setOutletData({
                          ...outletData,
                          bookingDate: new Date(newValue),
                        });
                      }}
                      inputFormat="DD-MM-YYYY"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>

                <div className="popup-input-box w-50 date-picker1">
                  <Typography>End Date</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      disabled
                      disablePast
                      value={outletData.bookingEndDate}
                      onChange={(newValue) => {
                        setOutletData({
                          ...outletData,
                          bookingEndDate: new Date(newValue),
                        });
                      }}
                      inputFormat="DD-MM-YYYY"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>

                <div className="popup-input-box w-50 date-picker1">
                  <Typography>Start Time</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileTimePicker
                      disabled
                      value={outletData.bookingStartTime}
                      onChange={(newValue) => {
                        setOutletData({
                          ...outletData,
                          bookingStartTime: new Date(newValue),
                        });
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>

                <div className="popup-input-box w-50 justify-end date-picker1">
                  <Typography>End Time</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileTimePicker
                      disabled
                      value={outletData.bookingEndTime}
                      onChange={(newValue) => {
                        setOutletData({
                          ...outletData,
                          bookingEndTime: new Date(newValue),
                        });
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>

                <div className="popup-input-box w-50">
                  <Typography>Email</Typography>
                  <TextValidator
                    size="small"
                    disabled
                    fullWidth
                    margin="normal"
                    type="email"
                    name="email"
                    value={outletData.email}
                    placeholder="Enter Email"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required", "isEmail"]}
                    errorMessages={["Email is required", "Email is not valid"]}
                  />
                </div>

                <div className="popup-input-box w-50">
                  <Typography>Mobile Number</Typography>
                  <TextValidator
                    size="small"
                    disabled
                    fullWidth
                    className="mobile-number"
                    margin="normal"
                    type="text"
                    name="mobileNo"
                    value={outletData.mobileNo}
                    placeholder="Enter Mobile Number"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["Mobile Number is required"]}
                  />
                </div>

                <div className="popup-input-box w-50">
                  <Typography>Pax</Typography>
                  <TextValidator
                    disabled
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    name="noOfPerson"
                    value={outletData.noOfPerson}
                    placeholder="Enter Pax"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["Pax is required"]}
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </div>
                <div className="popup-input-box w-50">
                  <Typography>Table No </Typography>
                  <TextValidator
                    disabled
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    name="outletTableName"
                    value={outletData.outletTableName}
                    placeholder="Enter Table No"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["Table No is required"]}
                  />
                </div>

                <div className="popup-input-box w-50">
                  <Typography>Table Preference</Typography>
                  <TextValidator
                    disabled
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    name="seatingPreference"
                    value={outletData.seatingPreference}
                    placeholder="Enter Table Preference"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={[" Table Preference is required"]}
                  />
                </div>

                <div className="popup-input-box w-50">
                  <Typography>Special Request</Typography>
                  <TextValidator
                    disabled
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    value={outletData.specialRequest}
                    name="specialRequest"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                    validators={["required"]}
                  />
                </div>
              </DialogContent>
              <DialogActions className="primary-btn popup-btn">
                <Button variant="outlined" onClick={handleCloseEditNewEvent}>
                  <CloseOutlinedIcon /> Close
                </Button>
              </DialogActions>
            </ValidatorForm>
          </Dialog>
        </div>
      )}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(NewEvent);
