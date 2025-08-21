/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, Fragment } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  FormControlLabel,
  Dialog,
} from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import PhoneInput from "react-phone-input-2";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import * as CustomerAction from "../../../Action/Customer";
import {
  INPROGRESS,
  STOPLOADER,
  ERROR,
} from "../../../utils/Customer/Constant";
import "../../../../node_modules/react-phone-input-2/lib/style.css";
import ENVIRONMENT_VARIABLES from "../../../environment.config";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import "./style.scss";
import CheckoutForm from "../CheckoutForm";

const ResevationStep5 = (props) => {
  const dispatch = useDispatch();
  const [dietRistriction, setDietRistriction] = useState([]);
  const [occasion, setOccasion] = useState([]);
  const [seatingPreference, setSeatingPreference] = useState([]);
  const categoryIds = [
    ENVIRONMENT_VARIABLES.Base_DIETARY_RESTRICTION,
    ENVIRONMENT_VARIABLES.Base_OCCASION,
    ENVIRONMENT_VARIABLES.Base_SEATING_PREFRENCE,
  ];

  useEffect(() => {
    document
      .getElementsByClassName("MuiPaper-elevation")[0]
      .scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (categoryIds) {
      categoryIds.map((category) => {
        dispatch({ type: INPROGRESS });
        CustomerAction.getTagsByOutletCategory(
          category,
          props.customerInfo.outletId
        )
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

  const handleFilter = (e) => {
    const value = e.target.value[e.target.value.length - 1];
    let tempData = dietRistriction.map((data) =>
      data.id === value ? { ...data, isChecked: !data.isChecked } : data
    );
    setDietRistriction(tempData);
    props.handleChange({
      target: { name: "dietaryRestriction", value: tempData },
    });
  };

  return (
    <React.Fragment>
      {props.stripePayment && (
        <CheckoutForm
          open={true}
          stripePayment={props.stripePayment}
          handleClosePaymentPopup={props.handleClosePaymentPopup}
        />
      )}

      {props.customerInfo && (
        <ValidatorForm onSubmit={props.handleComplete} autoComplete="off">
          <div className="stepper-five">
            <h1 className="stepper-header-text" style={{ margin: "0 20px" }}>
              Customer Details
            </h1>
            <div className="condition-info">
              <span className="conditions-info-text w-100">Conditions</span>
              <div className="conditions w-100">
                {props.customerInfo.dinningAmount > 0 && (
                  <span
                    style={{ whiteSpace: "pre-wrap" }}
                    className="conditions-text"
                  >
                    {props.company.paymentTC}
                  </span>
                )}
                {props.customerInfo.dinningAmount < 1 && (
                  <span
                    style={{ whiteSpace: "pre-wrap" }}
                    className="conditions-text"
                  >
                    {props.company.noPaymentTC}
                  </span>
                )}
              </div>
            </div>

            <h3
              className="customer-header"
              style={{ display: "flex", justifyContent: "center" }}
            >
              Customer Details
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
                    value={props.customerInfo.name}
                    onChange={props.handleChangeFirstName}
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
                    value={props.customerInfo.lastName}
                    onChange={props.handleChangeFirstName}
                    validators={["required"]}
                    errorMessages={["Last Name is required"]}
                  />
                </div>
              </div>

              <div className="input-box">
                <div className="input-box-inner">
                  <FormControl fullWidth size="small" sx={{ width: "160px" }}>
                    <label class="input">
                      <select
                        required
                        labelId="salutation"
                        size="small"
                        value={props.customerInfo.salutation}
                        label="Salutation"
                        type="text"
                        name="salutation"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={props.handleChange}
                        className="input__field"
                      >
                        {props.saluation.map((data, index) => (
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
                  <TextValidator
                    fullWidth
                    label="Company Name"
                    type="text"
                    name="customerCompanyName"
                    size="small"
                    value={props.customerInfo.customerCompanyName}
                    onChange={props.handleChange}
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
                    value={props.customerInfo.email}
                    onChange={props.handleChange}
                    validators={["required", "isEmail"]}
                    errorMessages={["Email is required", "email is not valid"]}
                  />
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
                      props.handleChange({
                        target: { name: "mobileNo", value: phone },
                      })
                    }
                  />
                </div>
              </div>

              {occasion.length > 1 && (
                <div className="input-box">
                  <div className="input-box-inner">
                    <FormControl fullWidth size="small" sx={{ width: "160px" }}>
                      <label class="input">
                        <select
                          labelId="occasion"
                          size="small"
                          value={props.customerInfo.occasion}
                          name="occasion"
                          label="occasion"
                          inputProps={{ "aria-label": "Without label" }}
                          onChange={props.handleChange}
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
                    <FormControl fullWidth size="small" sx={{ width: "160px" }}>
                      <InputLabel id="occasion">Dietary Restriction</InputLabel>
                      <Select
                        multiple
                        labelId="dietaryRestriction"
                        size="small"
                        value={props.customerInfo.dietaryRestriction}
                        name="dietaryRestriction"
                        label="dietaryRestriction"
                        inputProps={{ "aria-label": "Without label" }}
                        onChange={handleFilter}
                        renderValue={(selected) => {
                          selected =
                            props.customerInfo.dietaryRestriction.filter(
                              (data) => data.isChecked === true
                            );
                          const renderData = selected.map((user) => user.name);
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

              {seatingPreference.length > 1 && (
                <div className="input-box">
                  <div className="input-box-inner">
                    <FormControl fullWidth size="small" sx={{ width: "160px" }}>
                      <label class="input">
                        <select
                          labelId="Seating Preference"
                          size="small"
                          value={props.customerInfo.seatingPreference}
                          label="SeatingPreference"
                          type="text"
                          name="seatingPreference"
                          inputProps={{ "aria-label": "Without label" }}
                          onChange={props.handleChange}
                          className="input__field"
                        >
                          {seatingPreference.map((data, index) => (
                            <option key={index} value={data.value}>
                              {data.name}
                            </option>
                          ))}
                        </select>

                        <span class="input__label">Seating Preference</span>
                      </label>
                    </FormControl>
                  </div>
                </div>
              )}

              <div className="input-box w-100">
                <div className="input-box-inner">
                  <TextValidator
                    label="Special Request"
                    type="text"
                    name="specialRequest"
                    size="small"
                    fullWidth
                    multiline
                    rows={3}
                    value={props.customerInfo.specialRequest}
                    onChange={props.handleChange}
                  />
                </div>
              </div>

              <div className="input-box w-100" style={{ padding: "0 10px" }}>
                <div
                  className="input-box-inner update-checkbox"
                  style={{ gap: "10px" }}
                >
                  <FormControlLabel
                    label="Receive updates, news and promotions from Creatives Eateries"
                    control={
                      <Checkbox
                        sx={{ padding: "0" }}
                        value={props.customerInfo.isOPT}
                        onChange={() =>
                          props.handleChange({
                            target: {
                              name: "isOPT",
                              value: !props.customerInfo.isOPT,
                            },
                          })
                        }
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                  />
                </div>
              </div>

              <Box className="footer-btn">
                {props.stripePayment === null && (
                  <Button
                    variant="contained"
                    className="inner-btn"
                    color="inherit"
                    disabled={props.activeStep === 0}
                    onClick={props.handleBack}
                  >
                    Back
                  </Button>
                )}
                {props.stripePayment === null && (
                  <Button type="submit" variant="contained">
                    BOOK NOW
                  </Button>
                )}
              </Box>
            </div>
          </div>
        </ValidatorForm>
      )}
    </React.Fragment>
  );
};
const mapDispatchToProps = (dispatch) => ({
  actions: {
    customerAction: bindActionCreators(CustomerAction, dispatch),
  },
});
export default connect(null, mapDispatchToProps)(ResevationStep5);
