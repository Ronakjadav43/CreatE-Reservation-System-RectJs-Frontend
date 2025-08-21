/* eslint-disable array-callback-return */
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
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect, useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import PhoneInput from "react-phone-input-2";

import * as UserAction from "../../../../../Action/AdminDashboard";
import {
  ERROR,
  GET_BOOKING_RESERVATION_EVENT,
  INPROGRESS,
  LOGOUT,
} from "../../../../../utils/AdminDashboard/Constant";
import { clearAccessToken } from "../../../../../utils";
import ConfirmTable from "../ConfirmTable";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import "./style.scss";

let moment = require("moment-timezone");
var reader = new FileReader();

const EventBooking = (props) => {
  const dispatch = useDispatch();
  const { open, handleCloseEventTable, handleChangeBookingType } = props;
  const [filename, setFileName] = useState([]);
  const [confirmTable, setConfirmTable] = useState(false);
  const reservationType = [
    { id: "NORMAL_RESERVATION", value: "New Booking" },
    { id: "PRIVATE_EVENT", value: "New Event" },
  ];
  const [bookingTable, setBookingTable] = useState({
    outletId: props.selectedOutlet.outlet.id,
    date: new Date(),
    name: "",
    lastName: "",
    email: null,
    noOfPerson: null,
    price: null,
    mobileNo: "",
    bookingType: reservationType[1].id,
    specialRequest: "",
    outletTables: "",
    time: "",
    maxEventPax: "",
    mealSession: "",
    image: [],
    startDate: new Date(
      new Date().toLocaleString("en-US", {
        timeZone: props.timezone,
      })
    ),
    endDate: new Date(
      new Date().toLocaleString("en-US", {
        timeZone: props.timezone,
      })
    ),
    startTime: new Date(
      new Date().toLocaleString("en-US", {
        timeZone: props.timezone,
      })
    ),
    endTime: new Date(
      new Date().toLocaleString("en-US", {
        timeZone: props.timezone,
      })
    ),
  });

  const selectedOutlet = useSelector(
    (state) => state.hotelReducer.selectedOutlet
  );

  const handleImageUpload = (event) => {
    const imageList = [...filename];
    reader.readAsDataURL(event.target.files[0]);
    imageList.push(event.target.files[0]);
    setFileName(imageList);
    setBookingTable({
      ...bookingTable,
      image: imageList,
    });
  };

  useEffect(() => {
    if (selectedOutlet) {
      setBookingTable({
        ...bookingTable,
        outletId: selectedOutlet.outlet.id,
      });
    }
  }, [selectedOutlet]);

  const handleChangeBookingTable = (event) => {
    const field = event.target.name;
    let commonData = { ...bookingTable };
    commonData[field] = event.target.value;
    return setBookingTable(commonData);
  };

  const handleCloseConfirmTable = () => {
    setConfirmTable(false);
  };

  const handleOpenConfirmTable = () => {
    setConfirmTable(true);
  };

  const getBookingTablesAction = () => {
    handleOpenConfirmTable();
  };

  const confirmTables = (selectedRow, seatType) => {
    const tableIds = selectedRow.map((tableData) => {
      return tableData.id;
    });
    const data = {
      ...bookingTable,
      mobileNo: `+${bookingTable.mobileNo}`,
      outletTables: tableIds.join(","),
      startDate: moment(bookingTable.startDate).format("DD-MM-YYYY"),
      endDate: moment(bookingTable.endDate).format("DD-MM-YYYY"),
      startTime: moment(bookingTable.startTime).format("HH:mm"),
      endTime: moment(bookingTable.endTime).format("HH:mm"),
    };
    dispatch({ type: INPROGRESS });
    UserAction.createBookingReservationEvent({ ...data }, data.outletId)
      .then((response) => {
        if (response.status === 200) {
          handleCloseEventTable();
          handleCloseConfirmTable();
          setBookingTable({});
          dispatch({
            type: GET_BOOKING_RESERVATION_EVENT,
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

  const handleRemoveFile = (file) => {
    const listOfFile = [...filename];
    let findFile = listOfFile.find((files) => files.name === file.name);
    if (findFile) {
      let index = filename.indexOf(findFile);
      listOfFile.splice(index, 1);
    }
    setFileName(listOfFile);
    setBookingTable({ ...bookingTable, image: listOfFile });
  };

  return (
    <React.Fragment>
      {confirmTable && (
        <ConfirmTable
          open={confirmTable}
          handleCloseConfirmTable={handleCloseConfirmTable}
          confirmTables={confirmTables}
          getTableInfo={{
            ...bookingTable,
          }}
          bookingType={"PRIVATE_EVENT"}
        />
      )}
      <Dialog open={open} onClose={handleCloseEventTable}>
        <ValidatorForm
          onSubmit={() => getBookingTablesAction()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add New Event</DialogTitle>
            <FormControl fullWidth size="small" sx={{ width: "200px" }}>
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
                validators={["isEmail"]}
                errorMessages={["Email is not valid"]}
              />
            </div>

            <div className="popup-input-boxs w-50">
              <Typography>Mobile Number</Typography>
              <PhoneInput
                required
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

            <div className="popup-input-box w-50 date-picker1">
              <Typography>Start Date</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                <DesktopDatePicker
                  disablePast
                  value={bookingTable.startDate}
                  onChange={(newValue) => {
                    setBookingTable({
                      ...bookingTable,
                      startDate: new Date(newValue),
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
                  disablePast
                  value={bookingTable.endDate}
                  onChange={(newValue) => {
                    setBookingTable({
                      ...bookingTable,
                      endDate: new Date(newValue),
                    });
                  }}
                  inputFormat="DD-MM-YYYY"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>

            <div className="popup-input-box w-50 date-picker">
              <Typography>Start Time</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  value={bookingTable.startTime ? bookingTable.startTime : ""}
                  onChange={(newValue) => {
                    setBookingTable({
                      ...bookingTable,
                      startTime: new Date(newValue),
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>

            <div className="popup-input-box w-50 justify-end date-picker">
              <Typography>End Time</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  value={bookingTable.endTime ? bookingTable.endTime : ""}
                  onChange={(newValue) => {
                    setBookingTable({
                      ...bookingTable,
                      endTime: new Date(newValue),
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
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
              <Typography>Event Value</Typography>
              <TextValidator
                size="small"
                fullWidth
                margin="normal"
                type="number"
                name="price"
                value={bookingTable.price}
                placeholder="Enter Event Value"
                sx={{ marginTop: 0 }}
                onChange={handleChangeBookingTable}
                validators={["required", "minNumber:0"]}
                errorMessages={[
                  "Event Value is required",
                  "Event Value should not be Negative",
                ]}
              />
            </div>

            <div className="popup-input-box w-50">
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

            <div className="popup-input-box w-50">
              <Typography>Meal Session</Typography>
              <FormControl>
                <Select
                  required
                  size="small"
                  value={bookingTable.mealSession}
                  name="mealSession"
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={handleChangeBookingTable}
                >
                  {props.mealSessions.map((data, index) => (
                    <MenuItem key={index} value={data.name}>
                      {data.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="uploaded-file">
              <div className=" popup-input-box w-100">
                <Typography className="w-100">Attachment</Typography>
              </div>

              <Button
                className="upload-inner shadow-hide"
                disabled={filename.length > 9}
                variant="contained"
                component="label"
              >
                Upload
                <input
                  name="image"
                  accept=".jpg, .pdf, .png, .jpeg, .tif, .tiff, .ppt, .pptx, .doc, .docx, .xls, .xlsx "
                  hidden
                  type="file"
                  onChange={(event) => handleImageUpload(event)}
                />
              </Button>
              {/* </div> */}
              {filename.map((file) => (
                <span className="upload-inner m-0" title={file.name}>
                  <span className="uploade-img"> {file.name}</span>
                  <DeleteOutlinedIcon
                    className=""
                    onClick={() => handleRemoveFile(file)}
                  />
                </span>
              ))}
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseEventTable}>
              <CloseOutlinedIcon /> Close
            </Button>
            <Button type="submit" variant="contained">
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

export default connect(null, mapDispatchToProps)(EventBooking);
