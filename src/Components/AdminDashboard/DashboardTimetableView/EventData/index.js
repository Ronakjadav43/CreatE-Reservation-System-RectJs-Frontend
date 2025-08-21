import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  Stack,
  TextField,
  DialogTitle,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers";

const EventData = (props) => {
  const { open, handleClose } = props;
  const [timelineData, setTimelineData] = useState({
    customer: props.selectedRow.Customer[0]?.name,
    noOfPerson: props.selectedRow.Customer[0]?.OutletInvoiceDbModel?.noOfPerson,
    bookingDate:
      props.selectedRow.Customer[0]?.OutletInvoiceDbModel?.bookingDate,
    bookingEndDate: props.selectedRow.OutletInvoice.bookingEndTime,
    bookingStartTime: props.selectedRow.OutletInvoice.bookingStartTime,
    bookingEndTime: props.selectedRow.OutletInvoice.bookingEndTime,
    mobileNo: props.selectedRow.Customer[0]?.mobileNo,
    email: props.selectedRow.Customer[0]?.email,
    outletTableName: props.selectedRow.tableName,
    specialRequest:
      props.selectedRow.Customer[0]?.OutletInvoiceDbModel?.specialRequest,
    seatingPreference:
      props.selectedRow.Customer[0]?.OutletInvoiceDbModel?.seatingPrefere ===
        null ||
      props.selectedRow.Customer[0]?.OutletInvoiceDbModel?.seatingPrefere === ""
        ? "Indoor"
        : props.selectedRow.Customer[0]?.OutletInvoiceDbModel?.seatingPrefere,
  });

  return (
    <React.Fragment>
      {timelineData && (
        <div>
          <Dialog open={open}>
            <ValidatorForm autoComplete="off" className="popup-layout">
              <Box className="popup-header">
                <DialogTitle>EVENT BOOKING</DialogTitle>
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
                    value={timelineData.customer}
                    sx={{ marginTop: 0 }}
                  />
                </div>

                <div className="popup-input-box w-50">
                  <Typography>Email</Typography>
                  <TextValidator
                    disabled
                    size="small"
                    fullWidth
                    margin="normal"
                    type="email"
                    name="email"
                    value={timelineData.email}
                    sx={{ marginTop: 0 }}
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
                    value={timelineData.noOfPerson}
                    sx={{ marginTop: 0 }}
                    InputProps={{ inputProps: { min: 1 } }}

                  />
                </div>
                <div className="popup-input-box w-50">
                  <Typography>Mobile Number</Typography>
                  <TextValidator
                    disabled
                    size="small"
                    fullWidth
                    className="mobile-number"
                    margin="normal"
                    type="text"
                    name="mobileNo"
                    value={timelineData.mobileNo}
                    sx={{ marginTop: 0 }}
                  />
                </div>
                <div className=" popup-input-box w-50">
                  <Typography>Start Date</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack sx={{ width: "160px" }} className="date-picker">
                      <DesktopDatePicker
                        disabled
                        value={timelineData.bookingDate}
                        onChange={(newValue) => {
                          setTimelineData({
                            ...timelineData,
                            bookingDate: new Date(newValue),
                          });
                        }}
                        inputFormat="DD-MM-YYYY"
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Stack>
                  </LocalizationProvider>
                </div>

                <div className="popup-input-box w-50 date-picker1">
                  <Typography>End Date</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      disabled
                      disablePast
                      value={timelineData.bookingEndDate}
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
                      value={timelineData.bookingStartTime}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>

                <div className="popup-input-box w-50 justify-end date-picker1">
                  <Typography>End Time</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileTimePicker
                      disabled
                      value={timelineData.bookingEndTime}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
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
                    value={timelineData.outletTableName}
                    sx={{ marginTop: 0 }}
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
                    value={timelineData.seatingPreference}
                    sx={{ marginTop: 0 }}
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
                    value={timelineData.specialRequest}
                    name="specialRequest"
                    sx={{ marginTop: 0 }}
                  />
                </div>
              </DialogContent>
              <DialogActions className="primary-btn popup-btn">
                <Button variant="outlined" onClick={handleClose}>
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
export default EventData;
