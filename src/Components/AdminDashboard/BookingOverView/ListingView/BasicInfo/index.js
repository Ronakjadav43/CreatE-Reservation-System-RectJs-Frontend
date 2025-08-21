/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  Stack,
  TextField,
} from "@mui/material";
import {
  DesktopDatePicker,
  LocalizationProvider,
  MobileTimePicker,
} from "@mui/x-date-pickers";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { bindActionCreators } from "redux";
import { useNavigate } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import * as UserAction from "../../../../../Action/AdminDashboard";
import "./style.scss";
import ENVIRONMENT_VARIABLES from "../../../../../environment.config";
import moment from "moment-timezone";
import ConfirmTable from "../ConfirmTable";
import { RESET_INVOICE_DETAILS } from "../../../../../utils/AdminDashboard/Constant";

const BasicInfo = (props) => {
  const navigate = useNavigate();
  const redirect = (url) => {
    navigate(url, 2);
  };
  const { open, handleCloseEditBasicInfo } = props;
  const dispatch = useDispatch();
  const [imageDisplay, setImageDisplay] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [requestPayloadData, setRequestPayloadData] = useState(null);
  const [buttonValue, setButtonValue] = useState("UPDATE");
  const [confirmTable, setConfirmTable] = useState(false);

  const hotelReducer = useSelector((state) => ({
    selectedOutlet: state.hotelReducer.selectedOutlet,
    invoices: state.hotelReducer.invoices,
  }));

  useEffect(() => {
    if (props.selectedInvoice) {
      props.actions.userAction.getInvoice(props.selectedInvoice.id);
    }
    return () => {
      dispatch({
        type: RESET_INVOICE_DETAILS,
      });
    };
  }, []);

  useEffect(() => {
    if (hotelReducer.invoices) {
      let outletTableName = "";
      hotelReducer.invoices.OutletTableBooking.map((sequenceTable, index) => {
        if (index === 0) outletTableName += sequenceTable.OutletTable.name;
        else outletTableName += "," + sequenceTable.OutletTable.name;
        return null;
      });

      if (outletTableName === "") {
        setButtonValue("NEXT");
      }

      if (hotelReducer.invoices.bookingType === "PRIVATE_EVENT") {
        setRequestPayloadData({
          noOfPerson: hotelReducer.invoices.noOfPerson,
          startDate: hotelReducer.invoices.bookingStartTime,
          startTime: hotelReducer.invoices.bookingStartTime,
          endDate: hotelReducer.invoices.bookingEndTime,
          endTime: hotelReducer.invoices.bookingEndTime,
        });
      } else {
        setRequestPayloadData({
          noOfPerson: hotelReducer.invoices.noOfPerson,
          date: hotelReducer.invoices.bookingDate,
          startTime: hotelReducer.invoices.bookingStartTime,
        });
      }
      setInvoiceData({ ...hotelReducer.invoices, outletTableName });
    }
  }, [hotelReducer.invoices]);

  useEffect(() => {
    if (hotelReducer.selectedOutlet) {
      setImageDisplay(
        `${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${hotelReducer.selectedOutlet.outlet.image}`
      );
    }
  }, [hotelReducer.selectedOutlet]);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...invoiceData };
    commonData[field] = event.target.value;
    return setInvoiceData(commonData);
  };

  const handleInvoiceChange = (data) => {
    const { status, id } = data;
    const newStatus = { status: status };
    props.actions.userAction.updateInvoiceStatus(newStatus, id);
  };

  const handleUpdateStatus = (invoiceId) => {
    const data = { ...invoiceData, status: "CONFIRMED", invoiceId };
    handleInvoiceChange(data);
    handleCloseEditBasicInfo();
  };

  const handleEditOutlet = (invoice, data) => {
    if (buttonValue === "NEXT") {
      setConfirmTable(true);
    } else if (buttonValue === "UPDATE") {
      let requestData = data;
      if (
        requestPayloadData.outletTables &&
        requestPayloadData.outletTables.length > 0
      ) {
        if (data.bookingType === "NORMAL_RESERVATION") {
          let payloadData = { ...requestPayloadData };
          payloadData.date = moment(payloadData.date).format("DD-MM-YYYY");
          payloadData.startTime = moment(payloadData.startTime)
            .tz(props.outlet?.timezone)
            .format("HH:mm");
          requestData = { ...data, tableChangeRequest: payloadData };
        } else if (data.bookingType === "PRIVATE_EVENT") {
          let payloadData = { ...requestPayloadData };
          payloadData.date = moment(payloadData.startDate).format("DD-MM-YYYY");
          payloadData.startTime = moment(payloadData.startTime)
            .tz(props.outlet?.timezone)
            .format("HH:mm");
          payloadData.endDate = moment(payloadData.endDate).format(
            "DD-MM-YYYY"
          );
          payloadData.endTime = moment(payloadData.endTime)
            .tz(props.outlet?.timezone)
            .format("HH:mm");

          requestData = { ...data, tableChangeRequest: payloadData };
        }
      }
      if (requestData) {
        props.actions.userAction.updateInvoiceStatus(requestData, invoice.id);
        handleCloseEditBasicInfo();
      }
    }
  };

  const handleCloseConfirmTable = () => {
    setConfirmTable(false);
    setButtonValue("UPDATE");
  };

  const handleChangeRequest = (event) => {
    setButtonValue("NEXT");
    const tempData = { ...requestPayloadData };
    tempData.noOfPerson = event.target.value;
    setRequestPayloadData(tempData);
  };

  const confirmTables = (selectedTables, seatType) => {
    if (selectedTables.length > 0) {
      setConfirmTable(false);
      setButtonValue("UPDATE");
      const tableIds = selectedTables.map((tableData) => {
        return tableData.id;
      });
      const tableNames = selectedTables.map((tableData) => {
        return tableData.name;
      });
      setRequestPayloadData({
        ...requestPayloadData,
        outletTables: tableIds,
      });
      setInvoiceData({ ...invoiceData, outletTableName: tableNames });
    }
  };

  return (
    <React.Fragment>
      {confirmTable && invoiceData.bookingType === "NORMAL_RESERVATION" && (
        <ConfirmTable
          open={confirmTable}
          handleCloseConfirmTable={handleCloseConfirmTable}
          getTableInfo={{
            ...requestPayloadData,
            startTime: moment(requestPayloadData.startTime)
              .tz(hotelReducer.selectedOutlet.outlet.timezone)
              .format("HH:mm"),
          }}
          bookingType={"NORMAL_RESERVATION"}
          confirmTables={confirmTables}
        />
      )}
      {confirmTable && invoiceData.bookingType === "PRIVATE_EVENT" && (
        <ConfirmTable
          open={confirmTable}
          handleCloseConfirmTable={handleCloseConfirmTable}
          getTableInfo={{
            ...requestPayloadData,
          }}
          bookingType={"PRIVATE_EVENT"}
          confirmTables={confirmTables}
        />
      )}
      {invoiceData && (
        <div>
          <Dialog open={open} onClose={handleCloseEditBasicInfo}>
            <ValidatorForm
              onSubmit={() =>
                handleEditOutlet(props.selectedInvoice, invoiceData)
              }
              autoComplete="off"
              className="popup-layout"
            >
              <Box className="popup-header w-100">
                <div className="view">
                  <div className="header-inner">
                    <span className="header-inner-text">
                      0 Group Visits | 0 Brand Visits |&nbsp;
                      {invoiceData.Customer.cancelation} Cancelled |&nbsp;
                      {invoiceData.Customer.noShow} No Show
                    </span>
                    <span
                      className="header-inner-text"
                      onClick={() =>
                        redirect(
                          `/Admin/CustomerManagement/${props.selectedInvoice.customerId}`
                        )
                      }
                    >
                      view profile
                      <OpenInNewIcon />
                    </span>
                  </div>

                  <div className="header-inner">
                    <span className="header-inner-text1">
                      {invoiceData.Customer?.name}&nbsp;
                      {invoiceData.Customer?.lastName}
                    </span>
                    {props.selectedInvoice.status === "BOOKED" && (
                      <Button
                        disabled={props.hasUpdatePermissoin}
                        className="btn"
                        sx={{ width: "90px", height: "40px" }}
                        variant="contained"
                        onClick={() => handleUpdateStatus()}
                      >
                        Confirmed
                      </Button>
                    )}
                  </div>

                  <div className="header-inner">
                    <span className="header-inner-text2">
                      <LocalPhoneOutlinedIcon />
                      {invoiceData.Customer?.mobileNo}
                    </span>
                  </div>

                  <div className="header-inner">
                    <span className="header-inner-text2">
                      <EmailOutlinedIcon />
                      {invoiceData.Customer?.email}
                    </span>
                  </div>

                  <div
                    className="header-inner"
                    style={{ justifyContent: "flex-start" }}
                  >
                    <span className="header-inner-text3">
                      <img
                        className="product-image"
                        src={imageDisplay}
                        alt="outletImage"
                      />
                    </span>
                    <div className="header-inner-sub">
                      <span className="header-inner-text4">
                        {invoiceData.Outlet.name}
                      </span>
                      <span className="header-inner-text2">
                        {invoiceData.bookingType}
                      </span>
                    </div>
                  </div>
                </div>
              </Box>

              <DialogContent sx={{ maxWidth: "1000px" }} className="popup-body">
                {(invoiceData.bookingType === "NORMAL_RESERVATION" ||
                  invoiceData.bookingType === "PRIVATE_ROOM" ||
                  invoiceData.bookingType === "TICKETING_EVENT") && (
                  <div className=" popup-input-box w-50 date-picker1">
                    <Typography>Date</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack sx={{ width: "160px" }} className="date-picker">
                        <DesktopDatePicker
                          disabled={
                            invoiceData.bookingType === "PRIVATE_ROOM" ||
                            invoiceData.bookingType === "TICKETING_EVENT"
                          }
                          value={requestPayloadData.date}
                          onChange={(newValue) => {
                            setRequestPayloadData({
                              ...requestPayloadData,
                              date: new Date(newValue),
                            });
                            setButtonValue("NEXT");
                          }}
                          inputFormat="DD-MM-YYYY"
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Stack>
                    </LocalizationProvider>
                  </div>
                )}

                {(invoiceData.bookingType === "NORMAL_RESERVATION" ||
                  invoiceData.bookingType === "PRIVATE_ROOM" ||
                  invoiceData.bookingType === "TICKETING_EVENT") && (
                  <div className="popup-input-box w-50 date-picker1">
                    <Typography>Time</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileTimePicker
                        disabled={
                          invoiceData.bookingType === "PRIVATE_ROOM" ||
                          invoiceData.bookingType === "TICKETING_EVENT"
                        }
                        value={requestPayloadData.startTime}
                        onChange={(newValue) => {
                          setRequestPayloadData({
                            ...requestPayloadData,
                            startTime: new Date(newValue),
                          });
                          setButtonValue("NEXT");
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                )}

                {invoiceData.bookingType === "PRIVATE_EVENT" && (
                  <div className="popup-input-box w-50 date-picker1">
                    <Typography>Start Date</Typography>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      size="small"
                    >
                      <DesktopDatePicker
                        disablePast
                        value={requestPayloadData.startDate}
                        onChange={(newValue) => {
                          setRequestPayloadData({
                            ...requestPayloadData,
                            startDate: new Date(newValue),
                          });
                          setButtonValue("NEXT");
                        }}
                        inputFormat="DD-MM-YYYY"
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                )}
                {invoiceData.bookingType === "PRIVATE_EVENT" && (
                  <div className="popup-input-box w-50 date-picker1">
                    <Typography>End Date</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        disablePast
                        value={requestPayloadData.endDate}
                        onChange={(newValue) => {
                          setRequestPayloadData({
                            ...requestPayloadData,
                            endDate: new Date(newValue),
                          });
                          setButtonValue("NEXT");
                        }}
                        inputFormat="DD-MM-YYYY"
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                )}
                {invoiceData.bookingType === "PRIVATE_EVENT" && (
                  <div className="popup-input-box w-50 date-picker">
                    <Typography>Start Time</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileTimePicker
                        value={
                          requestPayloadData.startTime
                            ? requestPayloadData.startTime
                            : ""
                        }
                        onChange={(newValue) => {
                          setRequestPayloadData({
                            ...requestPayloadData,
                            startTime: new Date(newValue),
                          });
                          setButtonValue("NEXT");
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                )}
                {invoiceData.bookingType === "PRIVATE_EVENT" && (
                  <div className="popup-input-box w-50 justify-end date-picker">
                    <Typography>End Time</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileTimePicker
                        value={
                          requestPayloadData.endTime
                            ? requestPayloadData.endTime
                            : ""
                        }
                        onChange={(newValue) => {
                          setRequestPayloadData({
                            ...requestPayloadData,
                            endTime: new Date(newValue),
                          });
                          setButtonValue("NEXT");
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                )}

                <div className="popup-input-box w-50">
                  <Typography>Customer Name</Typography>
                  <TextValidator
                    disabled
                    size="small"
                    fullWidth
                    margin="normal"
                    type="text"
                    name="customer"
                    value={`${invoiceData.Customer?.name} ${invoiceData.Customer?.lastName}`}
                    placeholder="Enter Customer Name"
                    sx={{ marginTop: 0 }}
                    validators={["required"]}
                    errorMessages={["First Name is required"]}
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
                    value={invoiceData.Customer?.email}
                    sx={{ marginTop: 0 }}
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
                    value={invoiceData.Customer?.mobileNo}
                    placeholder="Enter Mobile Number"
                    sx={{ marginTop: 0 }}
                    validators={["required"]}
                    errorMessages={["Mobile Number is required"]}
                  />
                </div>

                <div className="popup-input-box w-50">
                  <Typography>Pax</Typography>
                  <TextValidator
                    disabled={
                      invoiceData.bookingType === "PRIVATE_ROOM" ||
                      invoiceData.bookingType === "TICKETING_EVENT"
                    }
                    fullWidth
                    size="small"
                    margin="normal"
                    type="number"
                    name="noOfPerson"
                    value={requestPayloadData.noOfPerson}
                    placeholder="Enter Pax"
                    sx={{ marginTop: 0 }}
                    validators={["required", "minNumber:1"]}
                    errorMessages={[
                      "Pax is required",
                      "Pax should be more than 1",
                    ]}
                    onChange={handleChangeRequest}
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
                    value={invoiceData.outletTableName}
                    placeholder="Enter Table No"
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
                    value={invoiceData.seatingPreference}
                    placeholder="Enter Table Preference"
                    sx={{ marginTop: 0 }}
                  />
                </div>

                <div className="popup-input-box w-50">
                  <Typography>Special Request</Typography>
                  <TextValidator
                    fullWidth
                    size="small"
                    margin="normal"
                    type="text"
                    value={invoiceData.specialRequest}
                    placeholder="Enter Special Request"
                    name="specialRequest"
                    sx={{ marginTop: 0 }}
                    onChange={handleChange}
                  />
                </div>
              </DialogContent>
              <DialogActions className="primary-btn popup-btn">
                <Button variant="outlined" onClick={handleCloseEditBasicInfo}>
                  <CloseOutlinedIcon /> Close
                </Button>
                <Button
                  disabled={
                    props.hasUpdatePermissoin ||
                    (invoiceData.outletTableName === "" &&
                      buttonValue === "UPDATE")
                  }
                  type="submit"
                  variant="contained"
                >
                  {buttonValue === "UPDATE" && <SaveOutlinedIcon />}
                  {buttonValue}
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

export default connect(null, mapDispatchToProps)(BasicInfo);
