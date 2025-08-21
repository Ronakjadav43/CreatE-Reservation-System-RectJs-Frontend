/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Stack,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect, useDispatch } from "react-redux";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { isEmpty } from "lodash";
import { bindActionCreators } from "redux";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PhoneInput from "react-phone-input-2";

import * as UserAction from "../../../../../Action/AdminDashboard";
import {
  INPROGRESS,
  ERROR,
  LOGOUT,
  STOPLOADER,
} from "../../../../../utils/AdminDashboard/Constant";
import { clearAccessToken } from "../../../../../utils";

let moment = require("moment-timezone");

const NewReservation = (props) => {
  const dispatch = useDispatch();
  const { open } = props;
  const [timeSlots, setTimeSlots] = useState(null);
  const [timeOut, setTimeOut] = useState(null);

  const [bookingTable, setBookingTable] = useState({
    outletId: props.selectedOutlet.outlet.id,
    date: props.date,
    name: "",
    lastName: "",
    email: null,
    noOfPerson: props.selectedTable.Table.noOfPerson,
    mobileNo: "",
    startTime: "",
    bookingType: "NORMAL_RESERVATION",
    specialRequest: "",
    description: "",
    time: "",
    amount: "",
    maxEventPax: "",
    outletTables: props.selectedTable.id.toString(),
    reservationType: props.reservationType,
  });

  useEffect(() => {
    if (props.selectedTable && props.reservationType === "reservation") {
      getTimeSlotByOutletId(bookingTable);
    }
  }, [props.selectedTable]);

  const handleChangeBookingTable = (event) => {
    clearTimeout(timeOut);
    const field = event.target.name;
    let commonData = { ...bookingTable };
    commonData[field] = event.target.value;
    if (field === "noOfPerson" && props.reservationType === "reservation") {
      setTimeOut(
        setTimeout(() => {
          if (!isEmpty(commonData.noOfPerson) && commonData.noOfPerson > 0)
            getTimeSlotByOutletId(commonData);
        }, 1000)
      );
    }
    return setBookingTable(commonData);
  };

  const getTimeSlotByOutletId = (bookingTable) => {
    setTimeSlots(null);
    setBookingTable({
      ...bookingTable,
      startTime: "",
    });
    const data = {
      ...bookingTable,
      date: moment(props.date).format("DD-MM-YYYY"),
    };
    dispatch({ type: INPROGRESS });
    UserAction.getTimeSlot(data)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.data) {
            const timeSlots = response.data.data[0]?.timeSlots;
            if (timeSlots && timeSlots.length > 0) {
              setTimeSlots(timeSlots);
              dispatch({
                type: STOPLOADER,
              });
            } else {
              dispatch({
                type: ERROR,
                data: { error_msg: "Service unavailable!" },
              });
            }
          }
        }
      })
      .catch((error) => {
        if (error && error.response) {
          if (error.response.status === 401) {
            clearAccessToken();
            dispatch({
              type: LOGOUT,
            });
          } else {
            dispatch({
              type: ERROR,
              data: { error_msg: error.response.data.message },
            });
          }
        } else {
          dispatch({
            type: ERROR,
            data: { error_msg: error.message.toString() },
          });
        }
      });
  };

  const confirmBooking = (bookingTable) => {
    const data = {
      ...bookingTable,
      mobileNo: `+${bookingTable.mobileNo}`,
      startTime: bookingTable.startTime,
    };
    props.handleBookNewReservation(data);
    props.handleCloseNewReservation();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={props.handleCloseNewReservation}>
        <ValidatorForm
          onSubmit={() => confirmBooking(bookingTable)}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add New Booking</DialogTitle>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack sx={{ width: "160px" }} className="date-picker">
                <DesktopDatePicker
                  disabled
                  value={
                    props.reservationType === "reservation"
                      ? props.date
                      : new Date()
                  }
                  inputFormat="DD-MM-YYYY"
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </LocalizationProvider>
          </Box>

          <DialogContent sx={{ width: "600px" }} className="popup-body">
            <div className="popup-input-box w-50">
              <Typography>First Name</Typography>
              <TextValidator
                size="small"
                fullWidth
                margin="normal"
                type="text"
                name="name"
                value={bookingTable.name}
                placeholder="Enter First Name"
                sx={{ marginTop: 0 }}
                onChange={handleChangeBookingTable}
                validators={["required"]}
                errorMessages={["FirstName is required"]}
              />
            </div>
            <div className="popup-input-box w-50">
              <Typography>Last Name</Typography>
              <TextValidator
                size="small"
                fullWidth
                margin="normal"
                type="text"
                name="lastName"
                value={bookingTable.lastName}
                placeholder="Enter Last Name"
                sx={{ marginTop: 0 }}
                onChange={handleChangeBookingTable}
                validators={["required"]}
                errorMessages={["LastName is required"]}
              />
            </div>
            <div className="popup-input-box w-50">
              <Typography>Email</Typography>
              <TextValidator
                size="small"
                fullWidth
                margin="normal"
                type="email"
                name="email"
                value={bookingTable.email}
                placeholder="Enter Email"
                sx={{ marginTop: 0 }}
                onChange={handleChangeBookingTable}
                validators={["isEmail"]}
                errorMessages={[ "Email is not valid"]}
              />
            </div>
            <div className="popup-input-boxs w-50">
              <Typography>Mobile Number</Typography>
              <PhoneInput
                error
                className="w-100"
                country={"sg"}
                inputProps={{
                  name: "phone",
                  required: true,
                }}
                onChange={(phone) =>
                  handleChangeBookingTable({
                    target: { name: "mobileNo", value: phone },
                  })
                }
              />
            </div>
            <div className="popup-input-box w-50">
              <Typography>Pax</Typography>
              <TextValidator
                size="small"
                fullWidth
                margin="normal"
                type="number"
                name="noOfPerson"
                value={bookingTable.noOfPerson}
                placeholder="Enter Pax"
                sx={{ marginTop: 0 }}
                onChange={handleChangeBookingTable}
                validators={["required", "minNumber:1"]}
                errorMessages={["Pax is required", "Pax should be more than 1"]}
              />
            </div>

            {props.reservationType === "reservation" &&
              timeSlots?.length > 0 && (
                <div className="popup-input-box w-50">
                  <Typography>Time Slot</Typography>
                  <FormControl>
                    <Select
                      size="small"
                      id="startTime"
                      value={bookingTable.startTime}
                      name="startTime"
                      onChange={handleChangeBookingTable}
                    >
                      {timeSlots.map((data, index) => (
                        <MenuItem key={index} value={data}>
                          {data}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}
            <div className="popup-input-box w-100">
              <Typography>Special Instructions</Typography>
              <TextValidator
                size="small"
                fullWidth
                margin="normal"
                multiline
                type="text"
                name="specialRequest"
                value={bookingTable.specialRequest}
                placeholder="Enter Special Instructions"
                sx={{ marginTop: 0 }}
                onChange={handleChangeBookingTable}
              />
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button
              variant="outlined"
              onClick={props.handleCloseNewReservation}
            >
              <CloseOutlinedIcon /> Close
            </Button>
            <Button
              disabled={
                props.reservationType === "reservation"
                  ? isEmpty(bookingTable.startTime)
                  : false
              }
              type="submit"
              variant="contained"
            >
              BOOK
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </React.Fragment>
  );
};
const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(NewReservation);
