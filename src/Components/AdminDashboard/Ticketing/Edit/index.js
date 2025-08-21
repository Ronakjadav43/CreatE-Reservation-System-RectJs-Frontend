/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  DialogActions,
  DialogContentText,
  Stack,
  Switch,
  Typography,
  TextField,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import ENVIRONMENT_VARIABLES from "../../../../environment.config";
import { useDispatch } from "react-redux";
import {
  SET_INVISIBLE_DISABLE_OUTLET,
  SET_INVISIBLE_SELECTION,
  SET_VISIBLE_DISABLE_OUTLET,
  SET_VISIBLE_SELECTION,
} from "../../../../utils/AdminDashboard/Constant";
import {
  ActionType,
  handlePermission,
  handleUpdatedBy,
  Modules,
} from "../../../../utils/userAccess";

let moment = require("moment-timezone");
var reader = new FileReader();

const EditTicket = (props) => {
  const {
    open,
    selectedTicketing,
    handleCloseEditTicket,
    handleSaveEditTicket,
    timezone,
  } = props;

  const dispatch = useDispatch();
  const [updateButtonActive, setUpdateButtonActive] = useState(true);

  const [ticketData, setTicketData] = useState({
    name: selectedTicketing.name,
    description: selectedTicketing.description,
    startDate: selectedTicketing.startDate,
    endDate: selectedTicketing.endDate,
    openingTime: new Date(),
    closingTime: new Date(),
    amount: selectedTicketing.amount,
    noOfPerson: selectedTicketing.noOfPerson,
    ticketMaxQuantity: selectedTicketing.ticketMaxQuantity,
    timeSlotInterval: selectedTicketing.timeSlotInterval,
    blockTable: selectedTicketing.blockTable,
    blockSchedule: selectedTicketing.blockSchedule,
    prePayment: selectedTicketing.prePayment,
    isActive: selectedTicketing.isActive,
    image: selectedTicketing.image,
  });

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

  useEffect(() => {
    setTicketData({
      ...ticketData,
      openingTime: moment()
        .set({
          hour: moment(props.selectedTicketing.openingTime, "HH:mm").format(
            "HH"
          ),
          minute: moment(props.selectedTicketing.openingTime, "HH:mm").format(
            "mm"
          ),
        })
        .tz(timezone),
      closingTime: moment()
        .set({
          hour: moment(props.selectedTicketing.closingTime, "HH:mm").format(
            "HH"
          ),
          minute: moment(props.selectedTicketing.closingTime, "HH:mm").format(
            "mm"
          ),
        })
        .tz(timezone),
    });
  }, [props.selectedTicketing]);

  const [imageDisplay, setImageDisplay] = useState(
    `${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${selectedTicketing.image}`
  );

  const handleToggleButton = (event) => {
    setUpdateButtonActive(false);
    const field = event.target.name;
    let commonData = { ...ticketData };
    commonData[field] = event.target.checked;
    return setTicketData(commonData);
  };

  const handleChange = (event) => {
    setUpdateButtonActive(false);
    const field = event.target.name;
    let commonData = { ...ticketData };
    commonData[field] = event.target.value;
    return setTicketData(commonData);
  };

  const handleEditOutlet = () => {
    handleSaveEditTicket(ticketData, selectedTicketing.id);
    handleCloseEditTicket();
  };

  const handleChangeStartDate = (date) => {
    setUpdateButtonActive(false);
    setTicketData({
      ...ticketData,
      startDate: date,
    });
  };

  const handleChangeEndDate = (date) => {
    setUpdateButtonActive(false);
    setTicketData({
      ...ticketData,
      endDate: date,
    });
  };

  const handleChangeOpeningTime = (time) => {
    setUpdateButtonActive(false);
    setTicketData({
      ...ticketData,
      openingTime: time,
    });
  };

  const handleChangeClosingTime = (time) => {
    setUpdateButtonActive(false);
    setTicketData({
      ...ticketData,
      closingTime: time,
    });
  };

  const handleImageUpload = (event) => {
    setUpdateButtonActive(false);
    setTicketData({
      ...ticketData,
      image: event.target.files[0],
    });
    reader.readAsDataURL(event.target.files[0]);
  };

  reader.onload = function (e) {
    setImageDisplay(e.target.result);
  };

  return (
    <React.Fragment>
      <span open={open} onClose={handleCloseEditTicket}>
        <ValidatorForm
          onSubmit={() => handleEditOutlet()}
          autoComplete="off"
          className="1"
        >
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseEditTicket}>
              <ArrowBackIcon /> BACK
            </Button>
            <Button
              disabled={
                handlePermission(
                  props.permission,
                  Modules.TICKETING,
                  ActionType.update,
                  true
                ) || updateButtonActive
              }
              type="submit"
              variant="contained"
            >
              <SaveOutlinedIcon /> UPDATE
            </Button>
          </DialogActions>

          <div className="basicinformation">
            <div className="basicinformation-left">
              <div className="w-100 p-10">
                <Typography>Name</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  margin="normal"
                  type="text"
                  name="name"
                  value={ticketData.name}
                  placeholder="Enter Name"
                  sx={{ marginTop: 0 }}
                  validators={["required"]}
                  onChange={handleChange}
                  errorMessages={["Name is required"]}
                />
              </div>
              <div className="w-50 p-10">
                <Typography>Pax</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  margin="normal"
                  type="number"
                  name="noOfPerson"
                  value={ticketData.noOfPerson}
                  placeholder="Enter Pax"
                  sx={{ marginTop: 0 }}
                  onChange={handleChange}
                  validators={["required", "minNumber:1"]}
                  errorMessages={[
                    "Pax is required",
                    "Pax should be more than 1",
                  ]}
                />
              </div>
              <div className="w-50 p-10">
                <Typography>Amount</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  margin="normal"
                  type="number"
                  name="amount"
                  value={ticketData.amount}
                  placeholder="Enter Amount"
                  sx={{ marginTop: 0 }}
                  onChange={handleChange}
                  validators={["required", "minNumber:0"]}
                  errorMessages={[
                    "Amount is required",
                    "Amount should be more than 0",
                  ]}
                />
              </div>

              <div className="w-50 p-10 date-picker1">
                <Typography>Start Date</Typography>
                {ticketData.startDate && (
                  <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                    <DesktopDatePicker
                      disablePast
                      className="w-100"
                      value={ticketData.startDate}
                      onChange={(newValue) => {
                        handleChangeStartDate(new Date(newValue));
                      }}
                      inputFormat="DD-MM-YYYY"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                )}
              </div>

              <div className="w-50 p-10 date-picker1">
                <Typography>End Date</Typography>
                {ticketData.endDate && (
                  <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                    <DesktopDatePicker
                      className="w-100"
                      disablePast
                      value={ticketData.endDate}
                      onChange={(newValue) => {
                        handleChangeEndDate(new Date(newValue));
                      }}
                      inputFormat="DD-MM-YYYY"
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                )}
              </div>

              <div className="w-50 p-10 date-picker1">
                <Typography>Start Time</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                  <MobileTimePicker
                    className="w-100"
                    value={ticketData.openingTime}
                    onChange={(newValue) => {
                      handleChangeOpeningTime(new Date(newValue));
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
              <div className="w-50 p-10 date-picker1">
                <Typography>End Time</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                  <MobileTimePicker
                    className="w-100"
                    value={ticketData.closingTime}
                    onChange={(newValue) => {
                      handleChangeClosingTime(new Date(newValue));
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>

              <div className="w-50 p-10">
                <Typography>Ticketing Max Quantity</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  margin="normal"
                  type="text"
                  name="ticketMaxQuantity"
                  value={ticketData.ticketMaxQuantity}
                  placeholder="Enter Ticketing Max Quantity"
                  sx={{ marginTop: 0 }}
                  onChange={handleChange}
                  validators={["required"]}
                  errorMessages={["Ticketing Max Quantity is required"]}
                  multiline
                />
              </div>
              <div className="w-50 p-10">
                <Typography>Ticketing Interval(in minutes)</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  margin="normal"
                  type="text"
                  name="timeSlotInterval"
                  value={ticketData.timeSlotInterval}
                  onChange={handleChange}
                  placeholder="Enter Ticketing Interval"
                  sx={{ marginTop: 0 }}
                  validators={["required"]}
                  errorMessages={["Ticketing Interval is required"]}
                />
              </div>
              <div className="w-50 p-10">
                <Typography>Description</Typography>
                <TextValidator
                  fullWidth
                  size="small"
                  margin="normal"
                  type="text"
                  name="description"
                  value={ticketData.description}
                  placeholder="Enter Description"
                  sx={{ marginTop: 0 }}
                  onChange={handleChange}
                  multiline
                />
              </div>
            </div>
            <div className="basicinformation-right">
              <Stack className="switch-div">
                <div className="switching">
                  <Typography>Status</Typography>
                  <Switch
                    name="isActive"
                    className="switch-status"
                    checked={ticketData.isActive}
                    onClick={handleToggleButton}
                  />
                </div>
                <div className="switching">
                  <Typography>Block Schedule</Typography>
                  <Switch
                    name="blockSchedule"
                    className="switch-status"
                    checked={ticketData.blockSchedule}
                    onClick={handleToggleButton}
                  />
                </div>
                <div className="switching">
                  <Typography>Pre Payment</Typography>
                  <Switch
                    name="prePayment"
                    className="switch-status"
                    checked={ticketData.prePayment}
                    onClick={handleToggleButton}
                  />
                </div>
                <div className="switching">
                  <Typography>Block Table</Typography>
                  <Switch
                    name="blockTable"
                    className="switch-status"
                    checked={ticketData.blockTable}
                    onClick={handleToggleButton}
                  />
                </div>
              </Stack>
              <div className="upload-img">
                <Typography className="w-100">Image/s</Typography>
                <div className="upload-block w-100">
                  {ticketData.image && (
                    <img
                      className="product-image"
                      src={imageDisplay}
                      alt="outletImage"
                    />
                  )}
                  <Button
                    className="upload-btn"
                    variant="contained"
                    component="label"
                  >
                    <FileUploadOutlinedIcon />
                    <input
                      name="image"
                      accept="image/*"
                      hidden
                      type="file"
                      onChange={(event) => handleImageUpload(event)}
                    />
                  </Button>
                </div>
              </div>

              <div className="w-100 info p-10">
                <DialogContentText>
                  Created by :{selectedTicketing.createdBy}
                </DialogContentText>
                <DialogContentText>
                  Created date :
                  {selectedTicketing.createdAt
                    ? moment(selectedTicketing.createdAt).format(
                        "DD-MM-YYYY hh:mm A"
                      )
                    : "N/A"}
                </DialogContentText>
                <DialogContentText>
                  Updated by:{handleUpdatedBy(selectedTicketing.updatedBy)}
                </DialogContentText>
                <DialogContentText>
                  Updated date :
                  {selectedTicketing.updatedAt
                    ? moment(selectedTicketing.updatedAt).format(
                        "DD-MM-YYYY hh:mm A"
                      )
                    : "N/A"}
                </DialogContentText>
              </div>
            </div>
          </div>
        </ValidatorForm>
      </span>
    </React.Fragment>
  );
};
export default EditTicket;
