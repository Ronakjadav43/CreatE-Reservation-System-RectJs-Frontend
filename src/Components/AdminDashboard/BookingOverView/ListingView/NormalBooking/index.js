/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
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
  InputLabel,
  Stack,
  TextField,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { connect, useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import PhoneInput from "react-phone-input-2";
import { isEmpty } from "lodash";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import * as UserAction from "../../../../../Action/AdminDashboard";
import {
  INPROGRESS,
  ERROR,
  LOGOUT,
  STOPLOADER,
  GET_BOOKING_RESERVATION,
} from "../../../../../utils/AdminDashboard/Constant";
import { clearAccessToken } from "../../../../../utils";
import ConfirmTable from "../ConfirmTable";

let moment = require("moment-timezone");

const NormalBooking = (props) => {
  const dispatch = useDispatch();
  const { open, handleCloseBookingTable, handleChangeBookingType } = props;

  const reservationType = [
    { id: "NORMAL_RESERVATION", value: "New Booking" },
    { id: "PRIVATE_EVENT", value: "New Event" },
  ];

  const [timeSlots, setTimeSlots] = useState(null);
  const [confirmTable, setConfirmTable] = useState(false);
  const [timeOut, setTimeOut] = useState(null);
  const [bookingTable, setBookingTable] = useState({
    outletId: props.selectedOutlet.outlet.id,
    date: props.filterData.date,
    name: "",
    lastName: "",
    email: null,
    noOfPerson: null,
    mobileNo: "",
    bookingType: reservationType[0].id,
    specialRequest: "",
    time: "",
  });

  const selectedOutlet = useSelector(
    (state) => state.hotelReducer.selectedOutlet
  );

  useEffect(() => {
    if (selectedOutlet) {
      setBookingTable({
        ...bookingTable,
        outletId: selectedOutlet.outlet.id,
      });
    }
  }, [selectedOutlet]);

  const handleChangeBookingTable = (event) => {
    clearTimeout(timeOut);
    const field = event.target.name;
    let commonData = { ...bookingTable };
    commonData[field] = event.target.value;
    if (field === "noOfPerson") {
      setTimeOut(
        setTimeout(() => {
          if (!isEmpty(commonData.noOfPerson) && commonData.noOfPerson > 0)
            getTimeSlotByOutletId(commonData);
        }, 1000)
      );
    }
    return setBookingTable(commonData);
  };

  const handleCloseConfirmTable = () => {
    setConfirmTable(false);
  };

  const handleOpenConfirmTable = () => {
    setConfirmTable(true);
  };

  const getTimeSlotByOutletId = (bookingTable) => {
    if (bookingTable.bookingType === "NORMAL_RESERVATION") {
      setTimeSlots(null);
      setBookingTable({
        ...bookingTable,
        startTime: null,
      });
      const data = {
        ...bookingTable,
        date: moment(bookingTable.date).format("DD-MM-YYYY"),
        checkPax: "true",
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
                  data: {
                    error_msg: "Service unavailable",
                  },
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
    } else {
      setTimeSlots(null);
      setBookingTable({
        ...bookingTable,
        startTime: null,
      });
      const data = {
        ...bookingTable,
        date: moment(bookingTable.startDate).format("DD-MM-YYYY"),
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
                  data: {
                    error_msg: "Service unavailable",
                  },
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
    }
  };

  const getBookingTablesAction = () => {
    handleOpenConfirmTable();
  };

  const confirmTables = (selectedTables, seatType) => {
    booking(selectedTables);
  };

  const booking = (tablesList) => {
    const tableIds = tablesList.map((tableData) => {
      return tableData.id;
    });
    const data = {
      ...bookingTable,
      mobileNo: `+${bookingTable.mobileNo}`,
      startTime: bookingTable.startTime,
      outletTables: tableIds.join(","),
    };
    dispatch({ type: INPROGRESS });
    UserAction.getBookingReservation(data, data.outletId)
      .then((response) => {
        if (response.status === 200) {
          handleCloseBookingTable();
          handleCloseConfirmTable();
          setBookingTable({});
          dispatch({
            type: GET_BOOKING_RESERVATION,
            data: response.data,
          });
        }
      })
      .catch((error) => {
        handleCloseConfirmTable();
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

  return (
    <React.Fragment>
      {confirmTable && (
        <ConfirmTable
          open={confirmTable}
          handleCloseConfirmTable={handleCloseConfirmTable}
          confirmTables={confirmTables}
          getTableInfo={{ ...bookingTable }}
          bookingType={"NORMAL_RESERVATION"}
        />
      )}
      .
      <Dialog open={open} onClose={handleCloseBookingTable}>
        <ValidatorForm
          onSubmit={() => getBookingTablesAction(bookingTable)}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add New Booking</DialogTitle>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FormControl fullWidth size="small" sx={{ width: "160px" }}>
                <InputLabel id="status">Booking</InputLabel>
                <Select
                  labelId="booking"
                  id="booking"
                  value={bookingTable.bookingType}
                  name="bookingType"
                  label="booking"
                  onChange={handleChangeBookingType}
                >
                  {reservationType.map((data, index) => (
                    <MenuItem key={index} value={data.id}>
                      {data.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack sx={{ width: "160px" }} className="date-picker">
                  <DesktopDatePicker
                    disabled
                    value={props.filterData.date}
                    inputFormat="DD-MM-YYYY"
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </Box>
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
                errorMessages={["First Name is required"]}
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
                errorMessages={["Last Name is required"]}
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
                validators={[ "isEmail"]}
                errorMessages={["Email is not valid"]}
              />
            </div>

            <div className="popup-input-boxs w-50">
              <Typography>Mobile Number</Typography>
              <PhoneInput
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

            <div className="popup-input-box w-50">
              {timeSlots?.length > 0 && (
                <React.Fragment>
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
                </React.Fragment>
              )}
            </div>

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
            <Button variant="outlined" onClick={handleCloseBookingTable}>
              <CloseOutlinedIcon /> Close
            </Button>
            <Button
              disabled={isEmpty(bookingTable.startTime)}
              type="submit"
              variant="contained"
            >
              NEXT
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

export default connect(null, mapDispatchToProps)(NormalBooking);
