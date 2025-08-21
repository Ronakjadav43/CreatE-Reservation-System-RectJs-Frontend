// /* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  AccordionDetails,
  Button,
  Typography,
  DialogContent,
  Box,
  ListItemText,
  ListItemIcon,
  Checkbox,
  TextField,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  DesktopDatePicker,
  LocalizationProvider,
  MobileTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as UserAction from "../../../../Action/AdminDashboard";

import {
  ActionType,
  handlePermission,
  Modules,
} from "../../../../utils/userAccess";
import { DiningOptions } from "./DiningOptions";
import { PreorderItems } from "./PreorderItems";
import ConfirmTable from "../../BookingOverView/ListingView/ConfirmTable";
import moment from "moment-timezone";
import "./style.scss";

const InvoiceDetail = (props) => {
  const { invoice, occasion, seatingPreference } = props;
  const [customerReservation, setCustomerReservation] = useState(null);
  const [buttonValue, setButtonValue] = useState("SAVE");
  const [confirmTable, setConfirmTable] = useState(false);
  const [requestPayloadData, setRequestPayloadData] = useState(null);

  useEffect(() => {
    if (props.invoice && props.mappedDietTags)
      if (invoice.bookingType === "PRIVATE_EVENT") {
        setRequestPayloadData({
          noOfPerson: Number(props.invoice.noOfPerson),
          startDate: props.invoice.bookingStartTime,
          startTime: props.invoice.bookingStartTime,
          endDate: props.invoice.bookingEndTime,
          endTime: props.invoice.bookingEndTime,
        });
      } else {
        setRequestPayloadData({
          noOfPerson: props.invoice.noOfPerson,
          date: props.invoice.bookingDate,
          startTime: props.invoice.bookingStartTime,
        });
      }

    if (props.invoice.OutletTableBooking.length < 1) {
      setButtonValue("NEXT");
    }

    setCustomerReservation({
      specialRequest: props.invoice.specialRequest
        ? props.invoice.specialRequest
        : "",
      reservationNotes: props.invoice.reservationNotes
        ? props.invoice.reservationNotes
        : "",
      status: props.invoice ? props.invoice.status : "",
      occasion: props.invoice.occasion ? props.invoice.occasion : "",
      seatingPreference: props.invoice.seatingPreference
        ? props.invoice.seatingPreference
        : "",
      dietaryRestriction: props.mappedDietTags ? props.mappedDietTags : [],
      tables: props.invoice.OutletTableBooking.map(
        (table) => table.OutletTable.name
      ),

      /*original total */
      originalTotal: props.invoice.originalTotalAmount
        ? props.invoice.originalTotalAmount
        : "0",

      /* deposit total */
      depositTotal: props.invoice.totalAmount ? props.invoice.totalAmount : "0",

      /*Discount coupen */
      coupen: props.invoice.Coupon?.name ? props.invoice.Coupon?.name : "",

      /*Discount amount*/
      discountAmount: props.invoice.discountAmount
        ? props.invoice.discountAmount
        : "0",

      /*Before Discount total */
      beforeDiscountTotal: props.invoice.totalAmountBeforeDiscount
        ? props.invoice.totalAmountBeforeDiscount
        : "0",

      /*Customer Company Name */
      customerCompanyName: props.invoice.customerCompanyName
        ? props.invoice.customerCompanyName
        : "",

      /* paid amount */
      totalPaidAmount: props.invoice.totalPaidAmount
        ? props.invoice.totalPaidAmount
        : "0",
      paymentStatus: props.invoice?.Checkout
        ? props.invoice?.Checkout?.status
        : "",

      isPrivateTableBooked: props.invoice?.isPrivateTableBooked
        ? props.invoice.isPrivateTableBooked
        : "",
    });
  }, [props.invoice, props.mappedDietTags]);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...customerReservation };
    commonData[field] = event.target.value;
    return setCustomerReservation(commonData);
  };

  const handleFilter = (e) => {
    const value = e.target.value[e.target.value.length - 1];
    let tempData = customerReservation.dietaryRestriction.map((data) => {
      return data.id === value ? { ...data, isChecked: !data.isChecked } : data;
    });
    setCustomerReservation({
      ...customerReservation,
      dietaryRestriction: [...tempData],
    });
  };

  const handleUpdate = (invoice, data) => {
    if (buttonValue === "NEXT") {
      setConfirmTable(true);
    } else if (buttonValue === "SAVE") {
      let requestData = data;
      if (
        requestPayloadData.outletTables &&
        requestPayloadData.outletTables.length > 0
      ) {
        if (props.invoice.bookingType === "NORMAL_RESERVATION") {
          let payloadData = { ...requestPayloadData };
          payloadData.date = moment(payloadData.date).format("DD-MM-YYYY");
          payloadData.startTime = moment(payloadData.startTime)
            .tz(props.outlet?.timezone)
            .format("HH:mm");
          requestData = { ...data, tableChangeRequest: payloadData };
        } else if (props.invoice.bookingType === "PRIVATE_EVENT") {
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
        props.actions.userAction.updateCustomerReservation(
          requestData,
          invoice.id
        );
      }
    }
  };

  const handleCloseConfirmTable = () => {
    setConfirmTable(false);
    setButtonValue("SAVE");
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
      setButtonValue("SAVE");
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
      setCustomerReservation({ ...customerReservation, tables: tableNames });
    }
  };

  return (
    <React.Fragment>
      {confirmTable && invoice.bookingType === "NORMAL_RESERVATION" && (
        <ConfirmTable
          open={confirmTable}
          handleCloseConfirmTable={handleCloseConfirmTable}
          getTableInfo={{
            ...requestPayloadData,
            startTime: moment(requestPayloadData.startTime)
              .tz(props.outlet.timezone)
              .format("HH:mm"),
          }}
          bookingType={"NORMAL_RESERVATION"}
          confirmTables={confirmTables}
        />
      )}
      {confirmTable && invoice.bookingType === "PRIVATE_EVENT" && (
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

      {customerReservation && (
        <AccordionDetails>
          <ValidatorForm
            onSubmit={() => handleUpdate(invoice, customerReservation)}
            autoComplete="off"
            className="popup-header p-0"
          >
            <Box className="user-groups-search">
              <span style={{ width: "100%" }}></span>
              <div
                className="primary-btn"
                style={{
                  flexDirection: "row-reverse",
                  padding: "0px",
                }}
              >
                <Button
                  disabled={
                    handlePermission(
                      props.permission,
                      Modules.CUSTOMERMANAGEMENT,
                      ActionType.update,
                      true
                    ) ||
                    (customerReservation.tables.length < 1 &&
                      buttonValue === "UPDATE")
                  }
                  type="submit"
                  variant="contained"
                >
                  {buttonValue}
                </Button>
              </div>
            </Box>
            <div className="popup-layout">
              <div className="popup-header">
                <DialogContent sx={{ width: "600px" }} className="popup-body1">
                  <div className="popup-input-box w-33">
                    <Typography>Customer Company Name</Typography>
                    <TextValidator
                      size="small"
                      fullWidth
                      margin="normal"
                      type="text"
                      name="customerCompanyName"
                      value={customerReservation.customerCompanyName}
                      placeholder="Enter Customer Company Name"
                      sx={{ marginTop: 0 }}
                      onChange={handleChange}
                    />
                  </div>
                  {props.customer.name && (
                    <div className="popup-input-box w-33">
                      <Typography>Booked by</Typography>
                      <TextValidator
                        disabled
                        size="small"
                        fullWidth
                        margin="normal"
                        type="text"
                        name="name"
                        value={`${props.customer.name} ${props.customer.lastName}`}
                        sx={{ marginTop: 0 }}
                      />
                    </div>
                  )}
                  <div className="popup-input-box w-33">
                    <Typography>Outlet</Typography>
                    <TextValidator
                      disabled
                      size="small"
                      fullWidth
                      margin="normal"
                      type="text"
                      name="outletName"
                      value={props.outlet?.name}
                      placeholder="Enter Outlet"
                      sx={{ marginTop: 0 }}
                    />
                  </div>
                  {invoice.bookingType && (
                    <div className="popup-input-box w-33">
                      <Typography>Reservation Type</Typography>
                      <TextValidator
                        disabled
                        size="small"
                        fullWidth
                        margin="normal"
                        type="text"
                        name="bookingType"
                        value={invoice.bookingType}
                        sx={{ marginTop: 0 }}
                      />
                    </div>
                  )}
                  {(invoice.bookingType === "NORMAL_RESERVATION" ||
                    invoice.bookingType === "PRIVATE_ROOM" ||
                    invoice.bookingType === "TICKETING_EVENT") &&
                    requestPayloadData.date && (
                      <div className="popup-input-box w-33 date-picker1">
                        <Typography>Date</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopDatePicker
                            disabled={
                              invoice.bookingType === "PRIVATE_ROOM" ||
                              invoice.bookingType === "TICKETING_EVENT"
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
                        </LocalizationProvider>
                      </div>
                    )}
                  {(invoice.bookingType === "NORMAL_RESERVATION" ||
                    invoice.bookingType === "PRIVATE_ROOM" ||
                    invoice.bookingType === "TICKETING_EVENT") &&
                    requestPayloadData.startTime && (
                      <div className="popup-input-box w-33 date-picker1">
                        <Typography>Time</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileTimePicker
                            disabled={
                              invoice.bookingType === "PRIVATE_ROOM" ||
                              invoice.bookingType === "TICKETING_EVENT"
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
                  {invoice.bookingType === "PRIVATE_EVENT" &&
                    requestPayloadData.startDate && (
                      <div className="popup-input-box w-33 date-picker1">
                        <Typography>Start Date</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopDatePicker
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
                  {invoice.bookingType === "PRIVATE_EVENT" &&
                    requestPayloadData.endDate && (
                      <div className="popup-input-box w-33 date-picker1">
                        <Typography>End Date</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopDatePicker
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

                  {invoice.bookingType === "PRIVATE_EVENT" &&
                    requestPayloadData.startTime && (
                      <div className="popup-input-box w-33 date-picker1">
                        <Typography>Start Time</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileTimePicker
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
                  {invoice.bookingType === "PRIVATE_EVENT" &&
                    requestPayloadData.endTime && (
                      <div className="popup-input-box w-33 date-picker1">
                        <Typography>End Time</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileTimePicker
                            value={requestPayloadData.endTime}
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
                  <div className="popup-input-box w-33">
                    <Typography>Pax</Typography>
                    <TextValidator
                      disabled={
                        invoice.bookingType === "PRIVATE_ROOM" ||
                        invoice.bookingType === "TICKETING_EVENT"
                      }
                      size="small"
                      fullWidth
                      margin="normal"
                      type="number"
                      name="noOfPerson"
                      value={requestPayloadData.noOfPerson}
                      placeholder="Enter Pax"
                      sx={{ marginTop: 0 }}
                      onChange={handleChangeRequest}
                      validators={["required", "minNumber:1"]}
                      errorMessages={[
                        "Pax is required",
                        "Pax should be more than 1",
                      ]}
                    />
                  </div>
                  <div className="popup-input-box w-33">
                    <Typography>Special Occasion</Typography>
                    <FormControl fullWidth size="small" sx={{ width: "160px" }}>
                      <Select
                        size="small"
                        value={customerReservation?.occasion}
                        name="occasion"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={handleChange}
                      >
                        {occasion.map((data, index) => (
                          <MenuItem key={index} value={data.name}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="popup-input-box w-33">
                    <Typography>Dietary Restriction</Typography>
                    <FormControl fullWidth size="small" sx={{ width: "160px" }}>
                      <Select
                        multiple
                        size="small"
                        value={customerReservation?.dietaryRestriction}
                        name="dietaryRestriction"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={handleFilter}
                        renderValue={(selected) => {
                          selected =
                            customerReservation?.dietaryRestriction.filter(
                              (data) => data.isChecked === true
                            );
                          const renderData = selected.map((user) => user.name);
                          return renderData.join(", ");
                        }}
                      >
                        {customerReservation?.dietaryRestriction.map(
                          (data, index) => (
                            <MenuItem key={index} value={data.id}>
                              <ListItemIcon>
                                <Checkbox checked={data.isChecked} />
                              </ListItemIcon>
                              <ListItemText primary={data.name} />
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="popup-input-box w-33">
                    <Typography>Seating Preference</Typography>
                    <FormControl fullWidth size="small" sx={{ width: "160px" }}>
                      <Select
                        size="small"
                        value={customerReservation?.seatingPreference}
                        name="seatingPreference"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={handleChange}
                      >
                        {seatingPreference.map((data, index) => (
                          <MenuItem key={index} value={data.name}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="popup-input-box w-33">
                    <Typography>Table(s)</Typography>
                    <TextValidator
                      disabled
                      size="small"
                      fullWidth
                      margin="normal"
                      type="text"
                      name="text"
                      value={customerReservation.tables}
                      sx={{ marginTop: 0 }}
                    />
                  </div>
                  <div className="popup-input-box w-33">
                    <Typography>Grand Total</Typography>
                    <TextValidator
                      disabled
                      size="small"
                      fullWidth
                      margin="normal"
                      type="text"
                      name="originalTotalAmount"
                      value={customerReservation.originalTotal}
                      sx={{ marginTop: 0 }}
                    />
                  </div>
                  <div className="popup-input-box w-33">
                    <Typography>Amount Before Discount</Typography>
                    <TextValidator
                      disabled
                      size="small"
                      fullWidth
                      margin="normal"
                      type="text"
                      name="beforeDiscountAmount"
                      value={customerReservation.beforeDiscountTotal}
                      sx={{ marginTop: 0 }}
                    />
                  </div>
                  <div className="popup-input-box w-33">
                    <Typography>Deposit Total</Typography>
                    <TextValidator
                      disabled
                      size="small"
                      fullWidth
                      margin="normal"
                      type="text"
                      name="depositTotal"
                      value={customerReservation.depositTotal}
                      sx={{ marginTop: 0 }}
                    />
                  </div>
                  <div className="popup-input-box w-33">
                    <Typography>Is Private Room Booked</Typography>
                    <TextValidator
                      disabled
                      size="small"
                      fullWidth
                      margin="normal"
                      type="text"
                      name="isPrivateTableBooked"
                      value={
                        customerReservation.isPrivateTableBooked ? "Yes" : "No"
                      }
                      sx={{ marginTop: 0 }}
                    />
                  </div>
                  <div className="popup-input-box w-33">
                    <Typography>Discount Coupon</Typography>
                    <TextValidator
                      disabled
                      size="small"
                      fullWidth
                      margin="normal"
                      type="text"
                      name="coupen"
                      value={customerReservation.coupen}
                      sx={{ marginTop: 0 }}
                    />
                  </div>
                  <div className="popup-input-box w-33">
                    <Typography>Discount Amount</Typography>
                    <TextValidator
                      disabled
                      size="small"
                      fullWidth
                      margin="normal"
                      type="text"
                      name="discountAmount"
                      value={customerReservation.discountAmount}
                      sx={{ marginTop: 0 }}
                    />
                  </div>
                  <div className="popup-input-box w-33">
                    <Typography>Paid Amount</Typography>
                    <TextValidator
                      disabled
                      size="small"
                      fullWidth
                      margin="normal"
                      type="text"
                      name="totalPaidAmount"
                      value={customerReservation.totalPaidAmount}
                      placeholder="Enter Paid Amount"
                      sx={{ marginTop: 0 }}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </div>
                  <div className="popup-input-box w-33">
                    <Typography>Payment Status</Typography>
                    <TextValidator
                      disabled
                      size="small"
                      fullWidth
                      margin="normal"
                      type="text"
                      name="paymentStatus"
                      value={customerReservation.paymentStatus}
                      sx={{ marginTop: 0 }}
                    />
                  </div>
                  {props.invoice.basket && props.invoice.basket.length > 0 && (
                    <PreorderItems basket={props.invoice.basket} />
                  )}
                  {props.invoice.dinningOptions &&
                    props.invoice.dinningOptions.length > 0 && (
                      <DiningOptions
                        dinningOptions={props.invoice.dinningOptions}
                      />
                    )}
                  <div className="popup-input-box w-100">
                    <Typography>Special Instruction(s)</Typography>
                    <TextValidator
                      size="small"
                      fullWidth
                      margin="normal"
                      type="text"
                      name="specialRequest"
                      value={customerReservation.specialRequest}
                      placeholder="Enter Special Instruction"
                      sx={{ marginTop: 0 }}
                      onChange={handleChange}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </div>
                  <div className="popup-input-box w-100">
                    <Typography>Reservation Notes</Typography>
                    <TextValidator
                      size="small"
                      fullWidth
                      margin="normal"
                      type="text"
                      name="reservationNotes"
                      value={customerReservation.reservationNotes}
                      placeholder="Enter Reservation Notes"
                      onChange={handleChange}
                      sx={{ marginTop: 0 }}
                    />
                  </div>
                </DialogContent>
              </div>
            </div>
          </ValidatorForm>
        </AccordionDetails>
      )}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    userAction: bindActionCreators(UserAction, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(InvoiceDetail);
