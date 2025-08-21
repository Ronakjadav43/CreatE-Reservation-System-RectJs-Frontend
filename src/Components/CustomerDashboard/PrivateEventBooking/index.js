/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
  TextField,
  FormControlLabel,
  Checkbox,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment-timezone";
import PhoneInput from "react-phone-input-2";
import { isEmpty } from "lodash";
import ENVIRONMENT_VARIABLES from "../../../environment.config";
import * as CustomerAction from "../../../Action/Customer";
import {
  ERROR,
  INPROGRESS,
  STOPLOADER,
} from "../../../utils/Customer/Constant";
import BookingConfirmation from "../BookingConfirmation";
import "./style.scss";
import CheckoutForm from "../CheckoutForm";

const PrivateEventBooking = (props) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [dietRistriction, setDietRistriction] = useState([]);
  const [occasion, setOccasion] = useState([]);
  const [seatingPreference, setSeatingPreference] = useState([]);
  const categoryIds = [
    ENVIRONMENT_VARIABLES.Base_DIETARY_RESTRICTION,
    ENVIRONMENT_VARIABLES.Base_OCCASION,
  ];
  const saluation = [
    {
      code: 0,
      name: "Ms.",
    },
    {
      code: 1,
      name: "Miss.",
    },
    {
      code: 2,
      name: "Mdm.",
    },
    {
      code: 3,
      name: "Mrs.",
    },
    {
      code: 4,
      name: "Dr.",
    },
    {
      code: 5,
      name: "Mr.",
    },
  ];
  const paymentMonth = [
    {
      code: 0,
      name: "01",
    },
    {
      code: 1,
      name: "02",
    },
    {
      code: 2,
      name: "03",
    },
    {
      code: 3,
      name: "04",
    },
    {
      code: 4,
      name: "05",
    },
    {
      code: 5,
      name: "06",
    },

    {
      code: 6,
      name: "07",
    },
    {
      code: 7,
      name: "08",
    },
    {
      code: 8,
      name: "09",
    },
    {
      code: 9,
      name: "10",
    },
    {
      code: 10,
      name: "11",
    },
    {
      code: 11,
      name: "12",
    },
  ];

  const year = new Date().getFullYear();
  const years = Array.from(new Array(20), (val, index) => index + year);

  const [eventBooking, setEventBooking] = useState({
    bookingType: "TICKETING_EVENT",
    date: new Date(),
    noOfPerson: null,
    exactTime: "",
    name: "",
    lastName: "",
    customerCompanyName: "",
    email: "",
    mobileNo: "",
    salutation: "",
    occasion: "",
    dietaryRestriction: [],
    // cardDetails_number: null,
    // cardDetails_exp_month: null,
    // cardDetails_exp_year: null,
    // cardDetails_cvc: null,
    isOPT: false,
  });
  const [timeSlots, setTimeSlots] = useState(null);
  const [timeOut, setTimeOut] = useState(null);
  const [stripePayment, setStripePayment] = useState(null);

  useEffect(() => {
    if (categoryIds) {
      categoryIds.map((category) => {
        dispatch({ type: INPROGRESS });
        CustomerAction.getTagsByOutletCategory(category, props.event.outletId)
          .then((response) => {
            if (response.status === 200) {
              dispatch({ type: STOPLOADER });
              if (category === ENVIRONMENT_VARIABLES.Base_OCCASION) {
                setOccasion([
                  { name: "None", value: "" },
                  ...response.data.data.map((data) => {
                    return { ...data, value: data.name };
                  }),
                ]);
              } else if (
                category === ENVIRONMENT_VARIABLES.Base_SEATING_PREFRENCE
              ) {
                setSeatingPreference([
                  { name: "None", value: "" },
                  ...response.data.data.map((data) => {
                    return { ...data, value: data.name };
                  }),
                ]);
              } else {
                const mappedTag = response.data.data.map((data) => {
                  return { ...data, isChecked: false };
                });
                setDietRistriction(mappedTag);
              }
            }
          })
          .catch((error) => {
            if (error && error.response) {
              dispatch({
                type: ERROR,
                data: { error_msg: error.response.data.message },
              });
            } else {
              dispatch({
                type: ERROR,
                data: { error_msg: error.message.toString() },
              });
            }
          });
      });
    }
  }, []);

  const handleChange = (event) => {
    clearTimeout(timeOut);
    const field = event.target.name;
    let commonData = { ...eventBooking };
    commonData[field] = event.target.value;
    if (field === "noOfPerson") {
      setTimeSlots(null);
      setTimeOut(
        setTimeout(() => {
          if (
            !isEmpty(commonData.noOfPerson) &&
            commonData.noOfPerson > 0 &&
            commonData.date !== null
          ) {
            getEventTimeslot(commonData);
          }
        }, 1000)
      );
    }
    return setEventBooking(commonData);
  };

  const getEventTimeslot = (eventBooking) => {
    const data = {
      ...eventBooking,
      date: moment(eventBooking.date).format("DD-MM-YYYY"),
    };
    dispatch({ type: INPROGRESS });
    CustomerAction.getEventTimeSlot(data, props.event.id)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.data) {
            const timeSlots = response.data.data;
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
          dispatch({
            type: ERROR,
            data: { error_msg: error.response.data.message },
          });
        } else {
          dispatch({
            type: ERROR,
            data: { error_msg: error.message.toString() },
          });
        }
      });
  };

  const handleSubmit = () => {
    const filterDietaryRestriction = eventBooking.dietaryRestriction
      .filter((data) => data.isChecked)
      .map((diet) => diet.name);

    const data = {
      ...eventBooking,
      mobileNo: `+${eventBooking.mobileNo}`,
      date: moment(eventBooking.date).format("DD-MM-YYYY"),
      dietaryRestriction: filterDietaryRestriction,
    };
    dispatch({ type: INPROGRESS });

    CustomerAction.EventBookingTicket(data, props.event.id)
      .then((response) => {
        if (response.status === 201) {
          setInvoice(response.data.data);
          handleOpenConfirmationBooking();
          dispatch({
            type: STOPLOADER,
          });
        } else if (response.status === 200) {
          setStripePayment(response.data.data.client_secret);
          dispatch({ type: STOPLOADER });
        }
      })
      .catch((error) => {
        if (error && error.response) {
          dispatch({
            type: ERROR,
            data: { error_msg: error.response.data.message },
          });
        } else {
          dispatch({
            type: ERROR,
            data: { error_msg: error.message.toString() },
          });
        }
      });
  };

  const handleOpenConfirmationBooking = () => {
    setOpen(true);
  };

  const handleCloseConfirmationBooking = () => {
    setTimeSlots(null);
    setEventBooking({
      bookingType: "TICKETING_EVENT",
      date: new Date(),
      noOfPerson: "",
      exactTime: "",
      name: "",
      lastName: "",
      customerCompanyName: "",
      email: "",
      mobileNo: "",
      salutation: "",
      occasion: "",
      dietaryRestriction: [],
      // cardName: "",
      // cardDetails_number: null,
      // cardDetails_exp_month: null,
      // cardDetails_exp_year: null,
      // cardDetails_cvc: null,
      specialRequest: "",
      isOPT: false,
    });
    setOpen(false);
  };

  const handleChangeDate = (date) => {
    setTimeSlots(null);
    const data = {
      ...eventBooking,
      date: date,
    };
    if (eventBooking.noOfPerson !== null) {
      getEventTimeslot(data);
    }
    setEventBooking({
      ...data,
    });
  };

  const handleFilter = (e) => {
    const value = e.target.value[e.target.value.length - 1];
    let tempData = dietRistriction.map((data) =>
      data.id === value ? { ...data, isChecked: !data.isChecked } : data
    );
    setDietRistriction(tempData);
    handleChange({
      target: { name: "dietaryRestriction", value: [...tempData] },
    });
  };

  const handleClosePaymentPopup = () => {
    setStripePayment(null);
  };

  return (
    <React.Fragment>
      {stripePayment && (
        <CheckoutForm
          open={true}
          stripePayment={stripePayment}
          handleClosePaymentPopup={handleClosePaymentPopup}
        />
      )}

      {open && (
        <BookingConfirmation
          open={open}
          handleClose={handleCloseConfirmationBooking}
          invoice={invoice}
        />
      )}
      <div className="main-iframe">
        <ValidatorForm
          className="main-div"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="main">
            <div className="main-body">
              <div className="privateEvent-booking">
                <div className="condition-info">
                  <span className="conditions-info-text w-100">Conditions</span>
                  <div className="conditions w-100">
                    <span
                      style={{ whiteSpace: "pre-wrap" }}
                      className="conditions-text"
                    >
                      {props.company.paymentTC}
                    </span>
                  </div>
                </div>
                <h3 className="customer-header conditions-text w-100 center-text">
                  {props.event.name}
                </h3>

                <div className="conditions-form">
                  <div className="input-box">
                    <div className="input-box-inner">
                      <TextValidator
                        fullWidth
                        label="First Name"
                        type="text"
                        name="name"
                        size="small"
                        value={eventBooking.name}
                        onChange={handleChange}
                        validators={["required"]}
                        errorMessages={["First Name is required"]}
                      />
                    </div>
                  </div>

                  <div className="input-box">
                    <div className="input-box-inner">
                      <TextValidator
                        fullWidth
                        label="Last Name"
                        type="text"
                        name="lastName"
                        size="small"
                        value={eventBooking.lastName}
                        onChange={handleChange}
                        validators={["required"]}
                        errorMessages={["Last Name is required"]}
                      />
                    </div>
                  </div>

                  <div className="input-box">
                    <div className="input-box-inner">
                      <TextValidator
                        fullWidth
                        label="Company Name"
                        type="text"
                        name="customerCompanyName"
                        size="small"
                        value={eventBooking.customerCompanyName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="input-box">
                    <div className="input-box-inner">
                      <TextValidator
                        label="Email"
                        type="email"
                        name="email"
                        size="small"
                        fullWidth
                        value={eventBooking.email}
                        onChange={handleChange}
                        validators={["required", "isEmail"]}
                        errorMessages={[
                          "Email is required",
                          "email is not valid",
                        ]}
                      />
                    </div>
                  </div>

                  <div className="input-box">
                    <div className="input-box-inner">
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ width: "160px" }}
                      >
                        <label class="input">
                          <select
                            required
                            labelId="salutation"
                            size="small"
                            value={eventBooking.salutation}
                            label="Salutation"
                            type="text"
                            name="salutation"
                            inputProps={{ "aria-label": "Without label" }}
                            onChange={handleChange}
                            className="input__field"
                          >
                            {saluation.map((data, index) => (
                              <option key={index} value={data.name}>
                                {data.name}
                              </option>
                            ))}
                          </select>
                          <span class="input__label">Salutation</span>
                        </label>
                      </FormControl>
                    </div>
                  </div>

                  <div className="input-box">
                    <div className="input-box-inner">
                      <PhoneInput
                        className="w-100"
                        country={"sg"}
                        inputProps={{
                          name: "phone",
                          required: true,
                        }}
                        onChange={(phone) =>
                          handleChange({
                            target: { name: "mobileNo", value: phone },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="input-box">
                    <div className="input-box-inner date-picker1">
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        size="small"
                      >
                        <DesktopDatePicker
                          disablePast
                          label="Date"
                          name="date"
                          value={eventBooking.date}
                          onChange={(newValue) => {
                            handleChangeDate(new Date(newValue));
                          }}
                          inputFormat="DD-MM-YYYY"
                          renderInput={(params) => <TextField {...params} />}
                          maxDate={props.event.endDate}
                          minDate={props.event.startDate}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>

                  <div className="input-box">
                    <div className="input-box-inner">
                      <TextValidator
                        fullWidth
                        label="Pax"
                        type="number"
                        name="noOfPerson"
                        size="small"
                        value={eventBooking.noOfPerson}
                        onChange={handleChange}
                        validators={["required", "minNumber:1"]}
                        errorMessages={[
                          "Pax is required",
                          "Pax should be more than 1",
                        ]}
                      />
                    </div>
                  </div>
                  <div className="input-box">
                    <div className="input-box-inner">
                      {timeSlots && (
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{ width: "160px" }}
                        >
                          <label class="input">
                            <select
                              labelId="timeSlots"
                              size="small"
                              value={eventBooking.timeSlots}
                              label="timeSlots"
                              type="text"
                              name="exactTime"
                              inputProps={{ "aria-label": "Without label" }}
                              onChange={handleChange}
                              className="input__field"
                            >
                              {timeSlots.map((data, index) => (
                                <option key={index} value={data}>
                                  {data}
                                </option>
                              ))}
                            </select>
                            <span class="input__label">TimeSlots</span>
                          </label>
                        </FormControl>
                      )}
                    </div>
                  </div>

                  {occasion.length > 0 && (
                    <div className="input-box">
                      <div className="input-box-inner">
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{ width: "160px" }}
                        >
                          <label class="input">
                            <select
                              labelId="occasion"
                              size="small"
                              value={eventBooking.occasion}
                              name="occasion"
                              label="occasion"
                              inputProps={{ "aria-label": "Without label" }}
                              onChange={handleChange}
                              className="input__field"
                            >
                              {occasion.map((data, index) => (
                                <option key={index} value={data.value}>
                                  {data.name}
                                </option>
                              ))}
                            </select>
                            <span class="input__label">Occasion</span>
                          </label>
                        </FormControl>
                      </div>
                    </div>
                  )}

                  {dietRistriction.length > 0 && (
                    <div className="input-box">
                      <div className="input-box-inner">
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{ width: "160px" }}
                        >
                          <InputLabel id="occasion">
                            Dietary Restriction
                          </InputLabel>
                          <Select
                            multiple
                            labelId="dietaryRestriction"
                            size="small"
                            value={eventBooking.dietaryRestriction}
                            name="dietaryRestriction"
                            label="dietaryRestriction"
                            inputProps={{ "aria-label": "Without label" }}
                            onChange={handleFilter}
                            renderValue={(selected) => {
                              selected = eventBooking.dietaryRestriction.filter(
                                (data) => data.isChecked === true
                              );
                              const renderData = selected.map(
                                (user) => user.name
                              );
                              return renderData.join(", ");
                            }}
                          >
                            {dietRistriction.map((data) => (
                              <MenuItem key={data.id} value={data.id}>
                                <ListItemIcon>
                                  <Checkbox checked={data.isChecked} />
                                </ListItemIcon>
                                <ListItemText primary={data.name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  )}

                  <div className="input-box w-100">
                    <div className="input-box-inner">
                      <TextValidator
                        fullWidth
                        label="Special Request"
                        type="text"
                        name="specialRequest"
                        size="small"
                        multiline
                        rows={3}
                        value={eventBooking.specialRequest}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {props.event.prePayment && (
                    <React.Fragment>
                      {/* <div className="input-box w-100">
                        <h2 className="input-box-inner w-100 m-0">
                          Payment Details
                        </h2>
                      </div> */}
                      {/* <div className="input-box w-100">
                        <div className="input-box-inner">
                          <TextValidator
                            label="Card Holder Name"
                            type="text"
                            name="cardName"
                            size="small"
                            fullWidth
                            value={eventBooking.cardName}
                            placeholder="Name On Card"
                            onChange={handleChange}
                            validators={["required"]}
                            errorMessages={["Card Holder Name is required"]}
                          />
                        </div>
                      </div>

                      <div className="input-box">
                        <div className="input-box-inner">
                          <TextValidator
                            label="Card Number"
                            type="number"
                            name="cardDetails_number"
                            size="small"
                            fullWidth
                            value={eventBooking.cardDetails_number}
                            placeholder="Card Number"
                            onChange={handleChange}
                            validators={["required"]}
                            errorMessages={["Card Number is required"]}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <CreditCardIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      </div>

                      <div className="input-box w-16">
                        <div className="input-box-inner">
                          <FormControl
                            fullWidth
                            size="small"
                            sx={{ width: "165px" }}
                          >
                            <label class="input">
                              <select
                                required
                                label="MM"
                                labelId="MM"
                                size="small"
                                value={eventBooking.cardDetails_exp_month}
                                name="cardDetails_exp_month"
                                type="number"
                                placeholder="MM"
                                onChange={handleChange}
                                errorMessages={["MM is required"]}
                                InputProps={{
                                  inputProps: { min: 1 },
                                }}
                                className="input__field"
                              >

                                {paymentMonth.map((data, index) => (
                                  <option key={index} value={data.name}>
                                    {data.name}
                                  </option>
                                ))}
                              </select>
                              <span class="input__label">MM</span>
                            </label>
                          </FormControl>
                        </div>
                      </div>

                      <div className="input-box w-16">
                        <div className="input-box-inner">
                          <FormControl
                            fullWidth
                            size="small"
                            sx={{ width: "160px" }}
                          >
                            <label class="input">
                              <select
                                required
                                label="YYYY"
                                size="small"
                                value={eventBooking.cardDetails_exp_year}
                                type="number"
                                placeholder="YYYY"
                                name="cardDetails_exp_year"
                                onChange={handleChange}
                                errorMessages={["YYYY is required"]}
                                InputProps={{
                                  inputProps: { min: 1 },
                                }}
                                className="input__field"
                              >
                                
                                {years.map((data, index) => (
                                  <option key={index} value={data}>
                                    {data}
                                  </option>
                                ))}
                              </select>
                              <span class="input__label">YYYY</span>
                            </label>
                          </FormControl>
                        </div>
                      </div>
                      <div className="input-box w-16">
                        <div className="input-box-inner cvv">
                          <TextValidator
                            label="CVV"
                            type="number"
                            name="cardDetails_cvc"
                            size="small"
                            fullWidth
                            value={eventBooking.cardDetails_cvc}
                            placeholder="CVV"
                            onChange={handleChange}
                            validators={["required"]}
                            errorMessages={["CVV is required"]}
                            onInput={(e) => {
                              e.target.value = Math.max(
                                0,
                                parseInt(e.target.value)
                              )
                                .toString()
                                .slice(0, 4);
                            }}
                            InputProps={{
                              inputProps: { min: 1 },
                            }}
                          />
                        </div>
                      </div> */}
                    </React.Fragment>
                  )}

                  <div className="input-box w-100">
                    <div className="input-box-inner update-checkbox">
                      <FormControlLabel
                        label="Receive updates, news and promotions from Creatives Eateries"
                        control={
                          <Checkbox
                            checked={eventBooking.isOPT}
                            sx={{ padding: "0" }}
                            onChange={() =>
                              setEventBooking({
                                ...eventBooking,
                                isOPT: !eventBooking.isOPT,
                              })
                            }
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        }
                      />
                    </div>
                  </div>
                  <Box className="footer-btn">
                    <Button
                      onClick={props.handleBack}
                      className="inner-btn"
                      variant="contained"
                      color="inherit"
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button type="submit" variant="contained">
                      BOOK NOW
                    </Button>
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </ValidatorForm>
      </div>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: {
    customerAction: bindActionCreators(CustomerAction, dispatch),
  },
});
export default connect(null, mapDispatchToProps)(PrivateEventBooking);
