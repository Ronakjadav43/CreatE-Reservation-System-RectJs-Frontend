import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

var reader = new FileReader();

const AddTicket = (props) => {
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [imageDisplay, setImageDisplay] = useState(null);
  const { open, handleCloseTicket, handleSaveTicket } = props;
  const [ticketData, setTicketData] = useState({
    name: "",
    description: "",
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
    ticketMaxQuantity: "",
    amount: "",
    noOfPerson: "",
    timeSlotInterval: "",
    blockTable: true,
    blockSchedule: true,
    prePayment: true,
    isActive: true,
    image: null,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...ticketData };
    commonData[field] = event.target.value;
    return setTicketData(commonData);
  };

  const handleAddOutlet = () => {
    if (isImageUpload) {
      handleSaveTicket(ticketData);
      handleCloseTicket();
    }
  };

  const handleImageUpload = (event) => {
    setTicketData({
      ...ticketData,
      image: event.target.files[0],
    });
    setIsImageUpload(true);
    reader.readAsDataURL(event.target.files[0]);
  };

  reader.onload = function (e) {
    setImageDisplay(e.target.result);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleCloseTicket}
        className="user-form-dailog"
      >
        <ValidatorForm
          onSubmit={() => handleAddOutlet()}
          autoComplete="off"
          className="popup-layout"
        >
          <Box className="popup-header">
            <DialogTitle>Add New Ticketing</DialogTitle>
            <div className="switch-button">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Block Table</Typography>
                <Switch
                  name="blockTable"
                  className="switch-status"
                  checked={ticketData.blockTable}
                  onClick={() =>
                    setTicketData({
                      ...ticketData,
                      blockTable: !ticketData.blockTable,
                    })
                  }
                />
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Block Schedule</Typography>
                <Switch
                  name="blockSchedule"
                  className="switch-status"
                  checked={ticketData.blockSchedule}
                  onClick={() =>
                    setTicketData({
                      ...ticketData,
                      blockSchedule: !ticketData.blockSchedule,
                    })
                  }
                />
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Pre Payment</Typography>
                <Switch
                  name="prePayment"
                  className="switch-status"
                  checked={ticketData.prePayment}
                  onClick={() =>
                    setTicketData({
                      ...ticketData,
                      prePayment: !ticketData.prePayment,
                    })
                  }
                />
              </Stack>
            </div>
          </Box>
          <DialogContent sx={{ width: "1000px" }} className="popup-body">
            <div className="popup-input-box w-100">
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
            <div className="popup-input-box w-50">
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
                validators={["required", "minNumber:0"]}
                errorMessages={["Pax is required", "Pax should be more than 0"]}
              />
            </div>
            <div className="popup-input-box w-50">
              <Typography>Amount </Typography>
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

            <div className="popup-input-box w-50 date-picker">
              <Typography>Start Date</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                <DesktopDatePicker
                  disablePast
                  value={ticketData.startDate}
                  onChange={(newValue) => {
                    setTicketData({
                      ...ticketData,
                      startDate: new Date(newValue),
                    });
                  }}
                  inputFormat="DD-MM-YYYY"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>

            <div className="popup-input-box w-50 date-picker">
              <Typography>End Date</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  disablePast
                  value={ticketData.endDate}
                  onChange={(newValue) => {
                    setTicketData({
                      ...ticketData,
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
                  value={ticketData.openingTime}
                  onChange={(newValue) => {
                    setTicketData({
                      ...ticketData,
                      openingTime: new Date(newValue),
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
                  value={ticketData.closingTime ? ticketData.closingTime : ""}
                  onChange={(newValue) => {
                    setTicketData({
                      ...ticketData,
                      closingTime: new Date(newValue),
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>

            <div className="popup-input-box w-50">
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
            <div className="popup-input-box w-50">
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
            <div className="popup-input-box w-50">
              <Typography>TimeSlot Interval</Typography>
              <TextValidator
                fullWidth
                size="small"
                margin="normal"
                type="text"
                name="timeSlotInterval"
                value={ticketData.timeSlotInterval}
                placeholder="Enter TimeSlot Interval"
                sx={{ marginTop: 0 }}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["TimeSlot Interval is required"]}
                multiline
              />
            </div>

            <div className="popup-input-box w-50">
              <Typography>Upload Image</Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                {ticketData.image && (
                  <img
                    className="product-image"
                    src={imageDisplay}
                    alt="demo"
                  />
                )}
                <div className="primary-btn popup-btn">
                  <Button variant="contained" component="label">
                    Upload
                    <input
                      name="image"
                      accept="image/*"
                      hidden
                      type="file"
                      onChange={(event) => handleImageUpload(event)}
                    />
                  </Button>
                </div>
              </Stack>
              {!isImageUpload && <p className="danger">Image Is Required</p>}
            </div>
          </DialogContent>
          <DialogActions className="primary-btn popup-btn">
            <Button variant="outlined" onClick={handleCloseTicket}>
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
export default AddTicket;
