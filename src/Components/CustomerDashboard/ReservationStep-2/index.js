/* eslint-disable react-hooks/exhaustive-deps */
import { Button, FormControl, OutlinedInput, TextField } from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { Box } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { isEmpty } from "lodash";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import * as CustomerAction from "../../../Action/Customer";
import ENVIRONMENT_VARIABLES from "../../../environment.config";
import {
  ERROR,
  INPROGRESS,
  STOPLOADER,
} from "../../../utils/Customer/Constant";
import "./style.scss";

let moment = require("moment-timezone");

const ResevationStep2 = (props) => {
  const dispatch = useDispatch();
  const [outletTimeslots, setOutletTimeslots] = useState(null);
  const [selectedOutletImg, setSelectedOutletImg] = useState(null);
  const [reservationData, setReservationData] = useState({
    bookingType: "",
    date: null,
    noOfPerson: "",
    preferredTime: null,
    outletId: "",
  });
  const [timeOut, setTimeOut] = useState(null);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(() => {
    if (props.customerReservationData && props.companyOutlets) {
      let commonData = { ...reservationData };

      const selectedOutlet = props.companyOutlets.find(
        (outlet) => outlet.id === props.customerReservationData.outletId
      );
      if (selectedOutlet) {
        setSelectedOutletImg(selectedOutlet);
      } else {
        setSelectedOutletImg(props.companyOutlets[0]);
      }

      if (props.customerReservationData.outletId) {
        commonData = {
          ...commonData,
          outletId: props.customerReservationData.outletId,
        };
      } else if (props.companyOutlets.length > 0) {
        commonData = {
          ...commonData,
          outletId: props.companyOutlets[0].id,
        };
      }
      if (props.customerReservationData.date) {
        commonData = {
          ...commonData,
          date: props.customerReservationData.date,
        };
      }
      if (props.customerReservationData.noOfPerson) {
        commonData = {
          ...commonData,
          noOfPerson: props.customerReservationData.noOfPerson,
        };
      }
      if (props.customerReservationData.noOfPerson) {
        commonData = {
          ...commonData,
          noOfPerson: props.customerReservationData.noOfPerson,
        };
      }
      if (props.customerReservationData.preferredTime) {
        commonData = {
          ...commonData,
          preferredTime: props.customerReservationData.preferredTime,
        };
      }
      if (props.customerReservationData.bookingType) {
        commonData = {
          ...commonData,
          bookingType: props.customerReservationData.bookingType,
        };
      }

      if (commonData.outletId && commonData.noOfPerson && commonData.date) {
        getOutletTimeslot(commonData);
      }
      setReservationData({ ...commonData });
    }
  }, [props.customerReservationData, props.companyOutlets]);

  const handleChange = (event) => {
    const field = event.target.name;
    let commonData = { ...reservationData };
    commonData[field] = event.target.value;
    if (field === "outletId") {
      const selectedOutlet = props.companyOutlets.find(
        (data) => data.id === event.target.value
      );
      if (selectedOutlet) {
        setSelectedOutletImg(selectedOutlet);
      }

      setOutletTimeslots(null);
      return setReservationData({
        ...commonData,
        bookingType: "",
        date: new Date(
          new Date().toLocaleString("en-US", {
            timeZone: props.timezone,
          })
        ),
        noOfPerson: "",
        preferredTime: null,
      });
    }
    return setReservationData(commonData);
  };

  const handleChangeDateAndPax = (event) => {
    setOutletTimeslots(null);
    clearTimeout(timeOut);
    const field = event.target.name;
    let commonData = { ...reservationData };
    commonData[field] = event.target.value;
    setTimeOut(
      setTimeout(() => {
        if (!isEmpty(commonData.noOfPerson) && commonData.noOfPerson > 0)
          getOutletTimeslot(commonData);
      }, 1000)
    );
    return setReservationData(commonData);
  };

  const getOutletTimeslot = (reservationData) => {
    if (reservationData.outletId !== "") {
      setReservationData({
        ...reservationData,
        preferredTime: null,
      });
      const data = {
        ...reservationData,
        date: moment(reservationData.date, "YYYY-MM-DD").format("DD-MM-YYYY"),
      };
      dispatch({ type: INPROGRESS });
      CustomerAction.getOutletTimeslot(data)
        .then((response) => {
          if (response.status === 200) {
            if (response.data.data) {
              const timeSlots = response.data.data[0]?.timeSlots;
              if (timeSlots && timeSlots.length > 0) {
                setOutletTimeslots(timeSlots);
                setReservationData({
                  ...reservationData,
                  preferredTime: timeSlots[0],
                });
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
    }
  };

  const handleSubmit = () => {
    props.setReservationData(reservationData);
  };

  return (
    <React.Fragment>
      <ValidatorForm onSubmit={handleSubmit} autoComplete="off">
        <div className="stepper-two">
          <div className="stepper-two-left">
            <h1 className="stepper-header-text">Select Reservation Type</h1>
            <div className="location">
              {/* <InputLabel id="location">Location</InputLabel>
              <select
                size="small"
                label="Location"
                labelId="location"
                value={reservationData.outletId}
                name="outletId"
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                onChange={handleChange}
                class="input__field"
              >
                {props.companyOutlets.map((outlet, index) => (
                  <option key={index} value={outlet.id}>
                    {outlet.name}
                  </option>
                ))}
              </select> */}
              <label class="input">
                <select
                  size="small"
                  label="Location"
                  labelId="location"
                  value={reservationData.outletId}
                  name="outletId"
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={handleChange}
                  className="input__field"
                >
                  {props.companyOutlets.map((outlet, index) => (
                    <option key={index} value={outlet.id}>
                      {outlet.name}
                    </option>
                  ))}
                </select>
                <span class="input__label">Location</span>
              </label>
            </div>

            <div className="date-picker-div">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                sx={{ with: "100%" }}
              >
                <StaticDatePicker
                  sx={{ with: "100%" }}
                  disablePast
                  displayStaticWrapperAs="desktop"
                  label="Week picker"
                  value={reservationData.date}
                  onChange={(newValue) => {
                    handleChangeDateAndPax({
                      target: { name: "date", value: new Date(newValue) },
                    });
                  }}
                  inputFormat="DD-MM-YYYY"
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
          </div>

          <div className="right-side">
            <div className="right-side-inner">
              <span className="restaurant-text">Selected Restaurant</span>

              <Accordion className="accordion-div" defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                  className="accordion-summary"
                >
                  <div className="restaurant-card">
                    {selectedOutletImg && (
                      <img
                        src={`${ENVIRONMENT_VARIABLES.Base_IMAGE_URL}${selectedOutletImg.image}`}
                        alt="imgs"
                      />
                    )}

                    <div className="restaurant-card-inner">
                      <span className="card-name">Restaurant Reservation</span>
                      <span className="card-pax">
                        <PeopleAltIcon />
                        <span>
                          {props.company.minPax ? props.company.minPax : 0}-
                          {props.company.maxPax ? props.company.maxPax : 0} pax
                        </span>
                      </span>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "0",
                  }}
                >
                  <div className="time" style={{ marginTop: "20px" }}>
                    <div className="">
                      <TextValidator
                        fullWidth
                        size="small"
                        sx={{ marginTop: 0 }}
                        margin="normal"
                        type="number"
                        name="noOfPerson"
                        label="No. of Guests"
                        value={reservationData.noOfPerson}
                        onChange={handleChangeDateAndPax}
                        validators={["required", "minNumber:1"]}
                        errorMessages={[
                          "No. of Guests is required",
                          "No. of Guests should be more than 1",
                        ]}
                      />
                    </div>
                    <div className="">
                      <React.Fragment>
                        {outletTimeslots?.length > 0 && (
                          <FormControl
                            sx={{ width: "100%" }}
                            size="small"
                            className="right-side-selection"
                          >
                            {/* <InputLabel id="Select-Time">
                              Select a Time
                            </InputLabel> */}
                            <label class="input">
                              <select
                                size="small"
                                label="Select a Time"
                                labelId="Select-Time"
                                value={reservationData.preferredTime}
                                name="preferredTime"
                                onChange={handleChange}
                                input={<OutlinedInput label="Select a Time" />}
                                MenuProps={MenuProps}
                                className="input__field"
                              >
                                {outletTimeslots?.map((timeslot, index) => (
                                  <option key={index} value={timeslot}>
                                    {timeslot}
                                  </option>
                                ))}
                              </select>
                              <span class="input__label">Select a Time</span>
                            </label>
                          </FormControl>
                        )}
                      </React.Fragment>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>

            <Box className="footer-btn">
              <Button
                disabled={props.events.length < 1}
                variant="contained"
                className="inner-btn"
                color="inherit"
                onClick={props.handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>

              <Button
                disabled={isEmpty(reservationData.preferredTime)}
                type="submit"
                sx={{ mr: 1 }}
                variant="contained"
              >
                Find Availability
              </Button>
            </Box>
          </div>
        </div>
      </ValidatorForm>
    </React.Fragment>
  );
};
const mapDispatchToProps = (dispatch) => ({
  actions: {
    customerAction: bindActionCreators(CustomerAction, dispatch),
  },
});
export default connect(null, mapDispatchToProps)(ResevationStep2);
